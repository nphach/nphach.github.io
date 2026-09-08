import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import {
  LCD_COLUMN_COUNT,
  LCD_PIXEL_GAP_RATIO,
  LCD_ROW_COUNT,
} from "../constants/lcd";
import { getDeviceMetrics } from "../lib/device-metrics";
import {
  addLcdTrail,
  drawLcdTrailFrame,
} from "../lib/lcd-trail";
import type { LcdDrawing, LcdPixel, LcdPoint } from "../types/lcd";
import type { View } from "../types/view";

type UseLcdTrailOptions = {
  view: View;
  isBusy: boolean;
};

export function useLcdTrail({ view, isBusy }: UseLcdTrailOptions) {
  const lcdAnimationRef = useRef<number | null>(null);
  const lcdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lcdDrawingRef = useRef<LcdDrawing | null>(null);
  const lcdLayerRef = useRef<HTMLDivElement | null>(null);
  const lcdPixelsRef = useRef(new Map<string, LcdPixel>());
  const lcdPreviousPointRef = useRef<LcdPoint | null>(null);
  const viewRef = useRef<View>(view);

  const updateLcdMetrics = useCallback(() => {
    const canvas = lcdCanvasRef.current;
    const layer = lcdLayerRef.current;

    if (!canvas || !layer) {
      lcdDrawingRef.current = null;
      return null;
    }

    const context = canvas.getContext("2d");
    const rect = layer.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * pixelRatio);
    const height = Math.round(rect.height * pixelRatio);

    if (!context || width === 0 || height === 0) {
      lcdDrawingRef.current = null;
      return null;
    }

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const expanded = viewRef.current === "expanded";
    const columns = LCD_COLUMN_COUNT;
    let rows = LCD_ROW_COUNT;
    let pixelSize: number;
    let gridOffsetX: number;
    let gridOffsetY: number;

    if (expanded) {
      pixelSize = rect.width / LCD_COLUMN_COUNT;
      gridOffsetX = 0;
      rows = Math.max(1, Math.floor(rect.height / pixelSize));
      gridOffsetY = (rect.height - rows * pixelSize) / 2;
    } else {
      pixelSize = Math.min(
        rect.width / LCD_COLUMN_COUNT,
        rect.height / LCD_ROW_COUNT,
      );
      gridOffsetX = (rect.width - pixelSize * columns) / 2;
      gridOffsetY = (rect.height - pixelSize * rows) / 2;
    }

    const drawing = {
      columns,
      context,
      gridOffsetX,
      gridOffsetY,
      height: rect.height,
      pixelGap: pixelSize * LCD_PIXEL_GAP_RATIO,
      pixelSize,
      rows,
      width: rect.width,
    };

    lcdDrawingRef.current = drawing;
    return drawing;
  }, []);

  useEffect(() => {
    viewRef.current = view;
    updateLcdMetrics();
    lcdPixelsRef.current.clear();
  }, [view, updateLcdMetrics]);

  useEffect(() => {
    const onResize = () => {
      updateLcdMetrics();
    };
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateLcdMetrics);

    updateLcdMetrics();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);

    if (lcdLayerRef.current) {
      resizeObserver?.observe(lcdLayerRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
      resizeObserver?.disconnect();

      if (lcdAnimationRef.current !== null) {
        window.cancelAnimationFrame(lcdAnimationRef.current);
      }
    };
  }, [updateLcdMetrics]);

  const queueLcdTrailRender = useCallback(() => {
    if (lcdAnimationRef.current === null) {
      lcdAnimationRef.current = window.requestAnimationFrame(() =>
        drawLcdTrailFrame(
          lcdAnimationRef,
          lcdDrawingRef,
          lcdPixelsRef,
          updateLcdMetrics,
        ),
      );
    }
  }, [updateLcdMetrics]);

  const isPointInActiveLcd = (clientX: number, clientY: number) => {
    if (viewRef.current === "expanded") {
      return true;
    }

    const { holeLeft, holeTop, screenHeight, screenWidth } = getDeviceMetrics(
      window.visualViewport?.width ?? window.innerWidth,
      window.visualViewport?.height ?? window.innerHeight,
    );

    return (
      clientX >= holeLeft &&
      clientX <= holeLeft + screenWidth &&
      clientY >= holeTop &&
      clientY <= holeTop + screenHeight
    );
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isBusy || !isPointInActiveLcd(event.clientX, event.clientY)) {
      return;
    }

    const drawing = lcdDrawingRef.current ?? updateLcdMetrics();
    const layer = lcdLayerRef.current;

    if (!layer || !drawing) {
      return;
    }

    const rect = layer.getBoundingClientRect();
    const currentPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const previousPoint = lcdPreviousPointRef.current ?? currentPoint;
    const updatedAt = performance.now();

    addLcdTrail(
      lcdPixelsRef,
      previousPoint,
      currentPoint,
      updatedAt,
      drawing,
    );
    lcdPreviousPointRef.current = currentPoint;
    queueLcdTrailRender();
  };

  const handlePointerLeave = () => {
    lcdPreviousPointRef.current = null;
  };

  return {
    lcdCanvasRef,
    lcdLayerRef,
    handlePointerLeave,
    handlePointerMove,
  };
}
