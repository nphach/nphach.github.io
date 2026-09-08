import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { DeviceMetrics } from "../../types/device";
import { BackgroundGrid } from "./BackgroundGrid";
import { HoleMask } from "./HoleMask";

type ForegroundLayerProps = {
  children: ReactNode;
  contentTransition: { duration: number };
  foregroundOpacity: number;
  foregroundScale: number;
  isBusy: boolean;
  isExpanded: boolean;
  metrics: DeviceMetrics;
  onZoomComplete: () => void;
  rowIndexes: number[];
  transformOrigin: string;
  viewportHeight: number;
  viewportWidth: number;
  zoomTransition: { duration: number };
};

export function ForegroundLayer({
  children,
  contentTransition,
  foregroundOpacity,
  foregroundScale,
  isBusy,
  isExpanded,
  metrics,
  onZoomComplete,
  rowIndexes,
  transformOrigin,
  viewportHeight,
  viewportWidth,
  zoomTransition,
}: ForegroundLayerProps) {
  return (
    <motion.div
      animate={{
        opacity: foregroundOpacity,
        scale: foregroundScale,
      }}
      className={`foregroundLayer${isExpanded && !isBusy ? " foregroundLayer--inactive" : ""}`}
      inert={isExpanded ? true : undefined}
      onAnimationComplete={onZoomComplete}
      style={{
        transformOrigin,
        willChange: "transform, opacity",
      }}
      transition={{
        opacity: contentTransition,
        scale: zoomTransition,
      }}
    >
      <HoleMask metrics={metrics} viewportHeight={viewportHeight} />
      <BackgroundGrid
        metrics={metrics}
        rowIndexes={rowIndexes}
        viewportWidth={viewportWidth}
      />
      {children}
    </motion.div>
  );
}
