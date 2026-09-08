import { PROFILE_LINKS } from "../../content";
import { isExternalLink } from "../../lib/links";
import { PixelIcon } from "../../pixel-icons";

export const PHYSICAL_BUTTONS = [
  {
    className: "physicalButton--left",
    ...PROFILE_LINKS[0],
  },
  {
    className: "physicalButton--middle",
    ...PROFILE_LINKS[1],
  },
  {
    className: "physicalButton--right",
    ...PROFILE_LINKS[2],
  },
] as const;

export function PhysicalButtons() {
  return (
    <div className="physicalButtons" aria-label="Profile links">
      {PHYSICAL_BUTTONS.map(({ className, href, icon, label }) => {
        const external = isExternalLink(href);

        return (
          <a
            key={label}
            aria-label={label}
            className={`physicalButton ${className}`}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            <span className="physicalButtonIcon" aria-hidden="true">
              <PixelIcon name={icon} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
