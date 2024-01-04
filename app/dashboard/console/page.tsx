import { Sidebar } from "@/components/hyper/sidebar"
import { Console } from "@/components/dash/console"

export default function Home() {
    return (
        <main className="grid grid-cols-6">
        <Sidebar />
        <div className="w-full col-span-5 px-24 py-[10%]">
            <h1>Console</h1>
            <Console />
        </div>
        </main>
        )
    }