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
  SheetTrigger,
} from "@/components/ui/sheet"
import { FaBars } from "react-icons/fa"
import { siteConfig } from "@/config/site"

function MainNav() {
  return (
    <>
      {siteConfig.mainNav.map((item, i) => (
        <SheetClose key={i}><><Button variant="link"><a href={item.href}>{item.title}</a></Button></></SheetClose>
      ))}
    </>
  )
}
  
function SocialLinks() {
  return (
    <>
      {siteConfig.links.map((item, i) => (
        <div key={i}><Button variant="ghost">
          <a href={item.href}><item.icon /></a>
        </Button></div>
      ))}
    </>
  )
}

export default function MobileNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Sheet>
            <SheetTrigger><FaBars /></SheetTrigger>
            <SheetContent className="w-[250px] z-[100]">
              <div className="flex flex-col space-y-4 m-10">
                <MainNav />
                <div className="flex justify-center space-x-4">
                  <SocialLinks />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
