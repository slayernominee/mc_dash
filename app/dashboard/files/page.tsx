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
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Icon from '@mdi/react';
import { mdiDeleteOutline, mdiFolderMoveOutline, mdiPencilOutline } from '@mdi/js';

import { File, columns } from "@/app/dashboard/files/columns"
import { DataTable } from "@/app/dashboard/files/data-table"


async function getData(): Promise<File[]> {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/files/&.', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    }).then(res => res.json()).then((res) => {
        res.map((file: any) => {
            file.type = file.is_dir ? 'folder' : 'file'
            return file
        }
        )
        return res
    })
    return res
}


export default function Home() {
    const [data, setData] = useState<File[]>([])

    useEffect(() => {
        getData().then(res => setData(res))
    }, [])

    return (
            <Layout>
            <h1>Files</h1>

            <DataTable columns={columns} data={data} />


            </Layout>
        )
    }