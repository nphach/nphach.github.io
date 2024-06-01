import { FaGithub, FaLinkedin } from "react-icons/fa"

export const siteConfig = {
  name: "Nikki Phach",
  description:
    "I'm a recent graduate of the University of Massachusetts Boston with a degree in Computer Science. Currently I'm looking to launch my career in software engineering.",
  mainNav: [
    {
      title: "home",
      href: "#home",
    },
    {
      title: "about me",
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