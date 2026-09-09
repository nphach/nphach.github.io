import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONTENT_TRANSITION,
  DEVICE_FADE,
  ZOOM_TRANSITION,
} from "../constants/motion";
import type { DeviceMetrics } from "../types/device";
import type { View } from "../types/view";

type UsePortfolioViewOptions = {
  prefersReducedMotion: boolean;
  metrics: DeviceMetrics;
  wantsExpanded: boolean;
};

export function usePortfolioView({
  prefersReducedMotion,
  metrics,
  wantsExpanded,
}: UsePortfolioViewOptions) {
  const [view, setView] = useState<View>(wantsExpanded ? "expanded" : "landing");
  const [zoomExpanded, setZoomExpanded] = useState(wantsExpanded);
  const [landingContentVisible, setLandingContentVisible] = useState(
    !wantsExpanded,
  );
  const [expandedContentVisible, setExpandedContentVisible] =
    useState(wantsExpanded);
  const [isBusy, setIsBusy] = useState(false);
  const pendingPhaseRef = useRef<
    "await-content-in" | "await-content-out" | null
  >(null);
  const enterRevealTimerRef = useRef<number | null>(null);
  const onExpandedLayoutRef = useRef<(() => void) | null>(null);

  const isExpanded = view === "expanded";
  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : CONTENT_TRANSITION;
  const zoomTransition = prefersReducedMotion
    ? { duration: 0 }
    : ZOOM_TRANSITION;

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

  const registerExpandedLayout = useCallback((updateLayout: () => void) => {
    onExpandedLayoutRef.current = updateLayout;
  }, []);

  const enterExpanded = useCallback(() => {
    if (isBusy || isExpanded) {
      return;
    }

    pendingPhaseRef.current = "await-content-in";
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
  }, [
    clearEnterRevealTimer,
    isBusy,
    isExpanded,
    prefersReducedMotion,
    revealExpandedContent,
  ]);

  const returnToLanding = useCallback(() => {
    if (isBusy || !isExpanded) {
      return;
    }

    clearEnterRevealTimer();
    pendingPhaseRef.current = "await-content-out";
    setIsBusy(true);
    setExpandedContentVisible(false);
  }, [clearEnterRevealTimer, isBusy, isExpanded]);

  useEffect(() => {
    if (isBusy) {
      return;
    }

    if (wantsExpanded && !isExpanded) {
      // URL is an external system (including browser back/forward).
      // eslint-disable-next-line react-hooks/set-state-in-effect -- start enter from route
      enterExpanded();
      return;
    }

    if (!wantsExpanded && isExpanded) {
      returnToLanding();
    }
  }, [
    enterExpanded,
    isBusy,
    isExpanded,
    returnToLanding,
    wantsExpanded,
  ]);

  const handleZoomComplete = useCallback(() => {
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
  }, [
    clearEnterRevealTimer,
    prefersReducedMotion,
    revealExpandedContent,
    view,
    zoomExpanded,
  ]);

  const handleExpandedContentShown = useCallback(() => {
    if (pendingPhaseRef.current !== "await-content-in") {
      return;
    }

    pendingPhaseRef.current = null;
    setIsBusy(false);
    onExpandedLayoutRef.current?.();
  }, []);

  const handleExpandedContentHidden = useCallback(() => {
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
  }, [prefersReducedMotion]);

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

  return {
    contentTransition,
    deviceOpacity,
    deviceTransition,
    expandedContentVisible,
    foregroundOpacity,
    foregroundScale,
    handleExpandedContentHidden,
    handleExpandedContentShown,
    handleZoomComplete,
    isBusy,
    isExpanded,
    landingContentVisible,
    registerExpandedLayout,
    transformOrigin,
    view,
    zoomTransition,
  };
}
