import { Layout } from '@/app/components/dash_lay'

export default function AboutPage() {
    return (
        <Layout>
        <h1>About</h1>

        <div>

            <h2>MC Dash</h2>
            <p>MC Dash is a free and opensource Minecraft Server Dashboard made with NextJS (React) & Actix Web (Rust)</p>
            <a href='https://github.com/slayernominee/mc_dash' target='_blank' className='underline'>Please give it a start on Github</a>


            <h2 className='mt-8'>Used UI Librarys</h2>
            <ul>
                <a className='underline' target='_blank' href='https://ui.shadcn.com/'><li>Shadcn UI</li></a>
                <a className='underline' target='_blank' href='https://www.hyperui.dev/'><li>Hyper UI</li></a>
            </ul>

        </div>

        </Layout>
    )
}