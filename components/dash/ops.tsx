"use client"
import React, { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Button } from '@/components/ui/button'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

export default function Ops() {
    const WS_URL = "ws://127.0.0.1:8778"

    const already_sent_one = useRef(false)
    const ops = useRef([])

    const [socketUrl] = useState(WS_URL);
    const [messageHistory, setMessageHistory] = useState([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    
    useEffect(() => {
        if (lastMessage !== null) {
            let opsx = lastMessage.data.split("\n")
            for (let i = 0; i < opsx.length; i++) {
                ops.current.push(JSON.parse(opsx[i]))
            }
            
            setMessageHistory((prev) => prev.concat(lastMessage));
        } else if (!already_sent_one.current) {
            if (localStorage.getItem("token") === null) {
                window.location.href = "/login"
            } else {
                sendMessage(localStorage.getItem("token"))
            }

            sendMessage("+ops")
            already_sent_one.current = true
        }
    }, [lastMessage]);

    return (

        <div>

<Table>
  <TableCaption>A list of all Players with Operator Permissions.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Name</TableHead>
      <TableHead>Level</TableHead>
      <TableHead>Uuid</TableHead>
      <TableHead>bypassesPlayerLimit</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>

            {ops.current.map((op, index) => (
                <TableRow key={index}>
                <TableCell className="font-medium">{op.name}</TableCell>
        <TableCell>{op}</TableCell>
        <TableCell>Credit Card</TableCell>
        <TableCell>Credit Card</TableCell>
        <TableCell className="text-right">$250.00</TableCell>

        </TableRow>
                ))}

  </TableBody>
  </Table>
            </div>
            )
        }
        
        export { Ops }