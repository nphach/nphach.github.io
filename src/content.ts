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
  meta: string;
  icon: ProjectIconName;
  kind: string;
  status: ProjectStatus;
  year: string;
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
      "Shiritori-style Japanese vocab game. Translate fast, chain words, beat the clock and test your vocabulary.",
    meta: "japanese vocab · arcade pace · machine learning",
    icon: "kotoba-tag",
    kind: "game",
    status: "live",
    year: "2025",
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
    tags: ["TypeScript", "shadcn/ui", "XState", "Vitest"],
  },
  {
    name: "nphach.github.io",
    description:
      "[This] Tamagotchi-inspired portfolio with zoom transitions and an LCD drawing layer.",
    meta: "tamagotchi UI · lcd canvas · github pages",
    icon: "portfolio",
    kind: "portfolio",
    status: "live",
    year: "2026",
    links: [
      {
        href: "https://github.com/nphach/nphach.github.io",
        label: "GitHub",
      },
    ],
    tags: ["TypeScript", "React", "Motion", "CSS", "Github Pages"],
  },
];

export const SKILLS = [
  "BSc in Computer Science",
  "TypeScript",
  "React",
  "Python",
  "Git",
  "HTML/ CSS",
  "REST APIs",
  "SQL",
] as const;

export type PlayerStat = {
  label: string;
  value: string;
};

export const PLAYER_STATS: PlayerStat[] = [
  { label: "type", value: "engineer" },
  { label: "focus", value: "front-end" },
  { label: "region", value: "las vegas" },
];

export type PlayerMood = {
  label: string;
  level: number;
};

export const PLAYER_MOODS: PlayerMood[] = [
  { label: "craft", level: 8 },
  { label: "curiosity", level: 9 },
  { label: "play", level: 7 },
];

export const CURRENT_QUEST =
  "building and deploying tools at Konami Gaming; pursuing a Master's in Software Engineering for AI at Boston Univeristy";

export const BIO =
  "Software engineer building playful, interactive web experiences. Interested in language tools, creative UI, and thoughtful AI integrations.";
