import globeSolidSvg from "@hackernoon/pixel-icon-library/icons/SVG/solid/globe-solid.svg?raw";
import translateSolidSvg from "@hackernoon/pixel-icon-library/icons/SVG/solid/translate-solid.svg?raw";
import type { ProjectIconName } from "./content";

const PROJECT_ICONS = {
  "kotoba-tag": translateSolidSvg,
  portfolio: globeSolidSvg,
} as const;

const withCurrentColor = (svg: string) =>
  svg.replace(
    "<svg ",
    '<svg class="projectIconSvg" fill="currentColor" shape-rendering="crispEdges" ',
  );

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
