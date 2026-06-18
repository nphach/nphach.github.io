import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import "./App.css";

const GRID_BLOCK_SIZE_RATIO = 0.05;
const GRID_COLOR = "38, 48, 34";
const LCD_COLUMN_COUNT = 32;
const LCD_ROW_COUNT = 30;
const LCD_PIXEL_GAP_RATIO = 1 / 6;
const LCD_TRAIL_FADE_MS = 720;
const LCD_TRAIL_HOLD_MS = 80;
const LCD_TRAIL_OPACITY = 0.78;
const GRID_COLUMN_COUNT = 20;
const DEVICE_ASPECT = 624 / 731;

const BUTTON_ART_SOURCES = ["left", "middle", "right"] as const;

const ICONS = {
  email: {
    path: "M695 1q20 0 33 13t13 33v464q0 19-13 32t-33 14H46q-19 0-32-14T0 511V47q0-19 14-33T46 1zm-53 97q2-1 2-3t-3-1H101q-2 0-3 1t1 3l259 172q13 10 25 0z",
    viewBox: "0 0 750 750",
  },
  github: {
    path: "M510 383q23 0 39 21t15 53t-15 52t-39 22t-38-22t-16-52t16-53t38-21m186-193q29 31 46 69t16 90q0 74-18 125t-48 84t-64 52t-70 28t-64 10l-44 2H308q-15 0-44-2t-63-10t-70-28t-65-52t-47-84T0 349q0-51 17-90t45-69q-3-6-3-24t1-42t9-56T88 8q22 3 51 14q25 9 59 25t77 46q18-5 46-8t58-2l58 2q28 1 46 8q42-29 77-46t59-25q29-11 51-14q12 30 19 60t9 56t2 42t-4 24M380 614q58 0 109-6t88-23t59-51t21-90q0-27-10-52t-33-45q-19-18-44-24t-56-5t-64 4t-70 3h-2q-36 0-70-3t-64-4t-55 5t-44 24q-23 20-33 45t-11 52q0 57 22 90t58 51t88 23t109 6zM248 383q23 0 39 21t15 53t-15 52t-39 22t-38-22t-16-52t16-53t38-21",
    viewBox: "0 0 760 800",
  },
  linkedin: {
    path: "M165 90q0 35-21 59t-62 24q-37 0-59-24T0 95q0-35 23-61T83 8t60 24t22 58M0 750h165V214H0zm560-528q-32 0-57 8t-45 21t-33 27t-21 27h-4l-9-70H243q0 34 2 74t2 86v355h165V457q0-12 1-22t3-19q4-11 11-23t16-21t22-16t29-6q44 0 64 32t19 83v285h165V445q0-57-14-99t-38-70t-58-41t-72-13",
    viewBox: "0 0 750 850",
  },
} as const;

const PHYSICAL_BUTTONS = [
  {
    className: "physicalButton--left",
    href: "https://github.com/nphach/",
    icon: "github",
    label: "GitHub",
  },
  {
    className: "physicalButton--middle",
    href: "https://www.linkedin.com/in/nphach/",
    icon: "linkedin",
    label: "LinkedIn",
  },
  {
    className: "physicalButton--right",
    href: "mailto:nikkiphach@gmail.com",
    icon: "email",
    label: "Email",
  },
] as const;

const FOOTER_LINKS = [
  { href: "https://github.com/nphach/", icon: "github", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/nphach/",
    icon: "linkedin",
    label: "LinkedIn",
  },
  { href: "mailto:nikkiphach@gmail.com", icon: "email", label: "Email" },
] as const;

type View = "landing" | "expanded";

type LcdPoint = {
  x: number;
  y: number;
};

type LcdPixel = LcdPoint & {
  updatedAt: number;
};

