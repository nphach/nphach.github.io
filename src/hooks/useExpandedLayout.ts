import { useCallback, useEffect, useRef, useState } from "react";
import type { ExpandedSection } from "../types/view";

type UseExpandedLayoutOptions = {
  activeSection: ExpandedSection;
  expandedContentVisible: boolean;
};

export function useExpandedLayout({
  activeSection,
  expandedContentVisible,
}: UseExpandedLayoutOptions) {
  const [scrollFadeVisible, setScrollFadeVisible] = useState(false);
  const lcdScrollRef = useRef<HTMLDivElement | null>(null);
  const lcdBodyRef = useRef<HTMLDivElement | null>(null);
  const lcdExpandedRef = useRef<HTMLDivElement | null>(null);
  const lcdNavDockRef = useRef<HTMLElement | null>(null);

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

  return {
    lcdBodyRef,
    lcdExpandedRef,
    lcdNavDockRef,
    lcdScrollRef,
    scrollFadeVisible,
    updateExpandedLayout,
  };
}
