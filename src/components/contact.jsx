import { Card, CardTitle, CardFooter, CardContent } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

export default function Contact() {
  return (
    <section id="contact" className="flex justify-center items-center bg-[#e6e6fa] h-screen w-screen">
    <Card className="flex-col max-w-wd w-[280px] h-[300px]">
      <CardTitle className="text-5xl p-5">wanna talk?</CardTitle>
      <CardContent className="p-5 text-balance">
        You can find me on LinkedIn and Github. Or you can shoot me an e-mail with this form.
      <CardFooter className="justify-center p-3">
        {siteConfig.links.map((item, index) => (
          <div key={index}><Button variant="ghost" passhref="true">
            <a href={item.href}><item.icon /></a>
          </Button></div>
        ))}
      </CardFooter>
      </CardContent>
    </Card>
    </section>
  )
}
