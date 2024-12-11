"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import emailjs, { init } from "@emailjs/browser"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import { FaGithub, FaLinkedin } from "react-icons/fa"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    message: z.string().min(2).max(1000)
})

function Contact() {
    init("nZSIGURAm9zGepcVo");
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        emailjs.send(
            "service_14r6c6h",
            "template_qgefkqb",
            values,
            "nZSIGURAm9zGepcVo"
        ).then(
            () => {
                toast({
                    title: 'Success!',
                    description: 'Your message has been sent.',
                });
            },
            () => {
                toast({
                    title: 'Error',
                    description: 'There was an error sending your message. Please try again.'
                });
            });
    }

    return (
        <section id="contact" className="h-full w-full">
            <div className="bg-gradient-to-b from-[#FFFFFF] to-[#D2D2F4] h-[70%] w-full flex justify-center">
                <div className="h-full w-full max-w-[1200px] flex flex-col justify-evenly items-start py-2 px-10 gap-5 md:flex-row md:px-20">
                    {/* contact */}
                    <div className="flex items-end font-kosugi md:basis-1/2 md:h-full md:pb-20">
                        <p className="text-7xl font-bold text-accent pr-5">*</p>
                        <p className="text-5xl md:text-6xl font-black tracking-wide">contact</p>
                    </div>

                    {/* form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full basis-1/2 space-y-4 md:flex-col md:self-center">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" {...field} autoComplete="name" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input placeholder="janedoe@email.com" {...field} autoComplete="email" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Hello world!"
                                                className="min-h-[100px] md:min-h-[120px]"
                                                {...field}
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Send</Button>
                            <Toaster />
                        </form>
                    </Form>
                </div>
            </div>

            {/* footer */}
            <div className="bg-black h-[30%] flex justify-center">
                <div className="h-full w-full max-w-[1200px] flex flex-col justify-evenly p-10 gap-3 md:flex-row md:justify-between md:p-20 md:items-center">
                    <div className="flex flex-col items-start font-kosugi text-xl">
                        <p className="font-bold text-accent">email</p>
                        <p className="text-[#D2D2F4] tracking-wide">
                            <a href="mailto:nikkiphach@gmail.com">nikkiphach@gmail.com</a>
                        </p>
                    </div>

                    <div className="flex font-kosugi gap-x-3 text-4xl text-[#D2D2F4]">
                        <a href="https://github.com/nphach/"><FaGithub /></a>
                        <a href="https://www.linkedin.com/in/nphach/"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact