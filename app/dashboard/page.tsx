import { Button } from "@/components/ui/button"
import { Layout } from "@/app/components/dash_lay"

export default function Home() {
    return (
            <Layout>
            <h1>General</h1>
            
            <div className="grid grid-cols-3">
                <div>
                    <div>
                        <h2>Quick Commands</h2>
                        <Button variant="secondary">Day</Button>
                        <Button variant="secondary">Night</Button>
                        <Button>Clear Weather</Button>
                    </div>
                </div>
                <div className="col-span-2">
                    <div>
                        <h2>Players</h2>
                        x / y online greendot
                        Liste von ein paar
                    </div>
                </div>
            </div>


            </Layout>
        )
    }