export const getViewportSize = () => ({
  height: window.visualViewport?.height ?? window.innerHeight,
  width: window.visualViewport?.width ?? window.innerWidth,
});
