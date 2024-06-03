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
import { ScrollArea } from "@/components/ui/scroll-area"
import { RiArrowDropRightLine } from "react-icons/ri"
import { useMediaQuery } from 'react-responsive';

export default function Projects() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return(
    <div className="flex justify-center items-center w-full h-fit">
      <Carousel className="w-full">
      {!isMobile && <CarouselPrevious />}

      <CarouselContent>
        {projectsConfig.map((project, i) => (
          <CarouselItem key={i}>
          <Card className="flex flex-row h-full max-h-[50vh]">
            {project.image && !isMobile &&
              <img src={project.image} alt="" className="h-full object-contain flex h-full max-h-full border-r"/>}

            <div className="flex w-full flex flex-col">
              <div className="flex items-center justify-center text-center border-b">
                <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div>{project.tech}</div>
                </CardHeader>
              </div>
              
              <ScrollArea className="flex overflow-auto p-3">
                <CardContent>
                  <ul className="list-disc text-start">
                  {project.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                  </ul>
                </CardContent>
                {project.href && 
                  <CardFooter className="justify-center">
                  <Button variant="link">
                    <a href={project.href}><div>see more <RiArrowDropRightLine className="inline" /></div></a>
                  </Button>
                  </CardFooter>}
              </ScrollArea>
            </div>
          </Card>
          </CarouselItem>
        ))}
        </CarouselContent>

      {!isMobile && <CarouselNext />}
      </Carousel>
    </div>
  )
}