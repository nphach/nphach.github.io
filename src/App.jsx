import { useMediaQuery } from 'react-responsive';
import './App.css'
import Logo from './assets/logo.png';
import MobileNav from "/src/components/mobile-nav"
import FullNav from "/src/components/full-nav"
import Projects from "/src/components/projects"
import { Separator } from "@/components/ui/separator"

function App() {
  const isMobile = useMediaQuery({ maxWidth: 700 });

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <a href="#home">
          <img src={ Logo } alt="logo" className="h-12 w-auto" />
        </a>
        {isMobile ? <MobileNav /> : <FullNav />}
      </div>

      <Separator className="mt-6" />

      <Projects />
    </>
  );
}

export default App
