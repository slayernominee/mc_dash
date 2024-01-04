"use client"
import { Sidebar } from "@/components/hyper/sidebar"
import { Ops } from "@/components/dash/ops"

export default function Home() {

    return (
        <main className="grid grid-cols-6">
        <Sidebar />
        <div className="w-full col-span-5 px-24 py-[10%]">
            <h1>Ops</h1>
            <Ops />
        </div>
        </main>
    )
    }
