import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { aboutConfig } from "@/config/about"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FaLocationDot } from "react-icons/fa6"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Lenis from 'lenis';
import Me from '../assets/nyan.jpeg'

export default function About() {
  const colors = ["#87cefa", "#ffb6c1", "#fff0f5", "#e9b5d5", "#e7eaf1", "#fac0b5"]
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  const Slide = ({ direction, progress, offset }) => {
    const dir = direction === 'left' ? -1 : 1;
    const translateX = useTransform(progress, [0, 1], [150 * dir, -150 * dir])

    const Phrase = ({ color }) => (
      <div className='px-5 flex gap-5 items-center'>
        <div style={{ transform: `translateX(${offset})`, color }} className='text-6xl leading-normal opacity-[90%]'>{aboutConfig.emoji}</div>
      </div>
    );
  
    return (
      <motion.div style={{ translateX }} className="flex whitespace-nowrap">
        {[...Array(5)].map((_, i) => (
          <Phrase key={i} color={getRandomColor()} />
        ))}
      </motion.div>
    );
  }

  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  })

  return (
    <>
    <section id="about" className="relative p-6 flex gap-6 justify-center items-center bg-[#a4dded] w-screen h-screen">
      <div className="absolute inset-0 overflow-hidden z-[10]" ref={container}>
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
          <Slide offset={"-40%"} direction={'left'} progress={scrollYProgress}/>
          <Slide offset={"-25%"} direction={'right'} progress={scrollYProgress}/>
          <Slide offset={"-75%"} direction={'left'} progress={scrollYProgress}/>
          <Slide offset={"-05%"} direction={'right'} progress={scrollYProgress}/>
        </div>
      </div>

      <Card className="w-[82dvh] h-[68dvh] min-h-[325px] min-w-[300px]  z-[20]">
        <CardTitle className="flex text-3xl p-1 h-[20%] justify-center items-center">about me</CardTitle>
        <Separator/>
        <ScrollArea className="h-[80%] overflow-auto p-3 gap-4">
          <CardDescription className="flex h-4/5 flex-col justify-center items-center text-md p-4 gap-2 text-balance">
            <Avatar className="h-[60px] w-auto">
              <AvatarImage src={Me} alt=""/>
            </Avatar>
            <div>{aboutConfig.emoji}</div>
            <div><FaLocationDot className="inline mr-2" />{aboutConfig.location}</div>
            <div className="flex flex-col inline">
              <div>{aboutConfig.major}</div>
              <div>{aboutConfig.school}</div>
            </div>
            <div>{aboutConfig.currently}</div>
          </CardDescription>
          <CardContent className="p-3 h-full text-start">
            {aboutConfig.text.map((item, i) =>
              <div key={i} className="text-md text-pretty indent-10 pb-3 leading-relaxed">{item}</div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </section>
    </>
  )
}