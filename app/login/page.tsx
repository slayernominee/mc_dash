"use client"
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

async function check_if_setup() {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/is_setup', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then((res) => res.json())
    return data
}

export default function Home() {
    const tokenInput: any = useRef(null)

    const setToken = async () => {
        localStorage.setItem("token", tokenInput.current.value)

        check_if_setup().then((is_setup) => {
            if (!is_setup) {
                window.location.href = '/setup'
            } else {
                window.location.href = '/dashboard'
            }
        })
    }
    
    return (
        <div className='flex justify-center mt-[20%]'>
        <div className='w-96 bg-gray-200 rounded-lg px-12 py-4'>
        <h1>Login</h1>
        <Input placeholder="Token" ref={tokenInput} type='password' />
        <Button onClick={setToken} className='w-full mt-4'>Login</Button>
        </div>
        </div>
        )
    }