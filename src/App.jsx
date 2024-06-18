import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { useMediaQuery } from 'react-responsive';
import ScrollButton from "/src/components/scroll-button"
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
      <div className="fixed top-0 left-0 z-50 w-full bg-white flex h-[50px] justify-between items-center px-20">
        <a href="#home">
        </a>
        {isMobile ? <MobileNav /> : <FullNav />}
      </div>
      <Separator/>

      <ScrollButton />
      
      <main>
        <Header />
        <About />
        <Projects />
        <Contact />
      </main>

      <Toaster />
    </>
  );
}

export default App
