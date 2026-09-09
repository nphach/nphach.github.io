import { AnimatePresence, motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { REVEAL_VARIANTS } from "../../constants/motion";
import { useExpandedLayout } from "../../hooks/useExpandedLayout";
import type { ExpandedSection } from "../../types/view";
import { AboutPanel } from "../sections/AboutPanel";
import { WorkPanel } from "../sections/WorkPanel";
import { LcdNavDock } from "./LcdNavDock";

type LcdExpandedViewProps = {
  activeSection: ExpandedSection;
  contentTransition: { duration: number };
  expandedContentVisible: boolean;
  isBusy: boolean;
  onContentHidden: () => void;
  onContentShown: () => void;
  onRegisterLayout: (updateLayout: () => void) => void;
  onReturnToLanding: () => void;
  selectedProjectSlug: string | null;
  workPath: string;
  prefersReducedMotion: boolean | null;
};

export function LcdExpandedView({
  activeSection,
  contentTransition,
  expandedContentVisible,
  isBusy,
  onContentHidden,
  onContentShown,
  onRegisterLayout,
  onReturnToLanding,
  selectedProjectSlug,
  workPath,
  prefersReducedMotion,
}: LcdExpandedViewProps) {
  const {
    lcdBodyRef,
    lcdExpandedRef,
    lcdNavDockRef,
    lcdScrollRef,
    scrollFadeVisible,
    updateExpandedLayout,
  } = useExpandedLayout({ activeSection, expandedContentVisible });

  useEffect(() => {
    onRegisterLayout(updateExpandedLayout);
  }, [onRegisterLayout, updateExpandedLayout]);

  const revealTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      };

  let panelContent: ReactNode;
  if (activeSection === "about") {
    panelContent = <AboutPanel />;
  } else {
    panelContent = <WorkPanel selectedSlug={selectedProjectSlug} />;
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={onContentHidden}>
      {expandedContentVisible && (
        <motion.div
          key="expanded-content"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onAnimationComplete={onContentShown}
          transition={contentTransition}
        >
          <div ref={lcdExpandedRef} className="lcdExpanded">
            <div className="lcdScrollShell">
              <div ref={lcdScrollRef} className="lcdScroll">
                <div ref={lcdBodyRef} className="lcdBody">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      animate="visible"
                      aria-labelledby={`lcd-tab-${activeSection}`}
                      className="lcdSectionPanel"
                      id={`lcd-panel-${activeSection}`}
                      initial={prefersReducedMotion ? false : "hidden"}
                      role="tabpanel"
                      transition={revealTransition}
                      variants={REVEAL_VARIANTS}
                    >
                      {panelContent}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className={`lcdScrollFade${scrollFadeVisible ? " lcdScrollFade--visible" : ""}`}
            />

            <LcdNavDock
              activeSection={activeSection}
              isBusy={isBusy}
              lcdNavDockRef={lcdNavDockRef}
              onBack={onReturnToLanding}
              workPath={workPath}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
