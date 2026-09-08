import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import "./App.css";
import { BIO, PROFILE_LINKS, PROJECTS, SKILLS } from "./content";
import { PixelIcon } from "./pixel-icons";
import { ProjectIcon } from "./project-icons";

const GRID_BLOCK_SIZE_RATIO = 0.05;
const INVENTORY_MIN_SLOTS = 6;
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

const PHYSICAL_BUTTONS = [
  {
    className: "physicalButton--left",
    ...PROFILE_LINKS[0],
  },
  {
    className: "physicalButton--middle",
    ...PROFILE_LINKS[1],
  },
  {
    className: "physicalButton--right",
    ...PROFILE_LINKS[2],
  },
] as const;

type View = "landing" | "expanded";

type ExpandedSection = "about" | "work";

const EXPANDED_SECTIONS: { id: ExpandedSection; label: string }[] = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
];

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

const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

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

const ProfileNavLinks = ({ itemClassName }: { itemClassName: string }) =>
  PROFILE_LINKS.map(({ href, icon, label }) => {
    const external = isExternalLink(href);

    return (
      <a
        key={label}
        aria-label={label}
        className={itemClassName}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        <PixelIcon name={icon} />
      </a>
    );
  });

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
  const [scrollFadeVisible, setScrollFadeVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<ExpandedSection>("about");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const selectedProject = PROJECTS[selectedProjectIndex] ?? PROJECTS[0];
  const inventorySlotCount = Math.max(INVENTORY_MIN_SLOTS, PROJECTS.length);
  const [isBusy, setIsBusy] = useState(false);
  const [viewportSize, setViewportSize] = useState(getViewportSize);
  const lcdAnimationRef = useRef<number | null>(null);
  const lcdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lcdDrawingRef = useRef<LcdDrawing | null>(null);
  const lcdLayerRef = useRef<HTMLDivElement | null>(null);
  const lcdScrollRef = useRef<HTMLDivElement | null>(null);
  const lcdBodyRef = useRef<HTMLDivElement | null>(null);
  const lcdExpandedRef = useRef<HTMLDivElement | null>(null);
  const lcdNavDockRef = useRef<HTMLElement | null>(null);
  const lcdPixelsRef = useRef(new Map<string, LcdPixel>());
  const lcdPreviousPointRef = useRef<LcdPoint | null>(null);
  const pendingPhaseRef = useRef<
    "await-content-in" | "await-content-out" | null
  >(null);
  const enterRevealTimerRef = useRef<number | null>(null);
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

  const updateScrollFade = useCallback(() => {
    const scroll = lcdScrollRef.current;

    if (!scroll) {
      setScrollFadeVisible(false);
      return;
    }

    const threshold = 12;
    const hasMoreBelow =
      scroll.scrollTop + scroll.clientHeight < scroll.scrollHeight - threshold;

    setScrollFadeVisible(hasMoreBelow);
  }, []);

  const updateExpandedLayout = useCallback(() => {
    const nav = lcdNavDockRef.current;
    const expanded =
      lcdExpandedRef.current ?? nav?.closest<HTMLElement>(".lcdExpanded");

    if (expanded && nav) {
      expanded.style.setProperty("--lcd-nav-offset", `${nav.offsetHeight}px`);
    }

    updateScrollFade();
  }, [updateScrollFade]);

  useEffect(() => {
    if (!expandedContentVisible) {
      return;
    }

    const scroll = lcdScrollRef.current;
    const body = lcdBodyRef.current;
    const nav = lcdNavDockRef.current;

    if (!scroll) {
      return;
    }

    updateExpandedLayout();

    const onScroll = () => {
      updateScrollFade();
    };

    scroll.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateExpandedLayout);

    resizeObserver?.observe(scroll);

    if (body) {
      resizeObserver?.observe(body);
    }

    if (nav) {
      resizeObserver?.observe(nav);
    }

    return () => {
      scroll.removeEventListener("scroll", onScroll);
      resizeObserver?.disconnect();
    };
  }, [expandedContentVisible, updateExpandedLayout, updateScrollFade]);

  useEffect(() => {
    const scroll = lcdScrollRef.current;

    if (!scroll) {
      return;
    }

    scroll.scrollTop = 0;
    updateScrollFade();
  }, [activeSection, updateScrollFade]);

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

  const clearEnterRevealTimer = useCallback(() => {
    if (enterRevealTimerRef.current !== null) {
      window.clearTimeout(enterRevealTimerRef.current);
      enterRevealTimerRef.current = null;
    }
  }, []);

  const revealExpandedContent = useCallback(() => {
    if (pendingPhaseRef.current !== "await-content-in") {
      return;
    }

    setView("expanded");
    setExpandedContentVisible(true);
  }, []);

  useEffect(() => {
    return () => {
      clearEnterRevealTimer();
    };
  }, [clearEnterRevealTimer]);

  const enterExpanded = () => {
    if (isBusy || isExpanded) {
      return;
    }

    pendingPhaseRef.current = "await-content-in";
    setActiveSection("about");
    setIsBusy(true);
    setLandingContentVisible(false);
    setZoomExpanded(true);
    clearEnterRevealTimer();

    if (!prefersReducedMotion) {
      const revealDelay =
        (ZOOM_TRANSITION.duration - CONTENT_TRANSITION.duration) * 1000;

      enterRevealTimerRef.current = window.setTimeout(
        revealExpandedContent,
        revealDelay,
      );
    }
  };

  const returnToLanding = () => {
    if (isBusy || !isExpanded) {
      return;
    }

    clearEnterRevealTimer();
    pendingPhaseRef.current = "await-content-out";
    setIsBusy(true);
    setExpandedContentVisible(false);
  };

  const handleZoomComplete = () => {
    if (zoomExpanded && view === "landing") {
      clearEnterRevealTimer();
      revealExpandedContent();

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
    updateExpandedLayout();
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
  const foregroundOpacity =
    view === "expanded" && (expandedContentVisible || !isBusy)
      ? 0
      : isBusy
        ? 1
        : view === "expanded"
          ? 0
          : 1;
  const isEnteringExpanded = isBusy && zoomExpanded;
  const deviceOpacity =
    isEnteringExpanded || (view === "expanded" && !isBusy) ? 0 : 1;
  const deviceTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        opacity: {
          ...DEVICE_FADE,
          delay: isEnteringExpanded ? ZOOM_TRANSITION.duration * 0.35 : 0,
        },
      };
  const transformOrigin = `${metrics.zoomOriginX}px ${metrics.zoomOriginY}px`;

  const holeBottom = metrics.holeTop + metrics.screenHeight;
  const holeRight = metrics.holeLeft + metrics.screenWidth;
  const gridBlockSize = getGridBlockSize(viewportSize.width);

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

  const revealTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      };

  return (
    <>
      <a className="skipLink" href="#main-content">
        skip to content
      </a>

      <main className="appContainer" id="main-content">
        <div
          ref={lcdLayerRef}
          className="lcdLayer"
          onPointerLeave={handleLcdPointerLeave}
          onPointerMoveCapture={handleLcdPointerMove}
        >
          <canvas ref={lcdCanvasRef} className="lcdTrail" aria-hidden="true" />

          <AnimatePresence
            mode="wait"
            onExitComplete={handleExpandedContentHidden}
          >
            {expandedContentVisible && (
              <motion.div
                key="expanded-content"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onAnimationComplete={handleExpandedContentShown}
                transition={contentTransition}
              >
                <div ref={lcdExpandedRef} className="lcdExpanded">
                  <div className="lcdScrollShell">
                    <div ref={lcdScrollRef} className="lcdScroll">
                      <div ref={lcdBodyRef} className="lcdBody">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeSection}
                            animate="visible"
                            aria-labelledby={`lcd-tab-${activeSection}`}
                            className="lcdSectionPanel"
                            id={`lcd-panel-${activeSection}`}
                            initial={prefersReducedMotion ? false : "hidden"}
                            role="tabpanel"
                            transition={revealTransition}
                            variants={REVEAL_VARIANTS}
                          >
                            {activeSection === "about" && (
                              <>
                                <p className="lcdName">nikki phach</p>
                                <p className="lcdTagline">software engineer</p>
                                <p className="lcdBio">{BIO}</p>
                                <section
                                  aria-labelledby="skills-heading"
                                  className="lcdSection"
                                >
                                  <h2
                                    className="lcdSectionTitle"
                                    id="skills-heading"
                                  >
                                    skills
                                  </h2>
                                  <ul className="lcdSkillList">
                                    {SKILLS.map((skill) => (
                                      <li key={skill} className="lcdSkill">
                                        {skill}
                                      </li>
                                    ))}
                                  </ul>
                                </section>
                              </>
                            )}

                            {activeSection === "work" && (
                              <section
                                aria-labelledby="projects-heading"
                                className="lcdSection lcdInventory"
                              >
                                <h2
                                  className="lcdSectionTitle"
                                  id="projects-heading"
                                >
                                  project inventory
                                </h2>
                                <ul
                                  aria-label="Project inventory"
                                  className="lcdInventoryRow"
                                  role="listbox"
                                  style={
                                    {
                                      "--inventory-slots": inventorySlotCount,
                                    } as CSSProperties
                                  }
                                >
                                  {PROJECTS.map((project, index) => (
                                    <li key={project.name}>
                                      <button
                                        aria-selected={
                                          selectedProjectIndex === index
                                        }
                                        className={`lcdInventorySlot${selectedProjectIndex === index ? " lcdInventorySlot--selected" : ""}`}
                                        onClick={() =>
                                          setSelectedProjectIndex(index)
                                        }
                                        role="option"
                                        type="button"
                                      >
                                        <span className="lcdInventorySlotIndex">
                                          {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <div className="lcdInventorySlotIcon">
                                          <ProjectIcon name={project.icon} />
                                        </div>
                                        <span className="lcdInventorySlotName">
                                          {project.name}
                                        </span>
                                      </button>
                                    </li>
                                  ))}
                                  {Array.from({
                                    length: inventorySlotCount - PROJECTS.length,
                                  }).map((_, index) => (
                                    <li
                                      key={`empty-slot-${index}`}
                                      aria-hidden="true"
                                    >
                                      <div className="lcdInventorySlot lcdInventorySlot--empty">
                                        <span className="lcdInventorySlotIndex">
                                          {String(
                                            PROJECTS.length + index + 1,
                                          ).padStart(2, "0")}
                                        </span>
                                        <div
                                          aria-hidden="true"
                                          className="lcdInventorySlotIcon"
                                        />
                                        <span className="lcdInventorySlotName">
                                          —
                                        </span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                <article
                                  aria-labelledby="inventory-detail-heading"
                                  className="lcdInventoryDetail"
                                >
                                  <h3
                                    className="lcdProjectName"
                                    id="inventory-detail-heading"
                                  >
                                    {selectedProject.name}
                                  </h3>
                                  <p className="lcdProjectDescription">
                                    {selectedProject.description}
                                  </p>
                                  <ul
                                    aria-label={`${selectedProject.name} tags`}
                                    className="lcdTagList"
                                  >
                                    {selectedProject.tags.map((tag) => (
                                      <li key={tag} className="lcdTag">
                                        {tag}
                                      </li>
                                    ))}
                                  </ul>
                                  <ul className="lcdProjectActionList">
                                    {selectedProject.links.map(
                                      (link, index) => (
                                        <li key={link.label}>
                                          <a
                                            className={`lcdProjectAction${index === 0 ? " lcdProjectAction--primary" : ""}`}
                                            href={link.href}
                                            rel="noreferrer"
                                            target="_blank"
                                          >
                                            {link.label}
                                          </a>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </article>
                              </section>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className={`lcdScrollFade${scrollFadeVisible ? " lcdScrollFade--visible" : ""}`}
                  />

                  <nav
                    ref={lcdNavDockRef}
                    aria-label="Page navigation"
                    className="lcdNavDock"
                  >
                    <div className="lcdNavPill">
                      <button
                        aria-label="Back"
                        className="lcdNavItem lcdNavItem--back"
                        disabled={isBusy}
                        onClick={returnToLanding}
                        type="button"
                      >
                        <PixelIcon name="back" />
                      </button>
                      <div
                        aria-label="Sections"
                        className="lcdSectionTabs"
                        role="tablist"
                      >
                        {EXPANDED_SECTIONS.map(({ id, label }) => (
                          <button
                            key={id}
                            aria-controls={`lcd-panel-${id}`}
                            aria-selected={activeSection === id}
                            className={`lcdSectionTab${activeSection === id ? " lcdSectionTab--active" : ""}`}
                            id={`lcd-tab-${id}`}
                            onClick={() => setActiveSection(id)}
                            role="tab"
                            type="button"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <div aria-label="Contact links" className="lcdNavLinks">
                        <ProfileNavLinks itemClassName="lcdNavItem" />
                      </div>
                    </div>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          animate={{
            opacity: foregroundOpacity,
            scale: foregroundScale,
          }}
          className={`foregroundLayer${isExpanded && !isBusy ? " foregroundLayer--inactive" : ""}`}
          inert={isExpanded ? true : undefined}
          onAnimationComplete={handleZoomComplete}
          style={{
            transformOrigin,
            willChange: "transform, opacity",
          }}
          transition={{
            opacity: contentTransition,
            scale: zoomTransition,
          }}
        >
          <div
            className="foregroundSurface"
            style={{ height: metrics.holeTop, left: 0, right: 0, top: 0 }}
          />
          <div
            className="foregroundSurface"
            style={{
              height: viewportSize.height - holeBottom,
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

          <div className="grid">
            {GRID_COLUMNS.map((index) => (
              <div key={index} className="column">
                {rowIndexes.map((rowIndex) => {
                  const interactive = isGridBlockInteractive(index, rowIndex);

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

              {view === "landing" && (
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
                          <PixelIcon name={icon} />
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}

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
        </motion.div>
      </main>
    </>
  );
}

export default App;
