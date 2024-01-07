use actix_web::web::scope;
use tokio::process::Command;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader, BufWriter};
use actix::{ActorContext, AsyncContext, Message, Handler, Addr, StreamHandler, Actor};
use actix_web::{web, App, Error, HttpRequest, HttpResponse, HttpServer, http};
use actix_web_actors::ws;
use tokio::sync::Mutex;
use std::sync::{Arc, Mutex as StdMutex};
use std::time::{Duration, Instant};
use dotenv::dotenv;
use actix_cors::Cors;
use serde::Deserialize;

mod files;
mod tokencheck;

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(10);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(600); // 10min

static mut INP: Option<Arc<Mutex<BufWriter<tokio::process::ChildStdin>>>> = None;
static mut AUTHENTICATED_SOCKETS: Option<Arc<StdMutex<Vec<Addr<MyWs>>>>> = None;

static mut IS_RUNNING: bool = false;

pub struct BroadcastMessage {
    pub data: String,
}

impl Message for BroadcastMessage {
    type Result = ();
}

async fn server_process() -> Result<(), Box<dyn std::error::Error>> {
    let mut cmd = Command::new("/bin/bash")
    .stdin(std::process::Stdio::piped())
    .stdout(std::process::Stdio::piped())
    .spawn()?;
    
    let stdin = BufWriter::new(cmd.stdin.take().expect("Failed to open stdin"));
    let stdout = BufReader::new(cmd.stdout.take().expect("Failed to open stdout"));
    
    let handle = tokio::spawn(async move {
        let mut lines = stdout.lines();
        while let Some(line) = lines.next_line().await.unwrap() {
            println!("{}", line);
            
            let data = line.to_string();  // Replace with your actual data
            unsafe {
                if let Some(authenticated_sockets) = &AUTHENTICATED_SOCKETS {
                    let authenticated_sockets = authenticated_sockets.lock().unwrap();
                    for addr in authenticated_sockets.iter() {
                        addr.do_send(BroadcastMessage { data: data.clone() });
                    }
                }
            }
        }            
    });
    
    unsafe {
        INP = Some(Arc::new(Mutex::new(stdin)));
    }
    
    handle.await.unwrap();
    Ok(())
}

fn cmd_handler(mut cmd: String) {
    
    // handle alternative commands
    if cmd == "start" {
        std::env::var("START_COMMAND").ok().map(|start_cmd| {
            cmd = "echo Starting the Server! && ".to_string();
            cmd.push_str(&start_cmd);
        });
        unsafe {
            IS_RUNNING = true;
        }
    }
    
    if cmd == "stop" {
        unsafe {
            IS_RUNNING = false;
        }
    }
    
    println!("> {}", cmd);
    
    tokio::spawn(async move {
        unsafe {
            if let Some(stdin) = &INP {                            
                let mut stdin = stdin.lock().await;
                
                // execute the message
                stdin.write_all(cmd.as_bytes()).await.unwrap();
                stdin.write_all(b"\n").await.unwrap();
                stdin.flush().await.unwrap();
            }
        }}
    );
    //ctx.text(format!("Text message from client: {}", text));
}

/// Define HTTP actor
struct MyWs {
    authentificated: bool,
    hb: Instant,
}

impl MyWs {
    fn new() -> Self {
        Self {
            authentificated: false,
            hb: Instant::now(),
        }
    }
    
    
    // This function will run on an interval, every 5 seconds to check
    // that the connection is still alive. If it's been more than
    // 10 seconds since the last ping, we'll close the connection.
    fn hb(&self, ctx: &mut <Self as Actor>::Context) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                ctx.stop();
                return;
            }
            
            ctx.ping(b"");
        });
    }
}

impl Actor for MyWs {
    type Context = ws::WebsocketContext<Self>;
    
    // Start the heartbeat process for this connection
    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }
}

impl Handler<BroadcastMessage> for MyWs {
    type Result = ();
    
    fn handle(&mut self, msg: BroadcastMessage, ctx: &mut Self::Context) -> Self::Result {
        // Send the data to the WebSocket
        ctx.text(msg.data);
    }
}

/// Handler for ws::Message message
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWs {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        // println!("WS: {:?}", msg);
        
        self.hb = Instant::now();
        match msg {
            //Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
            Ok(ws::Message::Text(text)) => {
                
                if !self.authentificated {
                    let req_token = std::env::var("TOKEN");
                    
                    if req_token.is_err() {
                        println!("No token set!");
                        ctx.text("Impossible to connect since no token is set!");
                        ctx.close(None);
                        return
                    }
                    
                    if text == req_token.unwrap() {
                        self.authentificated = true;
                        // ctx.text("Authentificated!");
                        
                        let addr = ctx.address();
                        unsafe {
                            if let Some(authenticated_sockets) = &AUTHENTICATED_SOCKETS {
                                let mut authenticated_sockets = authenticated_sockets.lock().unwrap();
                                authenticated_sockets.push(addr);
                            } else {
                                AUTHENTICATED_SOCKETS = Some(Arc::new(StdMutex::new(vec![addr])));
                            }
                        }
                        
                    } else {
                        ctx.text("Wrong Token!");
                        ctx.close(None)
                    }
                    
                    return
                }
                
                cmd_handler(text.to_string());
            },
            
            //Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => ctx.close(reason),
            _ => (),
        }
    }
}

async fn index(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    let resp = ws::start(MyWs::new(), &req, stream);
    println!("{:?}", resp);
    resp
}


async fn is_running() -> HttpResponse {
    let is_running = unsafe { IS_RUNNING };
    HttpResponse::Ok().json(is_running)
}


async fn switch_running() -> HttpResponse {
    let is_running = unsafe { IS_RUNNING };
    if is_running {
        cmd_handler("stop".to_string());
    } else {
        cmd_handler("start".to_string());
    }
    HttpResponse::Ok().json(!is_running)
}

#[derive(Deserialize)]
struct CMD {
    cmd: String,
}

async fn execute_command(cmd: web::Json<CMD>) -> HttpResponse {
    cmd_handler(cmd.cmd.clone());
    HttpResponse::Ok().json("ok")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    
    // spawn the server process
    tokio::spawn(async move {
        server_process().await.unwrap();
    });
    
    if !std::path::Path::new("server/").exists() {
        std::fs::create_dir("server/").unwrap();
    }
    std::env::set_current_dir("server/").unwrap();
    
    let port: u16 = std::env::var("PORT").unwrap_or("8778".to_string()).parse().unwrap_or(8778);
    
    println!("Starting server on http://127.0.0.1:{}", port);
    println!("Use CTRL+C to stop the server");
    
    println!("Please use the Server behind a reverse proxy like nginx to enable SSL!");
    
    // Start the server
    let server = HttpServer::new(|| {
        let cors = Cors::default()
        .allowed_origin("http://localhost:3000")
        .allowed_methods(vec!["GET", "POST", "DELETE"])
        .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
        .allowed_header(http::header::CONTENT_TYPE)
        .max_age(3600);
        
        App::new()
        .wrap(cors)
        .route("/ws/", web::get().to(index))
        
        .service(scope("/api")
        .wrap(tokencheck::TokenCheck)
        .route("/is_running", web::post().to(is_running))
        .route("/switch_running", web::post().to(switch_running))
        .route("/execute_command", web::post().to(execute_command))
        .service(files::get_files)
        .service(files::delete_files)
    )}).bind(("127.0.0.1", port))?.run();
    
    // Await the httpserver process
    server.await?;
    
    Ok(())
}