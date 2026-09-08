import arrowLeftSvg from "@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-left.svg?raw";
import envelopeSvg from "@hackernoon/pixel-icon-library/icons/SVG/regular/envelope.svg?raw";
import githubSvg from "@hackernoon/pixel-icon-library/icons/SVG/brands/github.svg?raw";
import linkedinSvg from "@hackernoon/pixel-icon-library/icons/SVG/brands/linkedin.svg?raw";

const PIXEL_ICONS = {
  back: arrowLeftSvg,
  email: envelopeSvg,
  github: githubSvg,
  linkedin: linkedinSvg,
} as const;

export type PixelIconName = keyof typeof PIXEL_ICONS;

const withCurrentColor = (svg: string) =>
  svg.replace(
    "<svg ",
    '<svg class="pixelIconSvg" fill="currentColor" shape-rendering="crispEdges" ',
  );

export function PixelIcon({ name }: { name: PixelIconName }) {
  return (
    <span
      aria-hidden="true"
      className="pixelIcon"
      dangerouslySetInnerHTML={{ __html: withCurrentColor(PIXEL_ICONS[name]) }}
    />
  );
}
