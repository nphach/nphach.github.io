import { useMediaQuery } from "react-responsive";
import { useRef, useEffect } from "react";
import Portrait from '../assets/me.png';

function Hero() {
    const isMobile = useMediaQuery({ maxWidth: 768 })
    const containerRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const img = imgRef.current
        if (!container || !img) return;

        const draw = (x: number, y: number) => {
            const trail = document.createElement("img")
            trail.src = Portrait
            trail.className = "h-[350px] w-auto absolute -translate-x-1/2 -translate-y-1/2"
            trail.style.top = `${y}px`
            trail.style.left = `${x}px`
            container.appendChild(trail)

            if (container.childNodes.length > 30) {
                erase();
            } else {
                setTimeout(() => { erase() }, 1500)
            }
        }

        const erase = () => {
            container.removeChild(container.childNodes[1])
        }

        const manageMouseMove = (e: MouseEvent) => {
            const containerRect = container.getBoundingClientRect()
            const x = e.clientX - containerRect.x
            const y = e.clientY - containerRect.y
            img.style.top = `${y}px`;
            img.style.left = `${x}px`;
            draw(x, y);
        }

        container.addEventListener('mousemove', manageMouseMove);
    }, [isMobile])

    return (
        <section id="home" className="bg-gradient-to-b from-[#D3DAE9] to-white h-full max-h-[960px] w-full flex justify-center">
            <div className="h-full w-full max-w-[1200px] flex justify-center">
                <div className="h-full flex flex-grow flex-col basis-1/2 px-20 py-20 items-start justify-end">
                    <p className="text-9xl text-black font-kosugi font-semibold tracking-wide py-6">
                        Nikki<br />Phach
                    </p>
                    <div className="flex items-center">
                        <p className="text-7xl font-bold text-accent pr-5 font-kosugi">*</p>
                        <p className="text-2xl tracking-wide">programmer, web developer, engineer</p>
                    </div>
                </div>
                {!isMobile &&
                    <div className="basis-1/2 py-5">
                        <div ref={containerRef} className="bg-zinc-900 basis-1/2 h-full relative overflow-hidden rounded">
                            <img ref={imgRef} src={Portrait} draggable="false" className="h-[350px] w-auto absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                        </div>
                    </div>}
            </div>
        </section>
    )
}

export default Hero
