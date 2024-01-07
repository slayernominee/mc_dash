"use client"
import { Layout } from "@/app/components/dash_lay"
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import Icon from '@mdi/react';
import { mdiDeleteOutline, mdiChevronUp, mdiFolderMoveOutline, mdiHomeOutline, mdiPencilOutline, mdiReload, mdiCloudDownloadOutline, mdiCloudUploadOutline, mdiContentCopy } from '@mdi/js';

import { File, columns } from "@/app/dashboard/files/columns"
import { DataTable } from "@/app/dashboard/files/data-table"

async function getData(path: string): Promise<File[]> {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/files/' + path, {
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

async function deleteFile(path: string) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/files/' + path, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    })
    return res
}




export default function Home() {
    const [data, setData] = useState<File[]>([])
    const [path, setPath] = useState("&.")
    const [selected, setSelected] = useState<File[]>([])
    
    const refresh = async () => {
        const res = await getData(path)
        setData(res)
    }
    
    useEffect(() => {
        refresh()
    }, [])
    
    const goToHome = async () => {
        setPath("&.")
        const res = await getData("&.")
        setData(res)
    }
    
    const goUpwards = async () => {
        const pathArr = path.split("&")
        pathArr.pop()
        const newPath = pathArr.join("&")
        setPath(newPath)
        const res = await getData(newPath)
        setData(res)
    }
    
    const handleClick = async (cell: any) => {
        
        // check if the click is on the name column
        if (cell.getContext().column.id != "name") {
            return
        }
        
        if (cell.getContext().row.original.is_dir) {
            // go in the directory
            setPath(path + "&" + cell.getContext().row.original.name)
            const res = await getData(path + "&" + cell.getContext().row.original.name)
            setData(res)
        } else {
            // open the file? or download it?
        }
    }
    
    async function uploadFiles(e: any) {
        const files = e.target.files
        const formData = new FormData()
        
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i])
        }
        
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/upload/' + path, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData,
        })
        
        refresh()
        
    }

    const deleteSelected = async () => {
        const res = await Promise.all(selected.map((file) => deleteFile(path + "&" + file.getValue("name"))))
        const res2 = await getData(path)
        setData(res2)
        setSelected([])
        refresh()
    }
    
    return (
        <Layout>
        <h1>Files</h1>
        
        <div className="flex mb-2">
        <div className="flex">
        <Button variant="ghost" disabled={path == '&.'} onClick={goToHome}><Icon path={mdiHomeOutline} size={1} /></Button>
        
        <div className="rounded-md px-4 border py-2 font-mono text-sm w-64">
        { path.replace("&.", ".").replaceAll("&", "/") }
        </div>
        
        <Button variant="ghost" disabled={path == '&.'} onClick={goUpwards}><Icon path={mdiChevronUp} size={1} /></Button>
        <Button variant="ghost" onClick={refresh}><Icon path={mdiReload} size={1} /></Button>
        </div>
        
        <div className="w-full">
        <div className="text-right">
        <Button variant="ghost" disabled={selected.length == 0}><Icon path={mdiCloudDownloadOutline} size={1} /></Button>
        
        <Button variant="ghost" className="cursor-default">
            <label htmlFor="fileUpload" className="cursor-pointer">
            <Icon path={mdiCloudUploadOutline} size={1} />
            </label>
        </Button>
        <input className="hidden" id="fileUpload" type="file" multiple onChange={uploadFiles} />

        <Button variant="ghost" disabled={selected.length != 1}><Icon path={mdiPencilOutline} size={1} /></Button>
        <Button variant="ghost" disabled={selected.length == 0}><Icon path={mdiFolderMoveOutline} size={1} /></Button>
        <Button variant="ghost" disabled={selected.length == 0}><Icon path={mdiContentCopy} size={1} /></Button>
        <Button variant="ghost" disabled={selected.length == 0} onClick={deleteSelected}><Icon path={mdiDeleteOutline} size={1} /></Button>
        </div>
        </div>
        </div>
        
        
        <DataTable getSelected={setSelected} cellClick={handleClick} columns={columns} data={data} />
        
        </Layout>
        )
    }