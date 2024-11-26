import { useMediaQuery } from "react-responsive";

function Projects() {
    const isMobile = useMediaQuery({ maxWidth: 768 })
    const grid = isMobile ? "grid grid-cols-2 gap-4 place-content-stretch h-full w-full" : "grid grid-cols-3 gap-4 place-content-stretch h-full w-full"

    return (
        <section id="projects" className="bg-gradient-to-b from-[#C7E8ED] to-[#C4DFF5] h-full w-full flex flex-grow flex-col items-start justify-center">
            <div className="flex items-center font-kosugi py-20 pl-20">
                <p className="text-7xl font-bold text-accent pr-5">*</p>
                <p className="text-6xl font-black tracking-wide">projects</p>
            </div>
            <div className={grid}>
                <div className="bg-black text-white">1</div>
                <div className="bg-black text-white">2</div>
                <div className="bg-black text-white">3</div>
                <div className="bg-black text-white">4</div>
                <div className="bg-black text-white">5</div>
                <div className="bg-black text-white">6</div>
            </div>
        </section>
    )
}

export default Projects
