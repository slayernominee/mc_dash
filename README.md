# MC Dash

# IN DEVELOPMENT! THE CURRENT VERSION IS NOT FUNCTIONAL! AND IT STILL NEEDS SOME FUNCTIONS!
- [x] process console
- [x] file explorer (needs still some improvements)
- [ ] file editor
- [ ] download auto the minecraft server
- [ ] auto start the server (is currently only possible via the console with `start` / `stop`)
- [ ] start / stop the server

A free & opensource Minecraft Dashboard to control your server

![console image](.github/assets/console.webp)


## Development

add a folder called `server` and put the `paper.jar` file in it that will run the server
add a eula file that has`eula=true` in it ...
Visit the `.env` file and change the token, websocket port there

```sh
pnpm install
pnpm run dev
```

will run the frontend on http://localhost:3000/dashboard

```sh
cd dash
cargo run
```

Will run the Websocket / API server


## Deployment

#### Build the Backend / Server
...

(explanation in progres ...)