import { Card, CardTitle, CardFooter, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { projectsConfig } from "@/config/projects"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Projects() {
  return(
    <section id="projects">
    <Carousel>
    <CarouselPrevious />
    <CarouselContent>
      {projectsConfig.map((project, i) => (
        <CarouselItem key={i}>
          <Card>
            <CardHeader>
              <CardTitle className="m-4">{project.title}</CardTitle>
              <div>{project.tech}</div>
            </CardHeader>
            <Separator />
            <CardContent className="m-4">
              <ul>
                {project.description.map((item, i) => (
                  <li key={i}>{item}</li>
                 ))}
              </ul>
            </CardContent>
            {project.href && <CardFooter className="justify-center"><Button variant="link"><a href={project.href}>link</a></Button></CardFooter>}
            </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselNext />
    </Carousel>
    </section>
  )
}
