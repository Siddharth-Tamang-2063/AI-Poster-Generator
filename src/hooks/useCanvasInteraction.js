import { useCallback, useEffect, useRef } from "react";
import { hitTest, hitHandle } from "../utils/canvas";

export function useCanvasInteraction({
  canvasRef, elementsRef, selectedIdRef, scaleRef,
  setSelectedId, updateEl, pushHistory, undo, redo, deleteSelected,
}) {
  const isDragging = useRef(false);
  const dragOff = useRef({ x: 0, y: 0 });
  const resizing = useRef(false);
  const resizeHandle = useRef(null);
  const resizeStart = useRef({ x: 0, y: 0, el: null });
  const rotating = useRef(false);
  const rotateStart = useRef({ angle: 0, el: null });

  // ── Coordinate helper ───────────────────────────────────────────────────────
  // Works for both MouseEvent (clientX/Y) and a plain {clientX, clientY} object
  // extracted from a TouchEvent's first touch.
  const getCanvasPos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = scaleRef.current || 1;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  }, [canvasRef, scaleRef]);

  // ── Shared pointer-down logic ───────────────────────────────────────────────
  const onPointerDown = useCallback((clientX, clientY) => {
    const { x, y } = getCanvasPos({ clientX, clientY });
    const els = elementsRef.current;
    const selId = selectedIdRef.current;
    const sel = els.find((el) => el.id === selId);

    if (sel) {
      const handle = hitHandle(sel, x, y);
      if (handle === "rotate") {
        rotating.current = true;
        rotateStart.current = {
          angle: Math.atan2(y - (sel.y + sel.height / 2), x - (sel.x + sel.width / 2)) * 180 / Math.PI - (sel.rotation || 0),
          el: { ...sel },
        };
        return;
      }
      if (handle) {
        resizing.current = true;
        resizeHandle.current = handle;
        resizeStart.current = { x, y, el: { ...sel } };
        return;
      }
    }

    for (let i = els.length - 1; i >= 0; i--) {
      if (hitTest(els[i], x, y) && !els[i].locked) {
        pushHistory();
        setSelectedId(els[i].id);
        isDragging.current = true;
        dragOff.current = { x: x - els[i].x, y: y - els[i].y };
        return;
      }
    }
    setSelectedId(null);
  }, [getCanvasPos, elementsRef, selectedIdRef, pushHistory, setSelectedId]);

  // ── Shared pointer-move logic ───────────────────────────────────────────────
  const onPointerMove = useCallback((clientX, clientY) => {
    const { x, y } = getCanvasPos({ clientX, clientY });
    const canvas = canvasRef.current;
    const selId = selectedIdRef.current;
    const sel = elementsRef.current.find((el) => el.id === selId);

    if (rotating.current && sel) {
      const cx = sel.x + sel.width / 2, cy = sel.y + sel.height / 2;
      const angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
      updateEl(sel.id, { rotation: angle - rotateStart.current.angle });
      return;
    }
    if (resizing.current && sel) {
      const dx = x - resizeStart.current.x, dy = y - resizeStart.current.y;
      let { x: ex, y: ey, width: ew, height: eh } = resizeStart.current.el;
      const h = resizeHandle.current;
      if (h.includes("e")) ew = Math.max(20, resizeStart.current.el.width + dx);
      if (h.includes("s")) eh = Math.max(20, resizeStart.current.el.height + dy);
      if (h.includes("w")) { ex = resizeStart.current.el.x + dx; ew = Math.max(20, resizeStart.current.el.width - dx); }
      if (h.includes("n")) { ey = resizeStart.current.el.y + dy; eh = Math.max(20, resizeStart.current.el.height - dy); }
      updateEl(sel.id, { x: ex, y: ey, width: ew, height: eh });
      return;
    }
    if (isDragging.current && sel) {
      updateEl(sel.id, { x: x - dragOff.current.x, y: y - dragOff.current.y });
      if (canvas) canvas.style.cursor = "grabbing";
    }
  }, [getCanvasPos, canvasRef, elementsRef, selectedIdRef, updateEl]);

  // ── Shared pointer-up logic ─────────────────────────────────────────────────
  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    resizing.current = false;
    rotating.current = false;
    resizeHandle.current = null;
    resizeStart.current = { x: 0, y: 0, el: null };
    rotateStart.current = { angle: 0, el: null };
    if (canvasRef.current) canvasRef.current.style.cursor = "default";
  }, [canvasRef]);

  // ── Mouse event handlers ────────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => onPointerDown(e.clientX, e.clientY), [onPointerDown]);
  const onMouseMove = useCallback((e) => onPointerMove(e.clientX, e.clientY), [onPointerMove]);

  // ── Touch event handlers ────────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    // Only handle single-finger touches — let two-finger pinch/scroll pass through
    if (e.touches.length !== 1) return;
    e.preventDefault(); // prevent scroll while dragging an element
    const t = e.touches[0];
    onPointerDown(t.clientX, t.clientY);
  }, [onPointerDown]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return;
    // Only prevent default (page scroll) when actively manipulating something
    if (isDragging.current || resizing.current || rotating.current) {
      e.preventDefault();
    }
    const t = e.touches[0];
    onPointerMove(t.clientX, t.clientY);
  }, [onPointerMove]);

  const onTouchEnd = useCallback(() => {
    onPointerUp();
  }, [onPointerUp]);

  // ── Bind all listeners to the canvas ───────────────────────────────────────
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    // Mouse
    c.addEventListener("mousedown", onMouseDown);
    c.addEventListener("mousemove", onMouseMove);
    c.addEventListener("mouseup", onPointerUp);
    c.addEventListener("mouseleave", onPointerUp);

    // Touch — { passive: false } required so e.preventDefault() works
    c.addEventListener("touchstart", onTouchStart, { passive: false });
    c.addEventListener("touchmove", onTouchMove, { passive: false });
    c.addEventListener("touchend", onTouchEnd);
    c.addEventListener("touchcancel", onTouchEnd);

    return () => {
      c.removeEventListener("mousedown", onMouseDown);
      c.removeEventListener("mousemove", onMouseMove);
      c.removeEventListener("mouseup", onPointerUp);
      c.removeEventListener("mouseleave", onPointerUp);
      c.removeEventListener("touchstart", onTouchStart);
      c.removeEventListener("touchmove", onTouchMove);
      c.removeEventListener("touchend", onTouchEnd);
      c.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [canvasRef, onMouseDown, onMouseMove, onPointerUp, onTouchStart, onTouchMove, onTouchEnd]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.ctrlKey && e.shiftKey && e.key === "Z") { e.preventDefault(); redo(); }
      else if (e.ctrlKey && e.key === "z") { e.preventDefault(); undo(); }
      else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, deleteSelected]);
}