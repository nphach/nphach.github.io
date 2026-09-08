import { MOOD_BAR_SEGMENTS } from "../constants/inventory";

export const renderMoodBar = (
  level: number,
  segments = MOOD_BAR_SEGMENTS,
) => {
  const filled = Math.min(Math.max(Math.round(level), 0), segments);

  return `${"▓".repeat(filled)}${"░".repeat(segments - filled)}`;
};
