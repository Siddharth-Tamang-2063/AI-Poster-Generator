import { HANDLE_SIZE } from "../constants";

/** Wraps text to fit within maxWidth, returning an array of lines. */
export function wrapText(ctx, text, maxWidth) {
  const words = (text || "").split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

/** Traces a rounded-rectangle path on the given context. */
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Returns the screen positions of all resize/rotate handles for an element. */
export function getHandlePositions(el) {
  const { x, y, width: w, height: h } = el;
  return {
    nw: { x, y }, n: { x: x + w / 2, y }, ne: { x: x + w, y },
    e: { x: x + w, y: y + h / 2 }, se: { x: x + w, y: y + h },
    s: { x: x + w / 2, y: y + h }, sw: { x, y: y + h }, w: { x, y: y + h / 2 },
    rotate: { x: x + w / 2, y: y - 30 },
  };
}

/** True if (x, y) falls within the element's bounding box. */
export function hitTest(el, x, y) {
  return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;
}

/** Returns the handle key under (x, y), or null if none. */
export function hitHandle(el, x, y) {
  const pos = getHandlePositions(el);
  for (const [key, p] of Object.entries(pos)) {
    const d = HANDLE_SIZE;
    if (key === "rotate") {
      if (Math.hypot(x - p.x, y - p.y) <= d) return key;
    } else if (Math.abs(x - p.x) <= d && Math.abs(y - p.y) <= d) return key;
  }
  return null;
}
