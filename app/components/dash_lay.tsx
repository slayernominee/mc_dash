import { Sidebar } from '@/components/hyper/sidebar'
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="grid grid-cols-6 overflow-hidden h-[100vh]">
        <Sidebar />
        <div className="w-full col-span-5 px-24 py-[7%]">
            {children}
        </div>
        <Toaster />
        </main>
        )
}

export { Layout }