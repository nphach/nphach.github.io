import { aboutConfig } from "@/config/about"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function About() {

    return (
        <section id="about" className="md:max-h-[960px] h-fit w-full bg-gradient-to-b from-[#FFFFFF] to-[#D7EFE5] flex justify-center items-center">
            <div className="min-h-full max-w-[1200px] py-20 px-10 flex flex-col gap-5 md:px-20 md:pt-10 md:pb-20">
                <p className="text-7xl font-bold text-accent font-kosugi self-end">*</p>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-kosugi tracking-wide font-bold">&gt; hello world!</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 max-h-[420px] overflow-y-scroll">
                        {aboutConfig.info.map((item, i) => (
                            <p key={i} className="text-pretty text-sm">{item}</p>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex flex-col md:flex-row gap-5">
                    <Card className="md:flex-[2] flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-kosugi tracking-wide font-bold">&gt; education</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {aboutConfig.edu.map((item, i) => (
                                <p key={i} className="lg:whitespace-nowrap text-sm">
                                    <b>{item.school}</b> <br />
                                    {item.focus}, <i>{item.completed}</i>
                                </p>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="md:flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-kosugi tracking-wide font-bold">&gt; skills</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow text-pretty text-sm">
                            {aboutConfig.skills.join(", ")}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default About
