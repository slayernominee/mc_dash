import subprocess
from os import chdir, getenv
from threading import Thread
import asyncio
from websockets.server import serve
from dotenv import load_dotenv
from time import time
from ansi2html import Ansi2HTMLConverter

load_dotenv()
TOKEN = getenv("TOKEN")
PORT = getenv("PORT")

# Authentification with the first message, else close the connection
# TODO: there need to be rate limits etc to prevent spamming, payload max size etc

AnsiConv = Ansi2HTMLConverter()

def execute(popen):
    for stdout_line in iter(popen.stdout.readline, ""):
        yield stdout_line 
    
    popen.stdout.close()
    return_code = popen.wait()
    if return_code:
        raise subprocess.CalledProcessError(return_code, cmd)

chdir("server")
cmd = "java -jar paper.jar --nogui".split(" ")
popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stdin=subprocess.PIPE, universal_newlines=True)

async def send_output():
    for line in execute(popen):
        print(line, end="")
        html = AnsiConv.convert(line.strip(), full=True)
        aut = AUTHENTIFICATED.copy()
        for websocket in aut:
            try:
                await websocket.send(html)
            except:
                AUTHENTIFICATED.remove(websocket)

AUTHENTIFICATED = set()

output = Thread(target=asyncio.run, args=(send_output(),))
output.start()

async def input_handler(websocket):
    global AUTHENTIFICATED
    
    async for message in websocket: 
        if websocket not in AUTHENTIFICATED:
            if message == TOKEN:
                AUTHENTIFICATED.add(websocket)
                print("Authentificated a new Websocket")
                #await websocket.send("Authentificated")
                continue
            else:
                print("Authentification failed")
                return
        
        if message == TOKEN:
            continue
        
        print("> " + message)

        if message == "stop":
            print("Should stop also the websocket server")
        
        # ? maybe write a log file later on here too
                
        popen.stdin.write(message + "\n")
        popen.stdin.flush()
    
    print("One Websocket just closed")
    AUTHENTIFICATED.remove(websocket)

async def main():
    async with serve(input_handler, "localhost", PORT):
        await asyncio.Future()  # run forever
  
if __name__ == '__main__':
    asyncio.run(main())