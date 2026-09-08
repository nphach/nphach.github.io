import { GRID_COLOR } from "../constants/grid";
import {
  LCD_TRAIL_FADE_MS,
  LCD_TRAIL_HOLD_MS,
  LCD_TRAIL_OPACITY,
} from "../constants/lcd";
import type { LcdDrawing, LcdPixel, LcdPoint, MutableRef } from "../types/lcd";

export const getLcdPixelOpacity = (age: number) => {
  if (age <= LCD_TRAIL_HOLD_MS) {
    return LCD_TRAIL_OPACITY;
  }

  const fadeProgress = Math.min(
    (age - LCD_TRAIL_HOLD_MS) / LCD_TRAIL_FADE_MS,
    1,
  );
  const easedProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);

  return LCD_TRAIL_OPACITY * (1 - easedProgress);
};

export const drawLcdTrailFrame = (
  lcdAnimationRef: MutableRef<number | null>,
  lcdDrawingRef: MutableRef<LcdDrawing | null>,
  lcdPixelsRef: MutableRef<Map<string, LcdPixel>>,
  updateLcdMetrics: () => LcdDrawing | null,
) => {
  const drawing = lcdDrawingRef.current ?? updateLcdMetrics();

  if (!drawing) {
    lcdAnimationRef.current = null;
    return;
  }

  const { context, height, pixelGap, pixelSize, width } = drawing;
  let hasVisiblePixels = false;
  const now = performance.now();

  context.clearRect(0, 0, width, height);

  for (const [key, pixel] of lcdPixelsRef.current) {
    const age = now - pixel.updatedAt;
    const opacity = getLcdPixelOpacity(age);

    if (opacity <= 0) {
      lcdPixelsRef.current.delete(key);
      continue;
    }

    hasVisiblePixels = true;
    context.fillStyle = `rgba(${GRID_COLOR}, ${opacity})`;
    context.fillRect(
      pixel.x,
      pixel.y,
      pixelSize - pixelGap,
      pixelSize - pixelGap,
    );
  }

  lcdAnimationRef.current = hasVisiblePixels
    ? window.requestAnimationFrame(() =>
        drawLcdTrailFrame(
          lcdAnimationRef,
          lcdDrawingRef,
          lcdPixelsRef,
          updateLcdMetrics,
        ),
      )
    : null;
};

export const addLcdPixel = (
  pixelsRef: MutableRef<Map<string, LcdPixel>>,
  { x, y }: LcdPoint,
  updatedAt: number,
  drawing: LcdDrawing,
) => {
  const { columns, gridOffsetX, gridOffsetY, pixelSize, rows } = drawing;
  const localX = x - gridOffsetX;
  const localY = y - gridOffsetY;

  if (localX < 0 || localY < 0) {
    return;
  }

  const column = Math.floor(localX / pixelSize);
  const row = Math.floor(localY / pixelSize);

  if (column >= columns || row >= rows) {
    return;
  }

  const pixelX = gridOffsetX + column * pixelSize;
  const pixelY = gridOffsetY + row * pixelSize;
  const key = `${column}:${row}`;

  pixelsRef.current.set(key, {
    updatedAt,
    x: pixelX,
    y: pixelY,
  });
};

export const addLcdTrail = (
  pixelsRef: MutableRef<Map<string, LcdPixel>>,
  from: LcdPoint,
  to: LcdPoint,
  updatedAt: number,
  drawing: LcdDrawing,
) => {
  const { pixelSize } = drawing;
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.ceil(distance / pixelSize));

  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;

    addLcdPixel(
      pixelsRef,
      {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      },
      updatedAt,
      drawing,
    );
  }
};
