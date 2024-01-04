"use client"
import React, { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Button } from '@/components/ui/button'

export default function Console() {
    const WS_URL = "ws://127.0.0.1:8778"
    
    const cmd = useRef(null);

    const [socketUrl] = useState(WS_URL);
    const [messageHistory, setMessageHistory] = useState([]);
    
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);
    
    const handleClickSendMessage = async () => {
        sendMessage(cmd.current.value)
        cmd.current.value = ""
    }

    const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleClickSendMessage()
        }
    }
    
    return (
        <div className="bg-gray-900 text-gray-100 w-full relative h-full rounded-sm border-white border pt-3">
        <div className="px-4 overflow-y-scroll break-words h-full">
        Please first send the Token to Authentificate ...
        {messageHistory.map((message, idx) => (
            <p key={idx} dangerouslySetInnerHTML={message ? { __html: message.data } : null} />
            ))}
            </div>

            <div className="h-12 w-full"></div>
            
            <div className="flex bottom-0 left-0 bg-gray-800 px-4 outline-none absolute border-t h-12 border-white w-full text-gray-100">
            <span className="h-full text-xl pt-[0.475rem] pr-2 text-gray-400"> {'>'} </span>
            <input className="h-full bg-transparent outline-none w-full" onKeyUp={keyUpHandler} placeholder="Type 'help' for help" ref={cmd} />
            <Button
            disabled={readyState !== ReadyState.OPEN}
            onClick={handleClickSendMessage}
            >send</Button>
            </div>
            </div>
            )
        }
        
        export { Console }