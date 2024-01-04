import { Sidebar } from "@/components/hyper/sidebar"
import { Console } from "@/components/dash/console"

export default function Home() {
    return (
        <main className="grid grid-cols-6">
        <Sidebar />
        <h1>Console</h1>
        <Console />
        </main>
    )
    }
