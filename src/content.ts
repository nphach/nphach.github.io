export type ProfileLink = {
  href: string;
  icon: "github" | "linkedin" | "email";
  label: string;
};

export type ProjectLink = {
  href: string;
  label: string;
};

export type ProjectIconName =
  | "kotoba-tag"
  | "jp-parallel-gloss"
  | "portfolio"
  | "kaomoji-board";

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
    meta: "japanese vocab · arcade pace",
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
    name: "jp-parallel-gloss",
    description:
      "Sentence-transformer for Japanese–English gloss similarity. Fine-tuned on 4M+ JMDict pairs and served from Hugging Face for Kotoba Tag.",
    meta: "gloss similarity · embeddings",
    icon: "jp-parallel-gloss",
    kind: "model",
    status: "live",
    year: "2025",
    links: [
      {
        href: "https://huggingface.co/nphach/jp-parallel-gloss",
        label: "Hugging Face",
      },
    ],
    tags: ["Python", "PyTorch", "sentence-transformers", "Hugging Face"],
  },
  {
    name: "nphach.github.io",
    description:
      "[This] Tamagotchi-inspired portfolio with zoom transitions and an LCD drawing layer.",
    meta: "tamagotchi UI · lcd canvas",
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
  {
    name: "Kaomoji Board",
    description:
      "Custom iOS keyboard that drops Japanese emoticons into any text field. Mood categories, recents, search, and a companion library with backups.",
    meta: "mobile app · keyboard integration",
    icon: "kaomoji-board",
    kind: "iOS app",
    status: "wip",
    year: "2026",
    links: [],
    tags: ["SwiftUI", "SwiftData", "iOS"],
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
