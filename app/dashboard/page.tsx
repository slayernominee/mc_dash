"use client"
import { Button } from "@/components/ui/button"
import { Layout } from "@/app/components/dash_lay"
import { toast } from "sonner"

import React, { useState, useEffect } from 'react'

import Icon from '@mdi/react';
import { mdiSquareOutline, mdiTriangleOutline, mdiWeatherNight, mdiWeatherSunny, mdiWeatherSunset, mdiWeatherPouring, mdiWeatherLightningRainy } from '@mdi/js';

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

async function exec_cmd(command: string) {
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/execute_command', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: command
    }).catch((err) => {
        console.error(err)
    })
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
        set_fetched_running(false)
        switch_running().then((is_running) => {
            set_is_running(is_running)
        })

        if (is_running) {
            toast('Server is stopping ...')
            setTimeout(() => {
                set_fetched_running(true)
            }, 2000)
        } else {
            toast('Server is starting ...')
            setTimeout(() => {
                set_fetched_running(true)
            }, 7000)
        }

        
    }

    return (
            <Layout>
            <h1>General</h1>
            
            <Button variant="secondary" onClick={switch_running_handler} className={`float-right w-36 ${fetched_running ? `${is_running ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}` : ''}`}><Icon path={is_running ? mdiSquareOutline : mdiTriangleOutline} size={0.7} className="mr-3" rotate={is_running ? 0 : 90} /> { fetched_running ? `${ is_running ? 'Stop' : 'Start' }` : 'Loading ...' }</Button>

            <div className="grid grid-cols-3">
                <div>
                    <div>
                        <h2>Quick Commands</h2>
                        <div className="grid grid-cols-3 pr-6 gap-4 mb-4">
                        <Button disabled={!is_running || !fetched_running} className="w-full" onClick={async () => {await exec_cmd('time set day'); toast("It's now day")}} variant="secondary"><Icon path={mdiWeatherSunny} size={0.7} className="mr-1" />Day</Button>
                        <Button disabled={!is_running || !fetched_running} className="w-full" onClick={async () => {await exec_cmd('time set sunrise'); toast("It's now dusk")}} variant="secondary"><Icon path={mdiWeatherSunset} size={0.7} className="mr-1" />Sunrise</Button>
                        <Button disabled={!is_running || !fetched_running} className="w-full" onClick={async () => {await exec_cmd('time set midnight'); toast("It's now night")}} variant="secondary"><Icon path={mdiWeatherNight} size={0.7} className="mr-1" />Night</Button>
                        </div>
                        <div className="grid grid-cols-3 pr-6 gap-4 mt-4">
                        <Button disabled={!is_running || !fetched_running} className="w-full" onClick={async () => {await exec_cmd('weather clear'); toast("It's now a sunny day")}} variant="secondary"><Icon path={mdiWeatherSunny} size={0.7} className="mr-1" />Clear</Button>
                        <Button disabled={!is_running || !fetched_running} className="w-full" onClick={async () => {await exec_cmd('weather rain'); toast("It's now raining")}} variant="secondary"><Icon path={mdiWeatherPouring} size={0.7} className="mr-1" />Rain</Button>
                        <Button disabled={!is_running || !fetched_running} className="w-full" onClick={async () => {await exec_cmd('weather thunder'); toast("It's now storming")}} variant="secondary"><Icon path={mdiWeatherLightningRainy} size={0.7} className="mr-1" />Storm</Button>
                        </div>
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