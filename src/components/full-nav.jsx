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
      {siteConfig.mainNav.map((item, i) => (
        <NavigationMenuItem key={i}>
          <NavigationMenuLink href={item.href} passhref="true" className={navigationMenuTriggerStyle()}>
            {item.title}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </>
  )
}

function SocialLinks() {
  return (
    <>
      {siteConfig.links.map((item, i) => (
        <NavigationMenuItem key={i}>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href={item.href} passhref="true">
            <item.icon />
          </NavigationMenuLink>
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