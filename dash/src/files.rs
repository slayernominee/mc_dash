use std::{fs::File, io::Read};
use actix_web::{web, HttpResponse, Responder, Result, post};
use std::path::Path;
use serde::Serialize;


#[derive(Serialize, Debug)]
struct FileInfo {
    name: String,
    is_dir: bool,
    modified: i128,
}

/// Get a File or Direcotry
#[post("/files/{pathname}")]
pub async fn get_files(path: web::Path<String>) -> Result<impl Responder> {
    let mut pathname = path.into_inner();

    if pathname.contains("..") {
        return Ok(HttpResponse::BadRequest().body("Invalid Pathname!"));
    }

    if pathname == "&." {
        pathname = ".".to_string();
    }

    let path = Path::new(&pathname);

    if path.is_dir() {
        let mut files = Vec::new();
        for entry in path.read_dir()? {
            let entry = entry?;
            let path = entry.path();
            let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
            let file_type = path.metadata()?.file_type().is_dir();
            files.push(FileInfo {
                name: file_name,
                is_dir: file_type,
                modified: path.metadata()?.modified()?.elapsed().unwrap().as_millis() as i128,
            });
        }
        Ok(HttpResponse::Ok().json(files))
    } else {
        let mut file = File::open(path)?;

        let mut buf = String::new();
        file.read_to_string(&mut buf)?;

        Ok(HttpResponse::Ok().body(buf))
    }
}