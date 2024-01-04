import { Sidebar } from "@/components/hyper/sidebar"
import { Console } from "@/components/dash/console"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
    return (
        <main className="grid grid-cols-6">
        <Sidebar />
        <div className="w-full col-span-5 px-24 py-[10%]">
            <h1>Console</h1>
            <Console />

            <hr />
            <div className="grid grid-cols-8 gap-4 mt-2">
            <Link href="https://minecraft.fandom.com/wiki/Commands#List_and_summary_of_commands"><Button className="w-full">Commands List</Button></Link>
            <Link href="https://minecraft-ids.grahamedgecombe.com/"><Button className="w-full">ID List</Button></Link>
            <Link href="https://minecraft.fandom.com/de/wiki/NBT"><Button className="w-full">NBT Article</Button></Link>
            </div>
        </div>
        </main>
        )
    }