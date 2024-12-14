import NavBar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Contact from "@/components/contact"

function App() {

  return (
    <>
    <NavBar/>
    <div className="pt-12 h-screen w-screen overflow-x-hidden">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
    </>
  )
}

export default App
