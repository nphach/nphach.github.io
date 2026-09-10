import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "canvas";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pngPath = path.join(root, "public", "og-image.png");
const svgPath = path.join(root, "public", "og-image.svg");

const width = 1200;
const height = 630;
const starScale = 10;
const starCenterX = width / 2;
const starCenterY = height / 2;

const starPoints = [
  [23, 8], [23, 10], [22, 10], [22, 11], [21, 11], [21, 12], [20, 12], [20, 13],
  [19, 13], [19, 14], [18, 14], [18, 19], [19, 19], [19, 23], [17, 23], [17, 22],
  [15, 22], [15, 21], [13, 21], [13, 20], [11, 20], [11, 21], [9, 21], [9, 22],
  [7, 22], [7, 23], [5, 23], [5, 19], [6, 19], [6, 14], [5, 14], [5, 13], [4, 13],
  [4, 12], [3, 12], [3, 11], [2, 11], [2, 10], [1, 10], [1, 8], [8, 8], [8, 6],
  [9, 6], [9, 4], [10, 4], [10, 2], [11, 2], [11, 1], [13, 1], [13, 2], [14, 2],
  [14, 4], [15, 4], [15, 6], [16, 6], [16, 8], [23, 8],
];

const starPolygon = starPoints.map(([x, y]) => `${x} ${y}`).join(" ");

function drawBackground(context) {
  context.fillStyle = "#a3b179";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 255, 255, 0.035)";
  for (let y = 0; y < height; y += 4) {
    context.fillRect(0, y, width, 1);
  }
}

function drawStar(context) {
  context.save();
  context.translate(starCenterX, starCenterY);
  context.scale(starScale, starScale);
  context.translate(-12, -12);
  context.fillStyle = "#263022";
  context.beginPath();
  for (const [index, [x, y]] of starPoints.entries()) {
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.closePath();
  context.fill();
  context.restore();
}

function writeSvg() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#a3b179" />
  <rect width="${width}" height="${height}" fill="url(#scanlines)" opacity="0.035" />
  <defs>
    <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="#ffffff" />
    </pattern>
  </defs>
  <g transform="translate(${starCenterX} ${starCenterY}) scale(${starScale}) translate(-12 -12)" fill="#263022">
    <polygon points="${starPolygon}" />
  </g>
</svg>
`;

  fs.writeFileSync(svgPath, svg);
}

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

drawBackground(ctx);
drawStar(ctx);
fs.writeFileSync(pngPath, canvas.toBuffer("image/png"));
writeSvg();
