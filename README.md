# MC Dash
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
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
python3 console.py
```

Will run the Websocket server