import { useMediaQuery } from "react-responsive";

function About() {
    const isMobile = useMediaQuery({ maxWidth: 768 })

    return (
        <>
        {isMobile ?
            (<section id="about" className="bg-gradient-to-b from-white from-0% via-[#D7EFE5] via-66% to-[#C7E8ED] to-100% h-[150%] w-full flex flex-col justify-start">
                <div className="flex font-kosugi pl-20 pb-3">
                    <p className="text-7xl font-bold text-accent pr-5">*</p>
                    <p className="text-6xl font-black tracking-wide">about</p>
                </div>
            </section>) :
            (<section id="about" className="bg-gradient-to-b from-white from-0% via-[#D7EFE5] via-66% to-[#C7E8ED] to-100% h-[150%] w-full flex flex-col justify-start">
                <div className="flex font-kosugi pl-20 pb-3">
                    <p className="text-7xl font-bold text-accent pr-5">*</p>
                    <p className="text-6xl font-black tracking-wide">about</p>
                </div>
            </section>)
        }
        </>
    )
}

export default About
