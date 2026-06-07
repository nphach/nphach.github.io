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
const LCD_PIXEL_GAP_RATIO = 1 / 6;
const LCD_PIXEL_SIZE_RATIO = GRID_BLOCK_SIZE_RATIO / 4;
const LCD_TRAIL_FADE_MS = 720;
const LCD_TRAIL_HOLD_MS = 80;
const LCD_TRAIL_OPACITY = 0.78;
const GRID_COLUMN_COUNT = 20;

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

type LcdPoint = {
  x: number;
  y: number;
};

type LcdPixel = LcdPoint & {
  updatedAt: number;
};

type LcdDrawing = {
  context: CanvasRenderingContext2D;
  height: number;
  pixelGap: number;
  pixelSize: number;
  width: number;
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
  height: window.innerHeight,
  width: window.innerWidth,
});

const getGridBlockSize = (viewportWidth: number) =>
  Math.max(viewportWidth * GRID_BLOCK_SIZE_RATIO, 1);

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

function App() {
  const [viewportSize, setViewportSize] = useState(getViewportSize);
  const lcdAnimationRef = useRef<number | null>(null);
  const lcdBoundsRef = useRef<DOMRectReadOnly | null>(null);
  const lcdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lcdDrawingRef = useRef<LcdDrawing | null>(null);
  const lcdPixelsRef = useRef(new Map<string, LcdPixel>());
  const lcdPreviousPointRef = useRef<LcdPoint | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

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
    const content = contentRef.current;

    if (!canvas || !content) {
      lcdBoundsRef.current = null;
      lcdDrawingRef.current = null;
      return null;
    }

    const context = canvas.getContext("2d");
    const rect = content.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * pixelRatio);
    const height = Math.round(rect.height * pixelRatio);

    lcdBoundsRef.current = rect;

    if (!context || width === 0 || height === 0) {
      lcdDrawingRef.current = null;
      return null;
    }

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const pixelSize = Math.max(window.innerWidth * LCD_PIXEL_SIZE_RATIO, 1);
    const drawing = {
      context,
      height: rect.height,
      pixelGap: pixelSize * LCD_PIXEL_GAP_RATIO,
      pixelSize,
      width: rect.width,
    };

    lcdDrawingRef.current = drawing;
    return drawing;
  }, []);

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

    if (contentRef.current) {
      resizeObserver?.observe(contentRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
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
    pixelSize: number,
  ) => {
    const pixelX = Math.floor(x / pixelSize) * pixelSize;
    const pixelY = Math.floor(y / pixelSize) * pixelSize;
    const key = `${pixelX}:${pixelY}`;

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
    pixelSize: number,
  ) => {
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
        pixelSize,
      );
    }
  };

  const handleLcdPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!lcdBoundsRef.current) {
      updateLcdMetrics();
    }

    const drawing = lcdDrawingRef.current ?? updateLcdMetrics();
    const rect = lcdBoundsRef.current;

    if (!rect || !drawing) {
      return;
    }

    const currentPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const previousPoint = lcdPreviousPointRef.current ?? currentPoint;
    const updatedAt = performance.now();

    addLcdTrail(previousPoint, currentPoint, updatedAt, drawing.pixelSize);
    lcdPreviousPointRef.current = currentPoint;
    queueLcdTrailRender();
  };

  const handleLcdPointerLeave = () => {
    lcdPreviousPointRef.current = null;
  };

  return (
    <main className="appContainer">
      <div className="deviceLayer">
        <div className="device">
          <img className="deviceBase" src="/assets/base/base.svg" alt="base" />
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

          <div
            ref={contentRef}
            className="content"
            onPointerLeave={handleLcdPointerLeave}
            onPointerMove={handleLcdPointerMove}
          >
            <canvas
              ref={lcdCanvasRef}
              className="lcdTrail"
              aria-hidden="true"
            />

            <p>refresh in progress</p>
          </div>

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
        </div>
      </div>

      <div className="grid">
        {GRID_COLUMNS.map((index) => (
          <div key={index} className="column">
            {rowIndexes.map((rowIndex) => (
              <div
                key={rowIndex}
                className="block"
                onMouseEnter={(event) => colorize(event.currentTarget)}
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
