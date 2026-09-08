import type { RefObject } from "react";
import { ProfileNavLinks } from "../profile/ProfileNavLinks";
import { EXPANDED_SECTIONS } from "../../constants/motion";
import { PixelIcon } from "../../pixel-icons";
import type { ExpandedSection } from "../../types/view";

type LcdNavDockProps = {
  activeSection: ExpandedSection;
  isBusy: boolean;
  lcdNavDockRef: RefObject<HTMLElement | null>;
  onBack: () => void;
  onSectionChange: (section: ExpandedSection) => void;
};

export function LcdNavDock({
  activeSection,
  isBusy,
  lcdNavDockRef,
  onBack,
  onSectionChange,
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
            <button
              key={id}
              aria-controls={`lcd-panel-${id}`}
              aria-selected={activeSection === id}
              className={`lcdSectionTab${activeSection === id ? " lcdSectionTab--active" : ""}`}
              id={`lcd-tab-${id}`}
              onClick={() => onSectionChange(id)}
              role="tab"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div aria-label="Contact links" className="lcdNavLinks">
          <ProfileNavLinks itemClassName="lcdNavItem" />
        </div>
      </div>
    </nav>
  );
}
