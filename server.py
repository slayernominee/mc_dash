import subprocess
from os import chdir, getenv
from threading import Thread
import asyncio
from websockets.server import serve
from dotenv import load_dotenv

load_dotenv()
TOKEN = getenv("TOKEN")
PORT = getenv("PORT")

# Authentification with the first message, else close the connection
# TODO: there need to be rate limits etc to prevent spamming, payload max size etc

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

async def send_output(websocket):
    for line in execute(popen):
        await websocket.send(line)
        
def print_output():
    for line in execute(popen):
        print(line, end="")

AUTHENTIFICATED = set()

output = Thread(target=print_output)
output.start()

async def input_handler(websocket):
    global AUTHENTIFICATED
    async for message in websocket: 
        if websocket not in AUTHENTIFICATED:
            if message == TOKEN:
                AUTHENTIFICATED.add(websocket)
                print("Authentificated a new Websocket")
                await websocket.send("Authentificated")
                
                output = Thread(target=asyncio.run, args=(send_output(websocket),))
                output.start()
                
                continue
            else:
                print("Authentification failed")
                return
        
        print("> " + message)
        # ? maybe write a log file later on here too
                
        popen.stdin.write(message + "\n")
        popen.stdin.flush()

async def main():
    async with serve(input_handler, "localhost", PORT) as websocket:
        await asyncio.Future()  # run forever
  
if __name__ == '__main__':
    asyncio.run(main())