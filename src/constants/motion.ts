import type { ExpandedSection } from "../types/view";

export const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const CONTENT_TRANSITION = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const ZOOM_TRANSITION = {
  duration: 0.88,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export const DEVICE_FADE = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const EXPANDED_SECTIONS: { id: ExpandedSection; label: string }[] = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
];
