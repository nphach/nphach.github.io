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
import { useMediaQuery } from "react-responsive"
import { useRef, useEffect } from "react";
import { useScroll } from "framer-motion"

export default function Projects() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const colors = ["#87cefa", "#ffb6c1", "#fff0f5", "#e9b5d5", "#e7eaf1", "#fac0b5", "#a4dded"]
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]
  const container = useRef();
  const paths = useRef([]);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  })

  useEffect( () => {
    scrollYProgress.on("change", e => {
      paths.current.forEach( (path, i) => {
        path.setAttribute("startOffset", -12 + (i * 12) + (e * 24) + "%");
      })
    })
  }, [])

  return(
    <section id="about" className="relative p-6 flex gap-6 justify-center items-center w-screen h-screen">
      <div className="absolute inset-0 overflow-hidden z-[10]" ref={container}>
        <svg className="absolute top-1/2 h-screen left-0 w-full min-w-[1460px] transform -translate-y-1/2" viewBox="0 0 1465 500" fill="none">
          <path id="curve" fill="none" d="M0.5 145C92.1667 23.1667 307.4 -134.8 435 208C594.5 636.5 811.463 438.833 866 335.5C932.5 209.5 1090 27.0001 1249.5 145C1377.1 239.4 1445 411.833 1464 499"/>
          <text className="text-7xl">
            {[...Array(10)].map((_, i) => {
              return <textPath key={i} ref={ref => paths.current[i] = ref} style={{fill: getRandomColor()}} href="#curve">projects</textPath>
            })}
          </text>
        </svg>
      </div>
      
      <Carousel className="w-[85%] max-w-[800px] z-[30]">
        <CarouselPrevious className="bg-[#fefefe]/90"/>

        <CarouselContent>
          {projectsConfig.map((project, i) => (
            <CarouselItem key={i} className="flex justify-center items-center">
            <Card className="flex flex-row h-full w-[95%] m-3 max-h-[55vh] rounded-lg bg-[#fefefe]/60 backdrop-blur-[2px]">
              {project.image && !isMobile &&
                <img src={project.image} alt="" className="h-full object-contain flex self-center border-r rounded-l-lg"/>}

              <div className="flex w-full flex flex-col">
                <div className="flex items-center justify-center text-center border-b">
                  <CardHeader className="bg-[#fefefe]">
                  <CardTitle className="text-xl text-balance">{project.title}</CardTitle>
                  <div>{project.tech}</div>
                  </CardHeader>
                </div>
                
                <ScrollArea className="flex overflow-auto p-3 rounded-lg">
                  <CardContent>
                    <ul className="list-disc text-start text-pretty">
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

        <CarouselNext/>
      </Carousel>
    </section>
  )
}
