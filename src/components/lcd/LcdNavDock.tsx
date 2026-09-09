import type { RefObject } from "react";
import { Link } from "react-router";
import { ProfileNavLinks } from "../profile/ProfileNavLinks";
import { EXPANDED_SECTIONS } from "../../constants/motion";
import { getSectionPath } from "../../lib/portfolio-route";
import { PixelIcon } from "../../pixel-icons";
import type { ExpandedSection } from "../../types/view";

type LcdNavDockProps = {
  activeSection: ExpandedSection;
  isBusy: boolean;
  lcdNavDockRef: RefObject<HTMLElement | null>;
  onBack: () => void;
  workPath: string;
};

export function LcdNavDock({
  activeSection,
  isBusy,
  lcdNavDockRef,
  onBack,
  workPath,
}: LcdNavDockProps) {
  return (
    <nav
      ref={lcdNavDockRef}
      aria-label="Page navigation"
      className="lcdNavDock"
    >
      <div className="lcdNavPill">
        <button
          aria-label="Back"
          className="lcdNavItem lcdNavItem--back"
          disabled={isBusy}
          onClick={onBack}
          type="button"
        >
          <PixelIcon name="back" />
        </button>
        <div aria-label="Sections" className="lcdSectionTabs" role="tablist">
          {EXPANDED_SECTIONS.map(({ id, label }) => (
            <Link
              key={id}
              aria-controls={`lcd-panel-${id}`}
              aria-selected={activeSection === id}
              className={`lcdSectionTab${activeSection === id ? " lcdSectionTab--active" : ""}`}
              id={`lcd-tab-${id}`}
              onClick={(event) => {
                if (isBusy) {
                  event.preventDefault();
                }
              }}
              role="tab"
              to={getSectionPath(id, workPath)}
            >
              {label}
            </Link>
          ))}
        </div>
        <div aria-label="Contact links" className="lcdNavLinks">
          <ProfileNavLinks itemClassName="lcdNavItem" />
        </div>
      </div>
    </nav>
  );
}
