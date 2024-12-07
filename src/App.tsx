import NavBar from "@/components/navbar"
import Hero from "@/components/hero"
import Contact from "@/components/contact"

function App() {

  return (
    <>
    <NavBar/>
    <div className="pt-12 h-screen w-screen overflow-x-hidden">
      <Hero />
      <Contact />
    </div>
    </>
  )
}

export default App
