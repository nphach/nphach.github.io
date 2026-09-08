import { GRID_BLOCK_SIZE_RATIO, GRID_COLOR } from "../constants/grid";
import type { DeviceMetrics } from "../types/device";

export const getGridBlockSize = (viewportWidth: number) =>
  Math.max(viewportWidth * GRID_BLOCK_SIZE_RATIO, 1);

export const colorize = (el: HTMLDivElement) => {
  el.style.backgroundColor = `rgb(${GRID_COLOR})`;

  window.setTimeout(() => {
    el.style.backgroundColor = "transparent";
  }, 300);
};

export const isGridBlockInteractive = (
  deviceMetrics: DeviceMetrics,
  columnIndex: number,
  rowIndex: number,
  gridBlockSize: number,
) => {
  const blockLeft = columnIndex * gridBlockSize;
  const blockTop = rowIndex * gridBlockSize;
  const blockRight = blockLeft + gridBlockSize;
  const blockBottom = blockTop + gridBlockSize;
  const holeRightEdge = deviceMetrics.holeLeft + deviceMetrics.screenWidth;
  const holeBottomEdge = deviceMetrics.holeTop + deviceMetrics.screenHeight;

  return (
    blockRight <= deviceMetrics.holeLeft ||
    blockLeft >= holeRightEdge ||
    blockBottom <= deviceMetrics.holeTop ||
    blockTop >= holeBottomEdge
  );
};
