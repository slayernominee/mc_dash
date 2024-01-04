"use client"
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
    const tokenInput = useRef(null)

    const setToken = async () => {
        localStorage.setItem("token", tokenInput.current.value)
        window.location.href = '/dashboard/'
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