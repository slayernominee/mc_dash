use std::{fs::File, io::Read};
use actix_web::{web, HttpResponse, Responder, Result, post, delete};
use std::path::Path;
use serde::Serialize;
use actix_multipart::form::{
    tempfile::TempFile,
    MultipartForm,
};

#[derive(Debug, MultipartForm)]
struct UploadForm {
    #[multipart(rename = "file")]
    files: Vec<TempFile>,
}

#[post("/upload/{pathname}")]
async fn upload(MultipartForm(form): MultipartForm<UploadForm>, path: web::Path<String>) -> impl Responder {
    let mut pathname = path.into_inner();

    /*if pathname.contains("..") || pathname.contains("~") || pathname.starts_with("-") ||  pathname.contains("//") || pathname.contains("\\") || pathname.contains(":") || pathname.contains("*") || pathname.contains("?") || pathname.contains("\"") || pathname.contains("<") || pathname.contains(">") || pathname.contains("|") {
        return Ok(HttpResponse::BadRequest().body("Invalid Pathname!"));
    }*/

    pathname = pathname.replace("&.", ".");
    pathname = pathname.replace("&", "/");

    for f in form.files {
        let file_name = f.file_name.unwrap();
        let path = format!("{}/{}", pathname, file_name); 
        
        f.file.persist(path).unwrap(); // <-- other mounts .... trying to save the file not in the working directory somewhere else ...
    }
    
    //println!("ids: {:?}", ids);
    
    HttpResponse::Ok().body("Uploaded!")
}


#[derive(Serialize, Debug)]
struct FileInfo {
    name: String,
    is_dir: bool,
    modified: i128,
}


#[delete("/files/{pathname}")]
pub async fn delete_files(path: web::Path<String>) -> Result<impl Responder> {
    let mut pathname = path.into_inner();

    /*if pathname.contains("..") || pathname.contains("~") || pathname.starts_with("-") ||  pathname.contains("//") || pathname.contains("\\") || pathname.contains(":") || pathname.contains("*") || pathname.contains("?") || pathname.contains("\"") || pathname.contains("<") || pathname.contains(">") || pathname.contains("|") {
        return Ok(HttpResponse::BadRequest().body("Invalid Pathname!"));
    }*/
    // theoretically but since this only works with tokens the user can be trusted ...
    
    pathname = pathname.replace("&.", ".");
    pathname = pathname.replace("&", "/");
    
    let path = Path::new(&pathname);

    if !path.exists() {
        return Ok(HttpResponse::BadRequest().body("File or Directory does not exist!"));
    }

    if pathname == "." || pathname == "/" {
        return Ok(HttpResponse::BadRequest().body("Server Direcotry!"));
    }

    if path.is_dir() {
        std::fs::remove_dir_all(path)?;
    } else {
        std::fs::remove_file(path)?;
    }

    Ok(HttpResponse::Ok().body("Deleted!"))
}

/// Get a File or Direcotry
#[post("/files/{pathname}")]
pub async fn get_files(path: web::Path<String>) -> Result<impl Responder> {
    let mut pathname = path.into_inner();

    /*if pathname.contains("..") || pathname.contains("~") || pathname.starts_with("-") ||  pathname.contains("//") || pathname.contains("\\") || pathname.contains(":") || pathname.contains("*") || pathname.contains("?") || pathname.contains("\"") || pathname.contains("<") || pathname.contains(">") || pathname.contains("|") {
        return Ok(HttpResponse::BadRequest().body("Invalid Pathname!"));
    }*/
    // theoretically but since this only works with tokens the user can be trusted ...

    
    pathname = pathname.replace("&.", ".");
    pathname = pathname.replace("&", "/");
    
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