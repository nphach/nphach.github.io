export type ProfileLink = {
  href: string;
  icon: "github" | "linkedin" | "email";
  label: string;
};

export type ProjectLink = {
  href: string;
  label: string;
};

export type ProjectIconName = "kotoba-tag" | "portfolio";

export type ProjectStatus = "live" | "wip" | "archived";

export type Project = {
  name: string;
  description: string;
  icon: ProjectIconName;
  kind: string;
  status: ProjectStatus;
  year: number;
  links: ProjectLink[];
  tags: string[];
};

export const PROFILE_LINKS: ProfileLink[] = [
  {
    href: "https://github.com/nphach/",
    icon: "github",
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/nphach/",
    icon: "linkedin",
    label: "LinkedIn",
  },
  {
    href: "mailto:nikkiphach@gmail.com",
    icon: "email",
    label: "Email",
  },
];

export const PROJECTS: Project[] = [
  {
    name: "Kotoba Tag!",
    description:
      "Shiritori-style Japanese vocab game. Translate fast, chain words, and beat the clock.",
    icon: "kotoba-tag",
    kind: "game",
    status: "live",
    year: 2025,
    links: [
      {
        href: "https://kotoba-tag.com",
        label: "kotoba-tag.com",
      },
      {
        href: "https://github.com/nphach/kotoba-tag",
        label: "GitHub",
      },
    ],
    tags: ["TypeScript", "Game", "Japanese"],
  },
  {
    name: "nphach.github.io",
    description:
      "This Tamagotchi-inspired portfolio with zoom transitions and an LCD drawing layer.",
    icon: "portfolio",
    kind: "portfolio",
    status: "live",
    year: 2026,
    links: [
      {
        href: "https://github.com/nphach/nphach.github.io",
        label: "GitHub",
      },
    ],
    tags: ["React", "Motion", "CSS"],
  },
];

export const SKILLS = [
  "TypeScript",
  "React",
  "Python",
  "Node.js",
  "Git",
  "Japanese",
] as const;

export const BIO =
  "Software engineer building playful, interactive web experiences. Interested in language tools, creative UI, and thoughtful front-end craft.";
