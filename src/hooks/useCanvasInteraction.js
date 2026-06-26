import { useCallback, useEffect, useRef } from "react";
import { hitTest, hitHandle } from "../utils/canvas";

/**
 * Wires up canvas mouse interaction (select, drag, resize, rotate) and
 * keyboard shortcuts (undo/redo/delete) for the editor.
 *
 * Binds listeners directly to the canvas element via useEffect — this
 * replaces the original code's pattern of reassigning onmousedown etc.
 * inside the render body, which re-ran on every render and bypassed
 * React's event system.
 */
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

 const getCanvasPos = useCallback((e) => {
 const canvas = canvasRef.current;
if (!canvas) return;
  if (!canvas) return { x: 0, y: 0 };
const rect = canvas.getBoundingClientRect();

  const scale = scaleRef.current || 1;

  return {
    x: (e.clientX - rect.left) / scale,
    y: (e.clientY - rect.top) / scale,
  };
}, [canvasRef, scaleRef]);

  const onMouseDown = useCallback((e) => {
    const { x, y } = getCanvasPos(e);
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

  const onMouseMove = useCallback((e) => {
    const { x, y } = getCanvasPos(e);
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
      return;
    }

    if (sel) {
      const handle = hitHandle(sel, x, y);
      
    } else canvas.style.cursor = "default";
   if (canvas) {
  canvas.style.cursor =
    handle === "rotate"
      ? "crosshair"
      : handle
      ? "nwse-resize"
      : hitTest(sel, x, y)
      ? "move"
      : "default";
}
  }, [getCanvasPos, canvasRef, elementsRef, selectedIdRef, updateEl, scaleRef]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    resizing.current = false;
    rotating.current = false;
    resizeHandle.current = null;
    resizeStart.current = { x: 0, y: 0, el: null };
    rotateStart.current = { angle: 0, el: null };
    if (canvasRef.current) canvasRef.current.style.cursor = "default";
  }, [canvasRef]);

  // Bind mouse listeners directly to the canvas element.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.addEventListener("mousedown", onMouseDown);
    c.addEventListener("mousemove", onMouseMove);
    c.addEventListener("mouseup", onMouseUp);
    c.addEventListener("mouseleave", onMouseUp);
    return () => {
      c.removeEventListener("mousedown", onMouseDown);
      c.removeEventListener("mousemove", onMouseMove);
      c.removeEventListener("mouseup", onMouseUp);
      c.removeEventListener("mouseleave", onMouseUp);
    };
  }, [canvasRef, onMouseDown, onMouseMove, onMouseUp]);

  // Keyboard shortcuts: undo / redo / delete.
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