type LcdDrawing = {
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

type DeviceMetrics = {
  deviceHeight: number;
  deviceLeft: number;
  deviceTop: number;
  deviceWidth: number;
  expandedScale: number;
  holeCenterX: number;
  holeCenterY: number;
  holeLeft: number;
  holeRadius: number;
  holeTop: number;
  screenHeight: number;
  screenWidth: number;
  zoomOriginX: number;
  zoomOriginY: number;
};

type MutableRef<T> = {
  current: T;
};

type ProfileIconName = keyof typeof ICONS;

const GRID_COLUMNS = Array.from(
  { length: GRID_COLUMN_COUNT },
  (_, index) => index,
);

const getViewportSize = () => ({
  height: window.visualViewport?.height ?? window.innerHeight,
  width: window.visualViewport?.width ?? window.innerWidth,
});

const getGridBlockSize = (viewportWidth: number) =>
  Math.max(viewportWidth * GRID_BLOCK_SIZE_RATIO, 1);

const getZoomOrigin = (
  viewportSize: number,
  holeNearEdge: number,
  holeSize: number,
) => (viewportSize * holeNearEdge) / (viewportSize - holeSize);

const getExpandedScale = (
  viewportWidth: number,
  viewportHeight: number,
  holeLeft: number,
  holeTop: number,
  screenWidth: number,
  screenHeight: number,
  zoomOriginX: number,
  zoomOriginY: number,
) => {
  const holeRight = holeLeft + screenWidth;
  const holeBottom = holeTop + screenHeight;
  const scaleX = Math.max(
    zoomOriginX / (zoomOriginX - holeLeft),
    (viewportWidth - zoomOriginX) / (holeRight - zoomOriginX),
  );
  const scaleY = Math.max(
    zoomOriginY / (zoomOriginY - holeTop),
    (viewportHeight - zoomOriginY) / (holeBottom - zoomOriginY),
  );

  return Math.max(scaleX, scaleY) * 1.04;
};

const getDeviceMetrics = (
  viewportWidth: number,
  viewportHeight: number,
): DeviceMetrics => {
  const deviceWidth = Math.min(
    680,
    viewportWidth * 0.94,
    viewportHeight * 0.94 * DEVICE_ASPECT,
  );
  const deviceHeight = deviceWidth / DEVICE_ASPECT;
  const screenX = deviceWidth * (190 / 624);
  const screenY = deviceWidth * (265 / 624);
  const screenWidth = deviceWidth * (265 / 624);
  const screenHeight = deviceWidth * (250 / 624);
  const deviceLeft = (viewportWidth - deviceWidth) / 2;
  const deviceTop = (viewportHeight - deviceHeight) / 2;
  const holeLeft = deviceLeft + screenX;
  const holeTop = deviceTop + screenY;
  const zoomOriginX = getZoomOrigin(viewportWidth, holeLeft, screenWidth);
  const zoomOriginY = getZoomOrigin(viewportHeight, holeTop, screenHeight);

  return {
    deviceHeight,
    deviceLeft,
    deviceTop,
    deviceWidth,
    expandedScale: getExpandedScale(
      viewportWidth,
      viewportHeight,
      holeLeft,
      holeTop,
      screenWidth,
      screenHeight,
      zoomOriginX,
      zoomOriginY,
    ),
    holeCenterX: holeLeft + screenWidth / 2,
    holeCenterY: holeTop + screenHeight / 2,
    holeLeft,
    holeRadius: deviceWidth * (10 / 624),
    holeTop,
    screenHeight,
    screenWidth,
    zoomOriginX,
    zoomOriginY,
  };
};

const isExternalLink = (href: string) => !href.startsWith("mailto:");

const colorize = (el: HTMLDivElement) => {
  el.style.backgroundColor = `rgb(${GRID_COLOR})`;

  window.setTimeout(() => {
    el.style.backgroundColor = "transparent";
  }, 300);
};

const ProfileIcon = ({ name }: { name: ProfileIconName }) => {
  const icon = ICONS[name];

  return (
    <svg viewBox={icon.viewBox} aria-hidden="true">
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
};

const getLcdPixelOpacity = (age: number) => {
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

const drawLcdTrailFrame = (
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

const CONTENT_TRANSITION = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

const ZOOM_TRANSITION = {
  duration: 0.88,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

const DEVICE_FADE = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [view, setView] = useState<View>("landing");
  const [zoomExpanded, setZoomExpanded] = useState(false);
  const [landingContentVisible, setLandingContentVisible] = useState(true);
  const [expandedContentVisible, setExpandedContentVisible] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [viewportSize, setViewportSize] = useState(getViewportSize);
  const lcdAnimationRef = useRef<number | null>(null);
  const lcdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lcdDrawingRef = useRef<LcdDrawing | null>(null);
  const lcdLayerRef = useRef<HTMLDivElement | null>(null);
  const lcdPixelsRef = useRef(new Map<string, LcdPixel>());
  const lcdPreviousPointRef = useRef<LcdPoint | null>(null);
  const pendingPhaseRef = useRef<
    "await-content-in" | "await-content-out" | null
  >(null);
  const viewRef = useRef<View>("landing");

  const metrics = useMemo(
    () => getDeviceMetrics(viewportSize.width, viewportSize.height),
    [viewportSize],
  );

  const isExpanded = view === "expanded";
  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : CONTENT_TRANSITION;
  const zoomTransition = prefersReducedMotion
    ? { duration: 0 }
    : ZOOM_TRANSITION;
  const blockRows = useMemo(() => {
    const blockSize = getGridBlockSize(viewportSize.width);

    return Math.ceil(viewportSize.height / blockSize);
  }, [viewportSize]);

  const rowIndexes = useMemo(
    () => Array.from({ length: blockRows }, (_, index) => index),
    [blockRows],
  );

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

    const pixelSize = Math.min(
      rect.width / LCD_COLUMN_COUNT,
      rect.height / LCD_ROW_COUNT,
    );
    const gridOffsetX = (rect.width - pixelSize * LCD_COLUMN_COUNT) / 2;
    const gridOffsetY = (rect.height - pixelSize * LCD_ROW_COUNT) / 2;
    const drawing = {
      columns: LCD_COLUMN_COUNT,
      context,
      gridOffsetX,
      gridOffsetY,
      height: rect.height,
      pixelGap: pixelSize * LCD_PIXEL_GAP_RATIO,
      pixelSize,
      rows: LCD_ROW_COUNT,
      width: rect.width,
    };

    lcdDrawingRef.current = drawing;
    return drawing;
  }, []);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (
      !expandedContentVisible ||
      pendingPhaseRef.current !== "await-content-in"
    ) {
      return;
    }

    const delay = prefersReducedMotion ? 0 : CONTENT_TRANSITION.duration * 1000;
    const timer = window.setTimeout(() => {
      if (pendingPhaseRef.current === "await-content-in") {
        pendingPhaseRef.current = null;
        setIsBusy(false);
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [expandedContentVisible, prefersReducedMotion]);

  useEffect(() => {
    const onResize = () => {
      setViewportSize(getViewportSize());
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

  const queueLcdTrailRender = () => {
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
  };

  const addLcdPixel = (
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

    lcdPixelsRef.current.set(key, {
      updatedAt,
      x: pixelX,
      y: pixelY,
    });
  };

  const addLcdTrail = (
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
        {
          x: from.x + (to.x - from.x) * progress,
          y: from.y + (to.y - from.y) * progress,
        },
        updatedAt,
        drawing,
      );
    }
  };

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

  const handleLcdPointerMove = (event: PointerEvent<HTMLDivElement>) => {
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

    addLcdTrail(previousPoint, currentPoint, updatedAt, drawing);
    lcdPreviousPointRef.current = currentPoint;
    queueLcdTrailRender();
  };

  const handleLcdPointerLeave = () => {
    lcdPreviousPointRef.current = null;
  };

  const enterExpanded = () => {
    if (isBusy || isExpanded) {
      return;
    }

    pendingPhaseRef.current = "await-content-in";
    setIsBusy(true);
    setLandingContentVisible(false);
    setZoomExpanded(true);
  };

  const returnToLanding = () => {
    if (isBusy || !isExpanded) {
      return;
    }

    pendingPhaseRef.current = "await-content-out";
    setIsBusy(true);
    setExpandedContentVisible(false);
  };

  const handleZoomComplete = () => {
    if (zoomExpanded && view === "landing") {
      setView("expanded");
      setExpandedContentVisible(true);

      if (prefersReducedMotion) {
        pendingPhaseRef.current = null;
        setIsBusy(false);
      }

      return;
    }

    if (!zoomExpanded && view !== "landing") {
      setView("landing");
      setLandingContentVisible(true);
      pendingPhaseRef.current = null;
      setIsBusy(false);
    }
  };

  const handleExpandedContentShown = () => {
    if (pendingPhaseRef.current !== "await-content-in") {
      return;
    }

    pendingPhaseRef.current = null;
    setIsBusy(false);
  };

  const handleExpandedContentHidden = () => {
    if (pendingPhaseRef.current !== "await-content-out") {
      return;
    }

    pendingPhaseRef.current = null;
    setZoomExpanded(false);

    if (prefersReducedMotion) {
      setView("landing");
      setLandingContentVisible(true);
      setIsBusy(false);
    }
  };

  const foregroundScale = zoomExpanded ? metrics.expandedScale : 1;
  const foregroundOpacity = isBusy ? 1 : view === "expanded" ? 0 : 1;
  const deviceOpacity = isBusy && zoomExpanded ? 0 : 1;
  const deviceTransition = prefersReducedMotion ? { duration: 0 } : DEVICE_FADE;
  const transformOrigin = `${metrics.zoomOriginX}px ${metrics.zoomOriginY}px`;

  const holeBottom = metrics.holeTop + metrics.screenHeight;
  const holeRight = metrics.holeLeft + metrics.screenWidth;
  const gridBlockSize = getGridBlockSize(viewportSize.width);
  const screenX = metrics.deviceWidth * (190 / 624);
  const screenY = metrics.deviceWidth * (265 / 624);

  const isGridBlockInteractive = (columnIndex: number, rowIndex: number) => {
    const blockLeft = columnIndex * gridBlockSize;
    const blockTop = rowIndex * gridBlockSize;
    const blockRight = blockLeft + gridBlockSize;
    const blockBottom = blockTop + gridBlockSize;

    return (
      blockRight <= metrics.holeLeft ||
      blockLeft >= holeRight ||
      blockBottom <= metrics.holeTop ||
      blockTop >= holeBottom
    );
  };

  const maskStyle = {
    WebkitMaskImage: "url(#screen-hole-mask)",
    maskImage: "url(#screen-hole-mask)",
  } as const;

  const deviceMaskStyle = {
    WebkitMaskImage: "url(#device-shell-mask)",
    maskImage: "url(#device-shell-mask)",
  } as const;

  return (
    <main className="appContainer">
      <div
        ref={lcdLayerRef}
        className="lcdLayer"
        onPointerLeave={handleLcdPointerLeave}
        onPointerMove={handleLcdPointerMove}
      >
        <canvas ref={lcdCanvasRef} className="lcdTrail" aria-hidden="true" />

        <AnimatePresence mode="wait">
          {landingContentVisible && (
            <motion.div
              key="landing-ui"
              animate={{ opacity: 1 }}
              aria-hidden="true"
              className="lcdLanding"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              style={{
                height: metrics.screenHeight,
                left: metrics.holeLeft,
                top: metrics.holeTop,
                width: metrics.screenWidth,
              }}
              transition={contentTransition}
            >
              <span className="lcdEnterLabel">enter ›</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence
          mode="wait"
          onExitComplete={handleExpandedContentHidden}
        >
          {expandedContentVisible && (
            <motion.div
              key="expanded-content"
              animate={{ opacity: 1 }}
              className="lcdExpanded"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onAnimationComplete={handleExpandedContentShown}
              transition={contentTransition}
            >
              <button
                className="lcdBack"
                disabled={isBusy}
                onClick={returnToLanding}
                type="button"
              >
                ‹ back
              </button>

              <div className="lcdBody">
                <p className="lcdName">nikki phach</p>
                <p className="lcdTagline">software engineer</p>
                <p className="lcdBio">building cool things.</p>
              </div>

              <footer className="lcdFooter" aria-label="Profile links">
                {FOOTER_LINKS.map(({ href, icon, label }) => {
                  const external = isExternalLink(href);

                  return (
                    <a
                      key={label}
                      className="lcdFooterLink"
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                    >
                      <span className="lcdFooterIcon" aria-hidden="true">
                        <ProfileIcon name={icon} />
                      </span>
                      {label}
                    </a>
                  );
                })}
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={{
          opacity: foregroundOpacity,
          scale: foregroundScale,
        }}
        className="foregroundLayer"
        onAnimationComplete={handleZoomComplete}
        style={{
          transformOrigin,
          willChange: "transform, opacity",
        }}
        transition={{
          opacity: {
            duration: prefersReducedMotion ? 0 : 0.16,
            ease: "easeOut",
          },
          scale: zoomTransition,
        }}
      >
        <svg
          aria-hidden="true"
          className="maskDef"
          height={viewportSize.height}
          width={viewportSize.width}
        >
          <defs>
            <mask
              id="screen-hole-mask"
              maskContentUnits="userSpaceOnUse"
              maskUnits="userSpaceOnUse"
              height={viewportSize.height}
              width={viewportSize.width}
              x="0"
              y="0"
            >
              <rect
                fill="white"
                height={viewportSize.height}
                width={viewportSize.width}
              />
              <rect
                fill="black"
                height={metrics.screenHeight + 1}
                rx={metrics.holeRadius}
                ry={metrics.holeRadius}
                width={metrics.screenWidth + 1}
                x={metrics.holeLeft - 0.5}
                y={metrics.holeTop - 0.5}
              />
            </mask>
            <mask
              id="device-shell-mask"
              maskContentUnits="userSpaceOnUse"
              maskUnits="userSpaceOnUse"
              height={metrics.deviceHeight}
              width={metrics.deviceWidth}
              x="0"
              y="0"
            >
              <rect
                fill="white"
                height={metrics.deviceHeight}
                width={metrics.deviceWidth}
              />
              <rect
                fill="black"
                height={metrics.screenHeight}
                rx={metrics.holeRadius}
                ry={metrics.holeRadius}
                width={metrics.screenWidth}
                x={screenX}
                y={screenY}
              />
            </mask>
          </defs>
        </svg>

        <div className="foregroundSurface" style={maskStyle} />

        <div className="clickBlockers" aria-hidden="true">
          <div
            className="clickBlocker"
            style={{ height: metrics.holeTop, left: 0, right: 0, top: 0 }}
          />
          <div
            className="clickBlocker"
            style={{
              height: viewportSize.height - holeBottom,
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

        <div className="grid" style={maskStyle}>
          {GRID_COLUMNS.map((index) => (
            <div key={index} className="column">
              {rowIndexes.map((rowIndex) => (
                <div
                  key={rowIndex}
                  className="block"
                  onMouseEnter={(event) => colorize(event.currentTarget)}
                  style={{
                    pointerEvents: isGridBlockInteractive(index, rowIndex)
                      ? "auto"
                      : "none",
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {landingContentVisible && !isExpanded && (
          <button
            aria-label="enter"
            className="lcdEnterOverlay"
            disabled={isBusy}
            onClick={enterExpanded}
            style={{
              height: metrics.screenHeight,
              left: metrics.holeLeft,
              top: metrics.holeTop,
              width: metrics.screenWidth,
            }}
            type="button"
          />
        )}

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
            style={deviceMaskStyle}
            transition={{ opacity: deviceTransition }}
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

            <div className="physicalButtons" aria-label="Profile links">
              {PHYSICAL_BUTTONS.map(({ className, href, icon, label }) => {
                const external = isExternalLink(href);

                return (
                  <a
                    key={label}
                    aria-label={label}
                    className={`physicalButton ${className}`}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                  >
                    <span className="physicalButtonIcon" aria-hidden="true">
                      <ProfileIcon name={icon} />
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default App;
