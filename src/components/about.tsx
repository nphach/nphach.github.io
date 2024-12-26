import { aboutConfig } from "@/config/about"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Me from '../assets/noguchi.jpg';

function About() {

    return (<>
        {/* about */}
        <section id="about" className="pt-5 md:pt-10 h-fit w-full bg-gradient-to-b from-[#FFFFFF] via-[#E2F3EE] to-[#DBF0FA] flex justify-center items-center">
            <div className="h-full w-full max-w-[1200px] py-5 px-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:px-20">

                {/* blurb */}
                <Card className="col-span-1 md:col-span-2 xl:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-3xl font-kosugi tracking-wide font-bold">&gt; hello world!</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
                        {aboutConfig.info.map((item, i) => (
                            <p key={i} className="text-pretty text-sm">{item}</p>
                        ))}
                    </CardContent>
                </Card>

                {/* pic */}
                <div className="col-span-1 row-span-2 bg-black rounded-lg">
                    <img src={Me} className="object-cover h-full rounded-lg"/>
                </div>

                {/* education */}
                <Card className="col-span-1 xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-kosugi tracking-wide font-bold">&gt; education</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {aboutConfig.edu.map((item, i) => (
                            <p key={i} className="text-sm">
                                <b>{item.school}</b> <br />
                                {item.focus}, <i>{item.completed}</i>
                            </p>
                        ))}
                    </CardContent>
                </Card>

                {/* skills */}
                <Card className="col-span-1 xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-kosugi tracking-wide font-bold">&gt; skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow text-pretty text-sm">
                        {aboutConfig.skills.join(", ")}
                    </CardContent>
                </Card>
            </div>
        </section>

    </>)
}

export default About
