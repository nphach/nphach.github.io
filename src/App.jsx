import './App.css'
import { useMediaQuery } from 'react-responsive';
import { RiStarSmileLine } from "react-icons/ri";
import FullNav from "/src/components/full-nav"
import MobileNav from "/src/components/mobile-nav"
import Header from "/src/components/header"
import About from "/src/components/about"
import Projects from "/src/components/projects"
import Contact from "/src/components/contact"
import { Separator } from "@/components/ui/separator"

function App() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full backdrop-blur-[3px] bg-white/90 flex h-[50px] justify-between items-center px-20">
        <a href="#home">
        <RiStarSmileLine className="h-10 w-auto ml-3" />
        </a>
        {isMobile ? <MobileNav /> : <FullNav />}
      </div>
      <Separator/>

      <section id="home" className="flex justify-center items-center bg-black w-screen h-screen">
        <Header />
      </section>

      <section id="about" className="flex justify-center items-center bg-[#a4dded] w-screen h-screen">
        <About />
      </section>

      <section id="projects" className="flex justify-center items-center bg-[#E6E6FA] h-screen w-screen">
        <Projects />
      </section>

      <section id="contact" className="flex justify-center items-center bg-[#98FF98] h-screen w-screen">
        <Contact />
      </section>
    </>
  );
}

export default App
