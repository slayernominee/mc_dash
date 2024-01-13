# MC Dash
A free & opensource Minecraft Dashboard to control your server

![console image](.github/assets/console.webp)
![files image](.github/assets/files.webp)
![dashboard image](.github/assets/dashboard.webp)

## Features
- [x] Live Console
        To see console output live and execute commands
- [x] File Explorer
        To delete, upload, download, etc files e.g. plugins
- [x] Dashboard
        With some general information and quick commands
- [x] Setup Wizard
        Here you can select a server and a version and agree to the eula.txt

## TO-DO
- [ ] Setup Script
- [ ] Docker Container
- [ ] Backend Cors Settings, if you dont want use *
- [ ] File Editor
- [ ] Explorer Feature: Duplicate, Download, Move
- [ ] Dashboard: Get World, Get Gamemode


# Setup

## Prerequirements
- Java JRE (for minecraft)
- git


## Development
add a folder called `server` and put the `paper.jar` file in it that will run the server
add a eula file that has`eula=true` in it ...
Visit the `.env` file and change the token, websocket port there

- cargo
- node


```sh
pnpm install
pnpm run dev
```
will run the frontend on http://localhost:3000/dashboard

```sh
cd dash
cargo run
```
will run the Websocket / API server


Download the current paper server
and upload it in the file explorer as `server.jar` 
also upload a `eula.txt` with the content `eula=true` up


## Deployment

#### Build the Backend / Server
...

(explanation in progres ...)