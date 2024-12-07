import { FaGithub, FaLinkedin } from "react-icons/fa"

function Contact() {
    return (
        <section id="contact" className="h-full w-full flex flex-col justify-center">
            <div className="bg-gradient-to-b w-full from-[#ffffff] to-[#D2D2F4] basis-[70%] flex flex-col justify-end">
                <div className="mx-auto w-full max-w-[1200px] px-20 pb-20">
                    <div className="flex items-center font-kosugi">
                        <p className="text-7xl font-bold text-accent pr-5">*</p>
                        <p className="text-6xl font-black tracking-wide">contact</p>
                    </div>
                </div>
            </div>
            <div className="bg-black basis-[30%]">
                <div className="mx-auto w-full max-w-[1200px] px-20 py-20">
                    <div className="flex justify-between items-center">
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
            </div>
        </section >
    )
}

export default Contact
