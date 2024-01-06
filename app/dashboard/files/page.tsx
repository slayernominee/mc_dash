"use client"
import { Layout } from "@/app/components/dash_lay"
import React, { useRef, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  




export default function Home() {

    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/files/&.', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            }).then(async (response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                setData(await response.json())
            })
        }
        fetchData()
    }, [])

    return (
            <Layout>
            <h1>Files</h1>

            <Table>
            <TableCaption>Server Files.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Modified</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>

                { data && data.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell>x</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{`${item.is_dir}x`}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    </TableRow>
                ))}

            </TableBody>
            </Table>


            </Layout>
        )
    }