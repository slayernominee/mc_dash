use actix_web::{post, HttpResponse, Responder, web};
use std::path::Path;
use std::env;
use std::fs::File;
use std::io::Write;
use reqwest;
use tokio::process::Command;

// deticated to mc files e.g. ops.json, help.yml etc 

#[post("/is_setup")]
pub async fn is_setup() -> impl Responder {
    let server_file_name = env::var("SERVER_FILE_NAME").expect("env arg error: is_setup : SERVER_FILE_NAME");
    let req_eula: bool = env::var("REQUIRE_EULA").unwrap_or("False".to_string()).to_lowercase().parse().expect("failed to parse eula_req");

    let path_to_server_file = Path::new(&server_file_name);
    if !path_to_server_file.exists() {
        return HttpResponse::Ok().json(false)
    }

    if req_eula {
        let eula_path = Path::new("eula.txt");
        // read the eula.txt line by line and check if any line is eula=true (remove spaced)
        let eula_file = std::fs::read_to_string(eula_path).expect("Error reading eula.txt");
        for line in eula_file.lines() {
            // check before if the eula is set to false 
            if line.trim().replace(" ", "") == "eula=false" {
                return HttpResponse::Ok().json(false)
            } else if line.trim().replace(" ", "") == "eula=true" {
                return HttpResponse::Ok().json(true)
            }
        }
        HttpResponse::Ok().json(false)
    } else {
        HttpResponse::Ok().json(true)
    }

}

#[post("/download_server/{url}")]
pub async fn download_server(url: web::Path<String>) -> impl Responder {
    let mut url = url.into_inner();

    url = url.replace("&", "/");

    println!("Downloading Server: {}", url);

    // delete old eula.txt
    let eula_path = Path::new("eula.txt");
    if eula_path.exists() {
        std::fs::remove_file(eula_path).expect("Error deleting eula.txt");
    }

    let server_file_name = env::var("SERVER_FILE_NAME").expect("env arg error: download_server : SERVER_FILE_NAME");
    let path_to_server_file = Path::new(&server_file_name);
    if path_to_server_file.exists() {
        // delete the old server file
        std::fs::remove_file(path_to_server_file).expect("Error deleting server file");
    }
    let mut file = File::create(path_to_server_file).expect("Error creating server file");
    
    // download the server file
    let resp = reqwest::get(&url).await.expect("Error downloading server file");
    let content = resp.text().await.expect("Error reading server file");

    // write the new server file 
    file.write_all(content.as_bytes()).expect("Error writing server file");

    println!("Downloaded the server file");

    HttpResponse::Ok().json(true)
}

#[post("/run_once")]
pub async fn run_once() -> impl Responder {
    println!("Running the server once to set everything up");


    let server_file_name = env::var("SERVER_FILE_NAME").expect("env arg error: run_once : SERVER_FILE_NAME");
    let path_to_server_file = Path::new(&server_file_name);
    if !path_to_server_file.exists() {
        return HttpResponse::Ok().json(false)
    }

    let start_command = env::var("START_COMMAND").expect("env arg error: run_once : START_COMMAND");

    let base_cmd: &str = start_command.split(" ").collect::<Vec<&str>>()[0];
    let args: Vec<&str> = start_command.split(" ").collect::<Vec<&str>>()[1..].to_vec();

    let mut cmd = Command::new(base_cmd).args(args).spawn().expect("Failed to start the server once");

    cmd.wait().await.unwrap();
    println!("Finished the first server run");

    HttpResponse::Ok().json(true)
}