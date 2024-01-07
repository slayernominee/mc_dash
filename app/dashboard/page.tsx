"use client"
import { Button } from "@/components/ui/button"
import { Layout } from "@/app/components/dash_lay"

import React, { useState, useEffect } from 'react'

import Icon from '@mdi/react';
import { mdiSquareOutline, mdiTriangleOutline } from '@mdi/js';

async function get_is_running(): Promise<boolean> {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/is_running', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then((res) => res.json())
    return data
}

async function switch_running(): Promise<boolean> {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/switch_running', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then((res) => res.json())
    return data
}

export default function Home() {

    const [is_running, set_is_running] = useState(false)
    const [fetched_running, set_fetched_running] = useState(false)

    useEffect(() => {
        get_is_running().then((is_running) => {
            set_is_running(is_running)
            set_fetched_running(true)
        })
    }, [])

    const switch_running_handler = () => {
        switch_running().then((is_running) => {
            set_is_running(is_running)
        })
    }

    return (
            <Layout>
            <h1>General</h1>
            
            <Button variant="secondary" onClick={switch_running_handler} className={`float-right w-36 ${fetched_running ? `${is_running ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}` : ''}`}><Icon path={is_running ? mdiSquareOutline : mdiTriangleOutline} size={0.7} className="mr-3" rotate={is_running ? 0 : 90} /> { fetched_running ? `${ is_running ? 'Stop' : 'Start' }` : 'Loading ...' }</Button>

            <div className="grid grid-cols-3">
                <div>
                    <div>
                        <h2>Quick Commands</h2>
                        <Button variant="secondary">Day</Button>
                        <Button variant="secondary">Night</Button>
                        <Button>Clear Weather</Button>
                    </div>
                </div>
                <div className="col-span-2">
                    <div>
                        <h2>Players</h2>
                        x / y online greendot
                        Liste von ein paar
                    </div>
                </div>
            </div>


            </Layout>
        )
    }