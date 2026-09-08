import { DEVICE_ASPECT } from "../constants/device";
import type { DeviceMetrics } from "../types/device";

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

export const getDeviceMetrics = (
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
