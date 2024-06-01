import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { siteConfig } from "@/config/site"

function MainNav() {
  return (
    <>
      {siteConfig.mainNav.map((item) => (
        <NavigationMenuItem key={item.href}>
          <a href={item.href} passhref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {item.title}
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>
      ))}
    </>
  )
}

function SocialLinks() {
  return (
    <>
      {siteConfig.links.map((item) => (
        <NavigationMenuItem>
          <a href={item.href}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <item.icon />
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>
      ))}
    </>
  )
}

export default function FullNav() {
  return ( 
    <NavigationMenu>
      <NavigationMenuList>
        <MainNav />
        <SocialLinks />
      </NavigationMenuList>
    </NavigationMenu>
  );
}