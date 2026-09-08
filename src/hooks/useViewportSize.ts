import { useEffect, useState } from "react";
import { getViewportSize } from "../lib/viewport";

export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState(getViewportSize);

  useEffect(() => {
    const onResize = () => {
      setViewportSize(getViewportSize());
    };

    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
    };
  }, []);

  return viewportSize;
}
