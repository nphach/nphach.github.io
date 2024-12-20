import { projectsConfig } from "@/config/projects"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

function Projects() {

    return (
        <section id="projects" className="pt-5 md:pt-12 w-full bg-gradient-to-b from-[#D7EFE5] to-[#B7E1F5] flex justify-center">
            <div className="w-full max-w-[1200px] py-5 px-10 flex flex-col gap-5 md:px-20 justify-end">
                <div className="flex items-center font-kosugi self-end">
                    <p className="text-4xl md:text-6xl font-black tracking-wide">projects</p>
                    <p className="text-7xl font-bold text-accent pl-5 font-kosugi">*</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 content-end">
                    {projectsConfig.map((project, p) => (
                        <Card key={p} >
                            <CardHeader>
                                <CardTitle className="font-kosugi text-xl tracking-wide font-bold ">{project.title}</CardTitle>
                                <CardDescription className="text-sm">{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-2">
                                    {project.info.map((item, i) => (
                                        <li key={i} className="text-sm">{item}</li>
                                    ))}
                                </ul>
                            </CardContent>
                            {project.href && (
                                <CardFooter>
                                    <a href={project.href as string} className="text-sm font-kosugi font-black tracking-wide">see more →</a>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Projects
