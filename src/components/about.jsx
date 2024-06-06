import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { aboutConfig } from "@/config/about"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FaLocationDot } from "react-icons/fa6";
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Me from '../assets/nyan.jpeg';

export default function About() {
  return (
    <>
    <section id="about" className="p-6 flex gap-6 justify-center items-center bg-[#a4dded] w-screen h-screen">
      <Card className="w-[100dvh] h-[68dvh] min-h-[575px] min-w-[342px]">
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