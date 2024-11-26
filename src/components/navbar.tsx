import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
    SheetContent,
    SheetClose
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FaBars } from "react-icons/fa"
import { useMediaQuery } from "react-responsive";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { siteConfig } from "@/config/site"

function NavBar() {
    const isMobile = useMediaQuery({ maxWidth: 768 })

    return (
        <>
        {isMobile ?
            (<div className="border-b box-border flex h-12 items-center justify-end fixed w-full z-50 bg-background pr-4">
                <Sheet>
                    <SheetTrigger>
                        <FaBars className="text-foreground" size={25} />
                    </SheetTrigger>
                    <SheetContent className="flex flex-col py-12 w-[250px]">
                        <VisuallyHidden>
                            <SheetHeader>
                                <SheetTitle>menu</SheetTitle>
                                <SheetDescription>site navigation and social links</SheetDescription>
                            </SheetHeader>
                        </VisuallyHidden>
                        {siteConfig.mainNav.map((item, i) => (
                            <SheetClose asChild key={i}>
                                <Button variant="link" className="font-kosugi text-xl tracking-wide font-black py-3 px-3 text-foreground">
                                    <a href={item.href}>{item.title}</a>
                                </Button>
                            </SheetClose>
                        ))}
                        <div className="flex justify-center py-3">
                            {siteConfig.links.map((item, i) => (
                                <a href={item.href} key={i} className="px-3 text-foreground"><item.icon size={24}/></a>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>) :
            (<div className="items-center border-b box-border flex h-12 justify-end fixed w-full z-50 bg-background">
                <NavigationMenu className="pr-3">
                    <NavigationMenuList>
                        {siteConfig.mainNav.map((item, i) => (
                            <NavigationMenuItem key={i} className="font-kosugi text-l tracking-wide font-black py-3 px-3 text-foreground">
                                <NavigationMenuLink href={item.href}>
                                    {item.title}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>)
        }
        </>
    )
}

export default NavBar
