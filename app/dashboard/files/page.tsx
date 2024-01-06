"use client"
import { Layout } from "@/app/components/dash_lay"
import React, { useRef, useEffect } from 'react';

export default function Home() {
    const endpoint = process.env.NEXT_PUBLIC_API_URL + "/api/files/"

    useEffect(() => {
        let token = localStorage.getItem("token")
        if (token === null) {
            window.location.href = "/login"
        }

        fetch(endpoint + "&.", {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            method: 'POST',
        }).then((resp) => {
            if (resp.status === 401) {
                window.location.href = "/login"
            } else if (resp.status === 200) {
                console.log(resp)
            }
        })
    }, [])

    return (
            <Layout>
            <h1>Files</h1>

            </Layout>
        )
    }