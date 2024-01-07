"use client"
import { Layout } from "@/app/components/dash_lay"
import React, { DragEventHandler, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import Icon from '@mdi/react';
import { mdiDeleteOutline, mdiChevronUp, mdiFolderMoveOutline, mdiHomeOutline, mdiPencilOutline, mdiReload, mdiCloudDownloadOutline, mdiCloudUploadOutline, mdiContentCopy } from '@mdi/js';

import { File, getColumns } from "@/app/dashboard/files/columns"
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

async function renameFile(oldName: string, newName: string) {
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/rename/' + oldName + "/" + newName, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    })
}

export default function Home() {
    const [data, setData] = useState<File[]>([])
    const [path, setPath] = useState("&.")
    const [selected, setSelected] = useState<File[]>([])
    const [columns, setColumns] = useState<any[]>([])
    
    const refresh = async () => {
        const res = await getData(path)
        setData(res)
    }
    
    const saveNewFileName = async (newName: string) => {
        newName = newName.replaceAll("/", "&")
        newName = newName.replaceAll(".", "&.")
        newName = path + "&" + newName
        newName = newName.replace("\n", "")
        let oldName = selected[0].getValue("name")
        oldName.replaceAll("/", "&")
        oldName.replaceAll(".", "&.")
        oldName = path + "&" + oldName
        
        renameFile(oldName, newName)

        setColumns(getColumns(-1, saveNewFileName))
        
        setSelected([])

        setTimeout(async () => {
            const res = await getData(path)
            setData(res)
        }, 20)
    }

    useEffect(() => {
        setColumns(getColumns(-1, saveNewFileName))
        refresh()
    }, [])
    
    const goToHome = async () => {
        setPath("&.")
        const res = await getData("&.")
        setColumns(getColumns(-1, saveNewFileName))
        setData(res)
    }
    
    const goUpwards = async () => {
        const pathArr = path.split("&")
        pathArr.pop()
        const newPath = pathArr.join("&")
        setPath(newPath)
        const res = await getData(newPath)
        setColumns(getColumns(-1, saveNewFileName))
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
            setColumns(getColumns(-1, saveNewFileName))
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

    const renameSelected = async () => {
        let row_index = selected[0].id
        setColumns(getColumns(row_index, saveNewFileName))
        refresh()
    }
    
    const addToFileUpload = async (e: any) => {
        e.preventDefault();
        const dataTransfer = e.dataTransfer;
        const files = dataTransfer.files;
        
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

    const onDragOver = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
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
        
        <Button variant="ghost" disabled={selected.length != 1} onClick={renameSelected}><Icon path={mdiPencilOutline} size={1} /></Button>
        <Button variant="ghost" disabled={selected.length == 0}><Icon path={mdiFolderMoveOutline} size={1} /></Button>
        <Button variant="ghost" disabled={selected.length == 0}><Icon path={mdiContentCopy} size={1} /></Button>
        <Button variant="ghost" disabled={selected.length == 0} onClick={deleteSelected}><Icon path={mdiDeleteOutline} size={1} /></Button>
        </div>
        </div>
        </div>
        
        <div onDragOver={onDragOver} onDrop={addToFileUpload}>
        <DataTable getSelected={setSelected} cellClick={handleClick} columns={columns} data={data} />
        </div>
        
        </Layout>
        )
    }