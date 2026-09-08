import gamingSvg from "@hackernoon/pixel-icon-library/icons/SVG/purcats/gaming.svg?raw";
import faceGrinSolidSvg from "@hackernoon/pixel-icon-library/icons/SVG/solid/face-grin-solid.svg?raw";
import globeSolidSvg from "@hackernoon/pixel-icon-library/icons/SVG/solid/globe-solid.svg?raw";
import questionSolidSvg from "@hackernoon/pixel-icon-library/icons/SVG/solid/question-solid.svg?raw";
import translateSolidSvg from "@hackernoon/pixel-icon-library/icons/SVG/solid/translate-solid.svg?raw";
import type { ProjectIconName } from "./content";

const PROJECT_ICONS = {
  "kotoba-tag": gamingSvg,
  "jp-parallel-gloss": translateSolidSvg,
  portfolio: globeSolidSvg,
  "kaomoji-board": faceGrinSolidSvg,
} as const;

const withCurrentColor = (svg: string) =>
  svg
    .replace(
      "<svg ",
      '<svg class="projectIconSvg" fill="currentColor" shape-rendering="crispEdges" ',
    )
    .replaceAll('fill="black"', 'fill="currentColor"');

type ProjectIconProps = {
  name: ProjectIconName;
};

export function ProjectIcon({ name }: ProjectIconProps) {
  return (
    <span
      aria-hidden="true"
      className="projectIcon"
      dangerouslySetInnerHTML={{
        __html: withCurrentColor(PROJECT_ICONS[name]),
      }}
    />
  );
}

export function EmptyInventorySlotIcon() {
  return (
    <span
      aria-hidden="true"
      className="projectIcon projectIcon--empty"
      dangerouslySetInnerHTML={{
        __html: withCurrentColor(questionSolidSvg),
      }}
    />
  );
}
