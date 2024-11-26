import { useMediaQuery } from "react-responsive";

function Contact() {
    const isMobile = useMediaQuery({ maxWidth: 768 })
    return (
        <section id="contact" className="h-[100%] w-full flex flex-col justify-center">
            <div className="bg-gradient-to-b from-[#C4DFF5] to-[#D1DDF5] h-1/2 flex flex-grow flex-col basis-1/2 px-20 py-20 items-start justify-end">
                <div className="flex items-center font-kosugi">
                    <p className="text-7xl font-bold text-accent pr-5">*</p>
                    <p className="text-6xl font-black tracking-wide">contact</p>
                </div>
            </div>
            <div className="bg-black h-1/2 flex flex-grow flex-col basis-1/2 px-20 py-20 items-start justify-end">
                <div className="flex items-center font-kosugi">
                    <p className="text-7xl font-bold text-accent pr-5">*</p>
                    <p className="text-6xl font-black text-background tracking-wide">contact</p>
                </div>
            </div>
        </section>
    )
}

export default Contact
