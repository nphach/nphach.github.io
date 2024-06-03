import { useMediaQuery } from 'react-responsive';
import './App.css'
import { RiStarSmileLine } from "react-icons/ri";
import Portrait from './assets/me.png';
import MobileNav from "/src/components/mobile-nav"
import FullNav from "/src/components/full-nav"
import Projects from "/src/components/projects"
import { Separator } from "@/components/ui/separator"

function App() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      <nav className="fixed top-0 left-0 z-[50] w-full backdrop-blur-[3px] bg-white/90">
      <div className="flex h-[50px] justify-between items-center mx-20">
        <a href="#home">
        <RiStarSmileLine className="h-10 w-auto ml-3" />
        </a>
        {isMobile ? <MobileNav /> : <FullNav />}
      </div>
      <Separator />
      </nav>

      <section id="home" className="pt-[60px] h-[20px]" />
      <div className="flex justify-center h-[40vh]">
        <img src={ Portrait } alt="me"/>
      </div>
      <div className="h-[20px]" />

      <section id="projects" className="flex justify-center items-center w-4/5 min-w-[300px] h-[50vh] mx-auto">
        <Projects />
      </section>
    </>
  );
}

export default App
