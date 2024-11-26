import { FaGithub, FaLinkedin } from "react-icons/fa"

export const siteConfig = {
  name: "Nikki Phach",
  mainNav: [
    {
      title: "home",
      href: "#home",
    },
    {
      title: "about",
      href: "#about",
    },
    {
      title: "projects",
      href: "#projects"
    },
    {
      title: "contact",
      href: "#contact"
    }
  ],
  links: [
    {
      site: "github",
      href: "https://github.com/nphach",
      icon: FaGithub
    },
    {
      title: "linkedin",
      href: "https://linkedin.com/in/nphach",
      icon: FaLinkedin
    }
  ]
}