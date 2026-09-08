import { useReducedMotion } from "motion/react";
import { useMemo } from "react";
import "./App.css";
import { TamagotchiDevice } from "./components/device/TamagotchiDevice";
import { ForegroundLayer } from "./components/layout/ForegroundLayer";
import { LcdExpandedView } from "./components/lcd/LcdExpandedView";
import { LcdTrailLayer } from "./components/lcd/LcdTrailLayer";
import { useLcdTrail } from "./hooks/useLcdTrail";
import { usePortfolioView } from "./hooks/usePortfolioView";
import { useViewportSize } from "./hooks/useViewportSize";
import { getDeviceMetrics } from "./lib/device-metrics";
import { getGridBlockSize } from "./lib/grid";

function App() {
  const prefersReducedMotion = useReducedMotion();
  const viewportSize = useViewportSize();

  const metrics = useMemo(
    () => getDeviceMetrics(viewportSize.width, viewportSize.height),
    [viewportSize],
  );

  const portfolio = usePortfolioView({
    prefersReducedMotion: prefersReducedMotion ?? false,
    metrics,
  });

  const lcdTrail = useLcdTrail({
    view: portfolio.view,
    isBusy: portfolio.isBusy,
  });

  const blockRows = useMemo(() => {
    const blockSize = getGridBlockSize(viewportSize.width);

    return Math.ceil(viewportSize.height / blockSize);
  }, [viewportSize]);

  const rowIndexes = useMemo(
    () => Array.from({ length: blockRows }, (_, index) => index),
    [blockRows],
  );

  return (
    <>
      <a className="skipLink" href="#main-content">
        skip to content
      </a>

      <main className="appContainer" id="main-content">
        <LcdTrailLayer
          lcdCanvasRef={lcdTrail.lcdCanvasRef}
          lcdLayerRef={lcdTrail.lcdLayerRef}
          onPointerLeave={lcdTrail.handlePointerLeave}
          onPointerMove={lcdTrail.handlePointerMove}
        >
          <LcdExpandedView
            activeSection={portfolio.activeSection}
            contentTransition={portfolio.contentTransition}
            expandedContentVisible={portfolio.expandedContentVisible}
            isBusy={portfolio.isBusy}
            onContentHidden={portfolio.handleExpandedContentHidden}
            onContentShown={portfolio.handleExpandedContentShown}
            onRegisterLayout={portfolio.registerExpandedLayout}
            onReturnToLanding={portfolio.returnToLanding}
            onSectionChange={portfolio.setActiveSection}
            prefersReducedMotion={prefersReducedMotion}
          />
        </LcdTrailLayer>

        <ForegroundLayer
          contentTransition={portfolio.contentTransition}
          foregroundOpacity={portfolio.foregroundOpacity}
          foregroundScale={portfolio.foregroundScale}
          isBusy={portfolio.isBusy}
          isExpanded={portfolio.isExpanded}
          metrics={metrics}
          onZoomComplete={portfolio.handleZoomComplete}
          rowIndexes={rowIndexes}
          transformOrigin={portfolio.transformOrigin}
          viewportHeight={viewportSize.height}
          viewportWidth={viewportSize.width}
          zoomTransition={portfolio.zoomTransition}
        >
          {portfolio.landingContentVisible && !portfolio.isExpanded && (
            <button
              aria-label="enter"
              className="lcdEnterOverlay"
              disabled={portfolio.isBusy}
              onClick={portfolio.enterExpanded}
              style={{
                height: metrics.screenHeight,
                left: metrics.holeLeft,
                top: metrics.holeTop,
                width: metrics.screenWidth,
              }}
              type="button"
            />
          )}

          <TamagotchiDevice
            contentTransition={portfolio.contentTransition}
            deviceOpacity={portfolio.deviceOpacity}
            deviceTransition={portfolio.deviceTransition}
            isExpanded={portfolio.isExpanded}
            landingContentVisible={portfolio.landingContentVisible}
            metrics={metrics}
            view={portfolio.view}
          />
        </ForegroundLayer>
      </main>
    </>
  );
}

export default App;
