"use client"
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

async function check_if_setup() {
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/is_setup', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then((res) => res.json())
    return data
}

async function get_paper_versions() {
    const data = await fetch('https://papermc.io/api/v2/projects/paper', {
        method: 'GET',
    }).then((res) => res.json())
    return data
}

async function donwload_server_cmd(url: string) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download_server/${url}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    return data
}

async function run_once() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/run_once`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
    })
    return data
}

async function get_eula() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/eula&.txt`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
    })
    const text = await data.text()
    return text
}

async function agree_to_eula() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agree_to_eula`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
    })

}

export default function SetupPage() {

    const [step, setStep] = useState(0)
    const [versions, setVersions]: [String[], Function] = useState(["still", "fetching", "data"])


    const [selectedServer, setSelectedServer] = useState('')
    const [selectedVersion, setSelectedVersion] = useState('')
    const [eulaContent, setEulaContent] = useState('loading eula.txt ...')
    const [eulaAgreement, setEulaAgreement] = useState(false)


    async function get_paper_download_link() {
        const data = await fetch(`https://papermc.io/api/v2/projects/paper/versions/${selectedVersion}/builds`, {
            method: 'GET',
        }).then((res) => res.json()).then((data) => {
            return data.builds.reverse()[0]
        }).then((build) => {
            return fetch(`https://papermc.io/api/v2/projects/paper/versions/${selectedVersion}/builds/${build.build}`, {
                method: 'GET',
            }).then((res) => res.json()).then((data) => {
                return `https://papermc.io/api/v2/projects/paper/versions/${selectedVersion}/builds/${build.build}/downloads/${data.downloads.application.name}`
            })
        })
        return data
    
    }

    useEffect(() => {

        check_if_setup().then((is_setup) => {
            if (is_setup) {
                window.location.href = '/dashboard'
            }
        })

    }, [])

    const versionStep = () => {
        setStep(1)

        // get selected server
        if (selectedServer == 'paper') {
            // paper version listing
            get_paper_versions().then((data) => {
                let versions = data.versions.reverse()
                setVersions(versions)
            })
        } else {
            // custom version listing
        }
    }

    const downloadVersion = () => {
        // download the version
        if (selectedServer == 'paper') {
            // paper version listing
            setStep(2)
            get_paper_download_link().then((data) => {
                data = data.replaceAll("/", "&")
                donwload_server_cmd(data).then((res) => {
                    setStep(3)
                    run_once().then((res) => {
                        get_eula().then((text) => {
                            setEulaContent(text)
                            setStep(4)
                        })
                    })
                })
            })
        } else {
            // custom version listing
        }
    }

    const finishSetup = () => {
        if (!eulaAgreement ) {
            return
        }

        agree_to_eula().then((res) => {
            window.location.href = '/dashboard'
        })
    }

    return (
        <div className='w-[60%] bg-gray-50 rounded-lg text-center py-5 px-12 mx-auto mt-52'>
        <h1>Setup Wizard</h1>
        
        <div className='mt-8'>

        <div className='flex justify-center'>
        
        <div className={step == 0 ? '' : 'hidden'}>
        <Select onValueChange={setSelectedServer}>
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select the Server" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="paper">Paper</SelectItem>
        <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
        </Select>

        <Button className='mt-8' onClick={versionStep}>Next</Button>
        </div>


        <div className={step == 1 ? '' : 'hidden'}>
        <Select onValueChange={setSelectedVersion}>
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select the Version" />
        </SelectTrigger>
        <SelectContent>
        {versions.map((version) => (
            <SelectItem key={version} value={version}>{version}</SelectItem>
        ))}
        </SelectContent>
        </Select>
        
        <Button className='mt-8' onClick={downloadVersion}>Download</Button>
        </div>

        <div className={step == 2 ? '' : 'hidden'}>
        <span>Downloading the Server, please wait, this can take a bit depending on the internet connection and the server speed ...</span>
        </div>

        <div className={step == 3 ? '' : 'hidden'}>
            <span>Running the Server for the first time to create the neccesarry files</span>
        </div>

        <div className={step == 4 ? '' : 'hidden'}>
            <p>This is the content of the eula.txt</p>

            <div className='mt-4 text-left py-2 px-6 rounded-lg bg-slate-200'>
                { eulaContent.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                ))}
            </div>

            <Checkbox className='mt-4 mr-2' onCheckedChange={(v: boolean) => setEulaAgreement(v)} /><span>I agree to the eula.txt</span>
            <br />
            <Button className='mt-8' disabled={!eulaAgreement} onClick={finishSetup}>Finish</Button>
        </div>


        </div>
            
        
        <div>

        </div>
        
        </div>
        
        </div>
        )
    }