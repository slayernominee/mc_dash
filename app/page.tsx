import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">

        <Button variant="secondary">Secondary</Button>


        This Project uses HyperUI, TailwindCSS and Shadcn UI, thanks a lot for this free components :D 

        Also the project is build with NextJS (ReactJS Framework) and Typescript, also thanks a lot for this wonderful projects

        <h1>Hello World!</h1>
      </div>
    </main>
  )
}
