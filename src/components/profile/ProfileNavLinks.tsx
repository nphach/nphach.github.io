import { PROFILE_LINKS } from "../../content";
import { isExternalLink } from "../../lib/links";
import { PixelIcon } from "../../pixel-icons";

type ProfileNavLinksProps = {
  itemClassName: string;
};

export function ProfileNavLinks({ itemClassName }: ProfileNavLinksProps) {
  return PROFILE_LINKS.map(({ href, icon, label }) => {
    const external = isExternalLink(href);

    return (
      <a
        key={label}
        aria-label={label}
        className={itemClassName}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        <PixelIcon name={icon} />
      </a>
    );
  });
}
