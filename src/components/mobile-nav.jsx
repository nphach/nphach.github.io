import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FaBars, FaGithub, FaLinkedin } from "react-icons/fa"

export default function MobileNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Sheet>
            <SheetTrigger><FaBars /></SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 m-10">
                  <SheetClose><Button variant="link"><a href="#home">home</a></Button></SheetClose>
                  <SheetClose><Button variant="link"><a href="#about">about</a></Button></SheetClose>
                  <SheetClose><Button variant="link"><a href="#projects">projects</a></Button></SheetClose>
                  <SheetClose><Button variant="link"><a href="#contact">contact</a></Button></SheetClose>
                  <div className="flex justify-center space-x-4">
                    <Button variant="ghost">
                        <a href="https://github.com/nphach"><FaGithub /></a>
                    </Button>
                    <Button variant="ghost">
                        <a href="https://linkedin.com/in/nphach"><FaLinkedin /></a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
          </Sheet>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
