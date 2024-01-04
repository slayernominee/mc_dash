## Development

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
python3 server.py
```

Will run the Websocket server