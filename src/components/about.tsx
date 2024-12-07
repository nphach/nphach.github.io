import { useMediaQuery } from "react-responsive";

function About() {
    const isMobile = useMediaQuery({ maxWidth: 768 })

    return (
        <>
        {isMobile ?
            (<section id="about" className="bg-gradient-to-b from-white to-[#D7EFE5] h-full max-h-[960px] w-full flex justify-center">
                <div className="h-full w-full max-w-[1200px] pt-10 flex justify-center">
                    <div className="flex font-kosugi pl-20 pb-3">
                        <p className="text-7xl font-bold text-accent pr-5">*</p>
                        <p className="text-6xl font-black tracking-wide">about</p>
                    </div>
                </div>
            </section>) :
            (<section id="about" className="bg-gradient-to-b from-white to-[#D7EFE5] h-full max-h-[960px] w-full flex justify-center">
                <div className="h-full w-full max-w-[1200px] flex justify-center">
                    <div className="flex font-kosugi pl-20 pb-3">
                        <p className="text-7xl font-bold text-accent pr-5">*</p>
                        <p className="text-6xl font-black tracking-wide">about</p>
                    </div>
                </div>
            </section>)
        }
        </>
    )
}

export default About
