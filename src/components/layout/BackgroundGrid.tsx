import { GRID_COLUMNS } from "../../constants/grid";
import { colorize, getGridBlockSize, isGridBlockInteractive } from "../../lib/grid";
import type { DeviceMetrics } from "../../types/device";

type BackgroundGridProps = {
  metrics: DeviceMetrics;
  rowIndexes: number[];
  viewportWidth: number;
};

export function BackgroundGrid({
  metrics,
  rowIndexes,
  viewportWidth,
}: BackgroundGridProps) {
  const gridBlockSize = getGridBlockSize(viewportWidth);

  return (
    <div className="grid">
      {GRID_COLUMNS.map((index) => (
        <div key={index} className="column">
          {rowIndexes.map((rowIndex) => {
            const interactive = isGridBlockInteractive(
              metrics,
              index,
              rowIndex,
              gridBlockSize,
            );

            return (
              <div
                key={rowIndex}
                className="block"
                onPointerEnter={(event) => colorize(event.currentTarget)}
                style={{
                  pointerEvents: interactive ? "auto" : "none",
                  visibility: interactive ? "visible" : "hidden",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
