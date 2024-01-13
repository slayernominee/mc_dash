"use client"
import React, { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Button } from '@/components/ui/button'

async function get_is_running(): Promise<boolean> {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/is_running', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
    }).then(resp => resp.json())
    return data
}

export default function Console() {

    var Convert = require('ansi-to-html');
    var convert = new Convert();

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL

    const cmd: any = useRef();
    const sendMessages: any = useRef([]);
    const already_sent_one = useRef(false)

    const [socketUrl]: any = useState(WS_URL);
    const [messageHistory, setMessageHistory]: any = useState([]);
    const [running, setRunning] = useState(true)

    const { sendMessage, lastMessage, readyState }: any = useWebSocket(socketUrl);
    
    useEffect(() => {

        get_is_running().then((data) => {
            setRunning(data)
        })

        if (lastMessage !== null) {
            setMessageHistory((prev: any) => prev.concat(lastMessage));
        } else if (!already_sent_one.current) {
            if (localStorage.getItem("token") === null) {
                window.location.href = "/login"
            } else {
                sendMessage(localStorage.getItem("token"))
            }

            sendMessage("version")
            already_sent_one.current = true
        }
    }, [lastMessage, setMessageHistory]);
    
    const handleClickSendMessage = async () => {
        sendMessages.current.push(cmd.current.value)
        sendMessage(cmd.current.value)
        cmd.current.value = ""
    }

    const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleClickSendMessage()
        } else if (event.key === 'ArrowUp') {
            if (sendMessages.current.length > 0) {
                cmd.current.value = sendMessages.current[sendMessages.current.length - 1]
            }
        }
    }

    return (
        <div className="bg-gray-900 text-gray-100 w-full relative h-[39rem] rounded-sm border-white border pt-3">
            { running ? null : <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <Button className='border' onClick={() => {sendMessage('start'); setRunning(true)}}>
                    Start the Server
                </Button>
            </div> }
        <div className="px-4 overflow-y-scroll break-words h-[35rem] flex flex-col-reverse">
            <div className="h-[35rem]"></div>
        {messageHistory.toReversed().map((message: { data: string }, idx: number) => (
            <span key={idx} dangerouslySetInnerHTML={message ? { __html: convert.toHtml(message.data) } : { __html: null }} />
            ))}
            </div>

            <div className="h-12 w-full"></div>
            
            <div className="flex bottom-0 left-0 bg-gray-800 px-4 outline-none absolute border-t h-12 border-white w-full text-gray-100">
            <span className="h-full text-xl pt-[0.475rem] pr-2 text-gray-400"> {'>'} </span>
            <input className="h-full bg-transparent outline-none w-full" onKeyUp={keyUpHandler} placeholder="Type 'help' for help" ref={cmd} />
            <Button
            variant="ghost"
            disabled={readyState !== ReadyState.OPEN}
            onClick={handleClickSendMessage}
            >send</Button>
            </div>
            </div>
            )
        }
        
        export { Console }