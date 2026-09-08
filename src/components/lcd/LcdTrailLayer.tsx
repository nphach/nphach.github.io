import type { ReactNode, RefObject } from "react";

type LcdTrailLayerProps = {
  children: ReactNode;
  lcdCanvasRef: RefObject<HTMLCanvasElement | null>;
  lcdLayerRef: RefObject<HTMLDivElement | null>;
  onPointerLeave: () => void;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
};

export function LcdTrailLayer({
  children,
  lcdCanvasRef,
  lcdLayerRef,
  onPointerLeave,
  onPointerMove,
}: LcdTrailLayerProps) {
  return (
    <div
      ref={lcdLayerRef}
      className="lcdLayer"
      onPointerLeave={onPointerLeave}
      onPointerMoveCapture={onPointerMove}
    >
      <canvas ref={lcdCanvasRef} className="lcdTrail" aria-hidden="true" />
      {children}
    </div>
  );
}
