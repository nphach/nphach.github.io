import { AnimatePresence, motion } from "motion/react";
import { BUTTON_ART_SOURCES } from "../../constants/device";
import type { DeviceMetrics } from "../../types/device";
import type { View } from "../../types/view";
import { PhysicalButtons } from "./PhysicalButtons";

type TamagotchiDeviceProps = {
  contentTransition: { duration: number };
  deviceOpacity: number;
  deviceTransition: { duration: number } | { opacity: object };
  isExpanded: boolean;
  landingContentVisible: boolean;
  metrics: DeviceMetrics;
  view: View;
};

export function TamagotchiDevice({
  contentTransition,
  deviceOpacity,
  deviceTransition,
  isExpanded,
  landingContentVisible,
  metrics,
  view,
}: TamagotchiDeviceProps) {
  return (
    <motion.div
      className="device"
      style={{
        ["--device-height" as string]: `${metrics.deviceHeight}px`,
        ["--device-width" as string]: `${metrics.deviceWidth}px`,
        height: metrics.deviceHeight,
        width: metrics.deviceWidth,
      }}
    >
      <div aria-hidden="true" className="lcdScreenBezel" />

      <motion.div
        animate={{ opacity: deviceOpacity }}
        className="deviceShell"
        transition={deviceTransition}
      >
        <img className="deviceBase" src="/assets/base/base.svg" alt="" />
        {BUTTON_ART_SOURCES.map((name) => (
          <img
            key={name}
            className="buttonArt"
            src={`/assets/base/${name}.svg`}
            alt=""
            aria-hidden="true"
          />
        ))}

        <img
          className="deviceHeader"
          src="/assets/base/header.svg"
          alt="nikkiphach"
        />

        {view === "landing" && <PhysicalButtons />}

        <div aria-hidden="true" className="lcdScreenViewport">
          <AnimatePresence mode="wait">
            {landingContentVisible && !isExpanded && (
              <motion.div
                key="landing-ui"
                animate={{ opacity: 1 }}
                className="lcdLanding"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={contentTransition}
              >
                <span className="lcdEnterLabel">enter ›</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
