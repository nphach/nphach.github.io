export type LcdPoint = {
  x: number;
  y: number;
};

export type LcdPixel = LcdPoint & {
  updatedAt: number;
};

export type LcdDrawing = {
  columns: number;
  context: CanvasRenderingContext2D;
  gridOffsetX: number;
  gridOffsetY: number;
  height: number;
  pixelGap: number;
  pixelSize: number;
  rows: number;
  width: number;
};

export type MutableRef<T> = {
  current: T;
};
