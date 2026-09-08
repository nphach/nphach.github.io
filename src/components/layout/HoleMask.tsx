import type { DeviceMetrics } from "../../types/device";

type HoleMaskProps = {
  metrics: DeviceMetrics;
  viewportHeight: number;
};

export function HoleMask({ metrics, viewportHeight }: HoleMaskProps) {
  const holeBottom = metrics.holeTop + metrics.screenHeight;
  const holeRight = metrics.holeLeft + metrics.screenWidth;

  return (
    <>
      <div
        className="foregroundSurface"
        style={{ height: metrics.holeTop, left: 0, right: 0, top: 0 }}
      />
      <div
        className="foregroundSurface"
        style={{
          height: viewportHeight - holeBottom,
          left: 0,
          right: 0,
          top: holeBottom,
        }}
      />
      <div
        className="foregroundSurface"
        style={{
          height: metrics.screenHeight,
          left: 0,
          top: metrics.holeTop,
          width: metrics.holeLeft,
        }}
      />
      <div
        className="foregroundSurface"
        style={{
          height: metrics.screenHeight,
          left: holeRight,
          right: 0,
          top: metrics.holeTop,
        }}
      />

      <div className="clickBlockers" aria-hidden="true">
        <div
          className="clickBlocker"
          style={{ height: metrics.holeTop, left: 0, right: 0, top: 0 }}
        />
        <div
          className="clickBlocker"
          style={{
            height: viewportHeight - holeBottom,
            left: 0,
            right: 0,
            top: holeBottom,
          }}
        />
        <div
          className="clickBlocker"
          style={{
            height: metrics.screenHeight,
            left: 0,
            top: metrics.holeTop,
            width: metrics.holeLeft,
          }}
        />
        <div
          className="clickBlocker"
          style={{
            height: metrics.screenHeight,
            left: holeRight,
            right: 0,
            top: metrics.holeTop,
          }}
        />
      </div>
    </>
  );
}
