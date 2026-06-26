import { HANDLE_SIZE } from "../constants";
import { roundRect, wrapText, getHandlePositions } from "../utils/canvas";

/** Draws a single element (shape, text, or image) onto the canvas context. */
export function renderElement(ctx, el, imageCache) {
  ctx.save();
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  ctx.translate(cx, cy);
  ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
  ctx.translate(-el.width / 2, -el.height / 2);
  ctx.globalAlpha = el.opacity !== undefined ? el.opacity : 1;

  if (el.type === "shape") {
    ctx.fillStyle = el.fill || "#7c6dfa";
    const r = el.cornerRadius || 0;
    if (el.fill !== "transparent") {
      if (r > 0) { roundRect(ctx, 0, 0, el.width, el.height, r); ctx.fill(); }
      else ctx.fillRect(0, 0, el.width, el.height);
    }
    if (el.stroke) {
      ctx.strokeStyle = el.stroke;
      ctx.lineWidth = el.strokeWidth || 2;
      if (r > 0) { roundRect(ctx, 0, 0, el.width, el.height, r); ctx.stroke(); }
      else ctx.strokeRect(0, 0, el.width, el.height);
    }
  } else if (el.type === "text") {
    ctx.fillStyle = el.fill || "#ffffff";
    ctx.font = `${el.fontStyle || ""} ${el.fontSize || 48}px ${el.fontFamily || "Inter"}`.trim();
    ctx.textAlign = el.align || "left";
    ctx.textBaseline = "top";
    const lines = wrapText(ctx, el.text || "Text", el.width);
    const lh = (el.fontSize || 48) * 1.3;
    lines.forEach((line, i) => {
      const xPos = el.align === "center" ? el.width / 2 : el.align === "right" ? el.width : 0;
      ctx.fillText(line, xPos, i * lh);
    });
  } else if (el.type === "image") {
    if (imageCache.current[el.src]) {
      ctx.drawImage(imageCache.current[el.src], 0, 0, el.width, el.height);
    } else {
      ctx.fillStyle = "#2a2a3d";
      ctx.fillRect(0, 0, el.width, el.height);
    }
  }
  ctx.restore();
}

/** Draws the selection outline and resize/rotate handles around an element. */
export function drawTransformer(ctx, el) {
  const pos = getHandlePositions(el);
  ctx.save();
  ctx.strokeStyle = "#7c6dfa";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 3]);
  const cx = el.x + el.width / 2, cy = el.y + el.height / 2;
  ctx.translate(cx, cy);
  ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
  ctx.strokeRect(-el.width / 2, -el.height / 2, el.width, el.height);
  ctx.restore();
  ctx.save();
  Object.entries(pos).forEach(([key, p]) => {
    ctx.fillStyle = key === "rotate" ? "#a78bfa" : "#ffffff";
    ctx.strokeStyle = "#7c6dfa";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    if (key === "rotate") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, HANDLE_SIZE / 2, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(el.x + el.width / 2, el.y);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = "#7c6dfa";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.fillRect(p.x - HANDLE_SIZE / 2, p.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
      ctx.strokeRect(p.x - HANDLE_SIZE / 2, p.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
    }
  });
  ctx.restore();
}
