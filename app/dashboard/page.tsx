"use client"
import { Button } from "@/components/ui/button"
import { Layout } from "@/app/components/dash_lay"
import { toast } from "sonner"
import { Toaster } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  

import React, { useState, useEffect } from 'react'

import Icon from '@mdi/react';
import { mdiSquareOutline, mdiTriangleOutline, mdiLightningBolt, mdiKarate, mdiGavel, mdiWeatherNight, mdiCircleMedium, mdiWeatherSunny, mdiWeatherSunset, mdiWeatherPouring, mdiWeatherLightningRainy } from '@mdi/js';

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

async function check_if_setup() {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/is_setup', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then((res) => res.json())
    return data
}

async function get_players() {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/list_players', {
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
    
    const [players, setPlayers] = useState([])

    const [max_count, set_max_count] = useState(0)

    useEffect(() => {

        check_if_setup().then((is_setup) => {
            if (!is_setup) {
                window.location.href = '/setup'
            }
        })

        get_is_running().then((is_running) => {
            set_is_running(is_running)
            set_fetched_running(true)
        })

        get_players().then((player_data) => {
            setPlayers(player_data.players)
            set_max_count(player_data.max)
        })

        setInterval(() => {
            get_is_running().then((is_running) => {
                set_is_running(is_running)
                set_fetched_running(true)
            })

            get_players().then((player_data) => {
                setPlayers(player_data.players)
                set_max_count(player_data.max)
            })
        }, 5000)

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

    const playerList = players.map((player_name, idx) =>
    <TableRow key={idx}>
    <TableCell className="font-medium">{ player_name }</TableCell>
    <TableCell>
        <Select onValueChange={(v) => exec_cmd(`gamemode ${v} ${player_name}`)}>
        <SelectTrigger className="w-36 border-none outline-none focus:border-none focus:outline-none">
            <SelectValue placeholder="Gamemode" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="survival">Survival</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="spectator">Spectator</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
        </SelectContent>
        </Select>
    </TableCell>
    <TableCell>World</TableCell>
    <TableCell className="text-center">

    <TooltipProvider>
    <Tooltip>
    <TooltipTrigger>
        <Button variant="ghost" onClick={() => exec_cmd(`execute at ${player_name} run summon lightning_bolt ^ ^ ^`)} >
            <Icon path={mdiLightningBolt} size={1} className="mr-3" /> 
        </Button>
    </TooltipTrigger>
    <TooltipContent>
    <p>Hit the player with a lightning bolt</p>
    </TooltipContent>
    </Tooltip>
    </TooltipProvider>


    <TooltipProvider>
    <Tooltip>
    <TooltipTrigger>
        <Button variant="ghost" onClick={() => exec_cmd(`kick ${player_name}`)}>
            <Icon path={mdiKarate} size={1} className="mr-3" /> 
        </Button>
    </TooltipTrigger>
    <TooltipContent>
    <p>Kick Player</p>
    </TooltipContent>
    </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
        <Tooltip>
        <TooltipTrigger>
            <Button variant="ghost" onClick={() => exec_cmd(`ban ${player_name}`)}>
                <Icon path={mdiGavel} size={1} className="mr-3" /> 
            </Button>
        </TooltipTrigger>
        <TooltipContent>
        <p>Ban Player</p>
        </TooltipContent>
        </Tooltip>
        </TooltipProvider>


    </TableCell>
</TableRow>
);

    return (
            <Layout>
            <h1>General</h1>
            
            <Button variant="secondary" onClick={switch_running_handler} className={`float-right w-36 ${fetched_running ? `${is_running ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}` : ''}`}><Icon path={is_running ? mdiSquareOutline : mdiTriangleOutline} size={0.7} className="mr-3" rotate={is_running ? 0 : 90} /> { fetched_running ? `${ is_running ? 'Stop' : 'Start' }` : 'Loading ...' }</Button>

            <div className="grid grid-cols-3 pt-8">
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

                        <span className="flex"><Icon path={mdiCircleMedium} size={1} className={`mr-3 ${is_running ? 'text-green-600' : 'text-red-500'}`} /> {players.length} / {max_count} Players are online</span>

                        <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-36">Name</TableHead>
                            <TableHead>Gamemode</TableHead>
                            <TableHead>World</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { playerList }
                        </TableBody>
                        </Table>

                    </div>
                </div>
            </div>

            <Toaster />

            </Layout>
        )
    }