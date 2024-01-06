// https://github.com/slayernominee/token_system

use std::future::{ready, Ready};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
};
use futures_util::future::LocalBoxFuture;
use std::env::var;

pub struct TokenCheck;

impl<S, B> Transform<S, ServiceRequest> for TokenCheck
where
S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
S::Future: 'static,
B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = TokenCheckMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;
    
    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(TokenCheckMiddleware { service }))
    }
}

pub struct TokenCheckMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for TokenCheckMiddleware<S>
where
S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
S::Future: 'static,
B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;
    
    forward_ready!(service);
    
    fn call(&self, req: ServiceRequest) -> Self::Future {
        //println!("req path: {}", req.path());

        let headers = req.headers();
        //println!("headers: {:?}", headers);

        // get authorization header
        let token = headers.get("Authorization");
        if token.is_none() {
            // return error authorization header not found
            let error = actix_web::error::ErrorUnauthorized("Authorization header not found").into();
            return Box::pin(async move { Err(error) });
         }
            
        let token = token.unwrap().to_str().unwrap();

        let mut req_token = "Bearer ".to_string();
        req_token.push_str(&var("TOKEN").expect("No token set in environment!"));

        if token != &req_token {
            let error = actix_web::error::ErrorForbidden("Wrong Login Credentials").into();
            return Box::pin(async move { Err(error) });
        }
        
        // The Service is called -> request will be processesed
        let fut = self.service.call(req);
        
        Box::pin(async move {
            let res = fut.await?;
            // res is the server response and will be processed 
            Ok(res)
        })
    }
}