import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import emailjs from "@emailjs/browser"

const formSchema = z.object({
  userName: z.string().min(1, { message: "Name is required" }),
  userEmail: z.string().email({ message: "Invalid email address" }),
  emailBody: z.string().min(1, { message: "Message body is required" }),
})

export default function Contact() {
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      emailBody: "",
    },
  });

  function handleSubmit(data) {
    emailjs.send("service_14r6c6h", "template_qgefkqb", {
      userName: data.userName,
      userEmail: data.userEmail,
      emailBody: data.emailBody
    }, "nZSIGURAm9zGepcVo")
      .then(
        () => {
          toast({
            title: 'Success!',
            description: 'Your message has been sent.',
          });
        }, () => {
          toast({
            title: 'Error',
            description: 'There was an error sending your message. Please try again.',
          });
        });
  }

  return (
    <section id="contact" className="flex justify-center items-center bg-[#e6e6fa] h-screen w-screen overflow-hidden">
      <Card className="flex flex-col w-[85%] max-w-[800px] h-[80%] text-sm  justify-center items-center">
        <CardHeader className="p-2">
          <CardTitle className="text-4xl p-4">wanna talk?</CardTitle>
          You can find me on LinkedIn and Github. Or you can shoot me an e-mail below.
          <div className="flex flex-row justify-center">
            {siteConfig.links.map((item, index) => (
              <div key={index}>
                <Button variant="ghost" passhref="true">
                  <a href={item.href}><item.icon /></a>
                </Button>
              </div>
            ))}
          </div>
        </CardHeader>
        <ScrollArea className="shrink h-fit overflow-auto p-3 text-left text-xs w-full">
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs">
                        {form.formState.errors.userName?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs">
                        {form.formState.errors.userEmail?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailBody"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your message" {...field} className="h-full" />
                      </FormControl>
                      <FormMessage className="text-xs">
                        {form.formState.errors.emailBody?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </ScrollArea>
      </Card>
    </section>
  )
}
