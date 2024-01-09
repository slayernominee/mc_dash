use actix_web::{post, HttpResponse, Responder, web, Result};
use std::path::Path;
use std::env;
use std::fs::File;
use reqwest;
use tokio::process::Command;
use std::io::Write;

// deticated to mc files e.g. ops.json, help.yml etc 

#[post("/is_setup")]
pub async fn is_setup() -> Result<impl Responder> {
    let server_file_name = env::var("SERVER_FILE_NAME").expect("env arg error: is_setup : SERVER_FILE_NAME");
    let req_eula: bool = env::var("REQUIRE_EULA").unwrap_or("False".to_string()).to_lowercase().parse().expect("failed to parse eula_req");

    let path_to_server_file = Path::new(&server_file_name);
    if !path_to_server_file.exists() {
        return Ok(HttpResponse::Ok().json(false))
    }

    if req_eula {
        let eula_path = Path::new("eula.txt");
        // read the eula.txt line by line and check if any line is eula=true (remove spaced)
        let eula_file = std::fs::read_to_string(eula_path)?;
        for line in eula_file.lines() {
            // check before if the eula is set to false 
            if line.trim().replace(" ", "") == "eula=false" {
                return Ok(HttpResponse::Ok().json(false))
            } else if line.trim().replace(" ", "") == "eula=true" {
                return Ok(HttpResponse::Ok().json(true))
            }
        }
        Ok(HttpResponse::Ok().json(false))
    } else {
        Ok(HttpResponse::Ok().json(true))
    }

}

#[post("/download_server/{url}")]
pub async fn download_server(url: web::Path<String>) -> Result<impl Responder> {
    let mut url = url.into_inner();

    url = url.replace("&", "/");

    println!("Downloading Server: {}", url);

    // delete old eula.txt
    let eula_path = Path::new("eula.txt");
    if eula_path.exists() {
        std::fs::remove_file(eula_path)?;
    }

    let server_file_name = env::var("SERVER_FILE_NAME").expect("env arg error: download_server : SERVER_FILE_NAME");
    let path_to_server_file = Path::new(&server_file_name);
    if path_to_server_file.exists() {
        // delete the old server file
        std::fs::remove_file(path_to_server_file)?;
    }
    let mut file = File::create(path_to_server_file)?;
    
    // download the server file
    let resp = reqwest::get(&url).await.expect("failed to fetch the url");
    let content = resp.bytes().await.expect("Error reading server file");

    // save the file
    file.write_all(&content)?;

    println!("Downloaded the server file");

    Ok(HttpResponse::Ok().json(true))
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


#[post("/agree_to_eula")]
pub async fn agree_to_eula() -> Result<impl Responder> {
    let eula_path = Path::new("eula.txt");
    if eula_path.exists() {
        std::fs::remove_file(eula_path)?;
    }
    let mut file = File::create(eula_path)?;
    file.write_all("eula=true".as_bytes())?;

    Ok(HttpResponse::Ok().json(true))
}