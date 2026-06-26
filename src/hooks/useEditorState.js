import { useCallback, useEffect, useRef, useState } from "react";
import { uid } from "../utils/id";
import { renderElement, drawTransformer } from "../canvas/renderElement";
import { getTemplates } from "../canvas/templates";

/**
 * Owns all editor state for a single design: elements, selection, undo/redo
 * history, template application, uploads, canvas rendering, and PNG export.
 *
 * Mouse/drag interaction lives in useCanvasInteraction, which is handed the
 * refs and updaters returned here.
 */
export function useEditorState({ config, showToast }) {
  const { imageUrl, width: canvasW, height: canvasH, topic, context, copy } = config;

  const canvasRef = useRef(null);
  const imageCache = useRef({});
  const bgImageRef = useRef(null);
  const scaleRef = useRef(1);

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [scale, setScale] = useState(1);

  const zoomIn = useCallback(() => {
  setScale((prev) => {
    const next = Math.min(prev + 0.1, 3);
    scaleRef.current = next;
    return next;
  });
}, []);


useEffect(() => {
  scaleRef.current = scale;
}, [scale]);

const zoomOut = useCallback(() => {
  setScale((prev) => {
    const next = Math.max(prev - 0.1, 0.3);
    scaleRef.current = next;
    return next;
  });
}, []);

  // Refs mirroring the latest state, so event handlers never see stale closures.
  const elementsRef = useRef(elements);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { elementsRef.current = elements; }, [elements]);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  // ── Scale canvas to fit its container ──
  const scaleCanvas = useCallback(() => {
    const area = canvasRef.current?.parentElement;
    if (!area) return;
    // Subtract toolbar height (52px) and padding from available space
    const aW = area.clientWidth - 64;
    const aH = area.clientHeight - 52 - 64;
    // Allow scaling up to 1.5x on large screens, down as needed
    const s = Math.min(aW / canvasW, aH / canvasH, 1.5);
   scaleRef.current = scaleRef.current || 1;
setScale((prev) => prev);
  }, [canvasW, canvasH]);

  // ── Render ──
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvasW, H = canvasH;
    ctx.clearRect(0, 0, W, H);

    if (bgImageRef.current) ctx.drawImage(bgImageRef.current, 0, 0, W, H);
    else { ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, W, H); }

    const els = elementsRef.current;
    for (const el of els) renderElement(ctx, el, imageCache);

    const selId = selectedIdRef.current;
    const sel = els.find((e) => e.id === selId);
    if (sel) drawTransformer(ctx, sel);
  }, [canvasW, canvasH]);

  // ── Load background image ──
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { bgImageRef.current = img; renderCanvas(); };
    img.onerror = () => { bgImageRef.current = null; renderCanvas(); };
    img.src = imageUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  // ── Initial fit + resize listener ──
  useEffect(() => {
    scaleCanvas();
    window.addEventListener("resize", scaleCanvas);
    return () => window.removeEventListener("resize", scaleCanvas);
  }, [scaleCanvas]);

  // ── Apply first template on mount ──
  useEffect(() => {
    const tmpl = getTemplates(canvasW, canvasH, topic, context, copy);
    setElements(tmpl[0].elements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-render whenever elements or selection change ──
  useEffect(() => { renderCanvas(); }, [elements, selectedId, renderCanvas]);

  // ── History ──
  const pushHistory = useCallback(() => {
    setHistory((h) => [...h, JSON.parse(JSON.stringify(elementsRef.current))]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [...f, JSON.parse(JSON.stringify(elementsRef.current))]);
      setElements(prev);
      setSelectedId(null);
      return h.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[f.length - 1];
      setHistory((h) => [...h, JSON.parse(JSON.stringify(elementsRef.current))]);
      setElements(next);
      setSelectedId(null);
      return f.slice(0, -1);
    });
  }, []);

  // ── Element operations ──
  const addElement = useCallback((el) => {
    pushHistory();
    setElements((els) => [...els, el]);
    setSelectedId(el.id);
    showToast(el.type === "text" ? "Text added" : "Shape added", "info");
  }, [pushHistory, showToast]);

  const deleteSelected = useCallback(() => {
    const selId = selectedIdRef.current;
    if (!selId) return;
    pushHistory();
    setElements((els) => els.filter((e) => e.id !== selId));
    setSelectedId(null);
  }, [pushHistory]);

  const updateEl = useCallback((id, changes) => {
    setElements((els) => els.map((e) => (e.id === id ? { ...e, ...changes } : e)));
  }, []);

  const updateSelectedProp = useCallback((prop, value) => {
    const selId = selectedIdRef.current;
    if (!selId) return;
    updateEl(selId, { [prop]: value });
  }, [updateEl]);

  const zoomSelectedImage = useCallback((zoom) => {
  const selId = selectedIdRef.current;
  if (!selId) return;

  setElements((els) =>
    els.map((el) => {
      if (el.id !== selId || el.type !== "image") return el;

      return {
        ...el,
        width: el.originalWidth * zoom,
        height: el.originalHeight * zoom,
      };
    })
  );
}, []);

  // ── Templates ──
  const applyTemplate = useCallback((idx, preserveText = false) => {
    pushHistory();
    const tmpl = getTemplates(canvasW, canvasH, topic, context, copy);
    const newEls = tmpl[idx].elements;
    if (preserveText) {
      const oldTexts = elementsRef.current.filter((e) => e.type === "text").map((e) => e.text);
      let ti = 0;
      newEls.forEach((e) => {
        if (e.type === "text" && oldTexts[ti] !== undefined) { e.text = oldTexts[ti]; ti++; }
      });
    }
    const userImages = elementsRef.current.filter((e) => e.type === "image" && e._userUpload);
    setElements([...newEls, ...userImages]);
    setSelectedId(null);
    setActiveTemplate(idx);
    showToast(`Template "${tmpl[idx].name}" applied`, "info");
  }, [canvasW, canvasH, topic, context, copy, pushHistory, showToast]);

  const resetTemplate = useCallback(
    () => applyTemplate(activeTemplate, false),
    [applyTemplate, activeTemplate]
  );

  // ── Add elements ──
  const addText = useCallback(() => {
    addElement({
      id: uid(), type: "text", x: canvasW * 0.1, y: canvasH * 0.4, width: canvasW * 0.8, height: 80,
      rotation: 0, draggable: true, text: "Click to edit text", fontSize: Math.round(canvasW * 0.05),
      fontFamily: "Inter", fill: "#ffffff", fontStyle: "", align: "center", opacity: 1,
    });
  }, [addElement, canvasW, canvasH]);

  const addShape = useCallback(() => {
    addElement({
      id: uid(), type: "shape", x: canvasW * 0.3, y: canvasH * 0.3, width: canvasW * 0.4, height: canvasH * 0.15,
      rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 0.85, cornerRadius: 12,
    });
  }, [addElement, canvasW, canvasH]);

  const uploadImage = useCallback((file) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      showToast("Only PNG, JPG, WEBP allowed", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new Image();
      img.onload = () => {
        imageCache.current[src] = img;
        const aspect = img.width / img.height;
        const w = Math.min(canvasW * 0.4, img.width);
        const h = w / aspect;
       addElement({
  id: uid(),
  type: "image",
  src,

  x: (canvasW - w) / 2,
  y: (canvasH - h) / 2,

  width: w,
  height: h,

  originalWidth: w,
  originalHeight: h,

  rotation: 0,
  draggable: true,
  opacity: 1,

  _userUpload: true,
});
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [addElement, canvasW, canvasH, showToast]);

  // ── Export ──
  const downloadPNG = useCallback(() => {
    try {
      const prevSel = selectedIdRef.current;
      setSelectedId(null);
      setTimeout(() => {
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = canvasW * 2;
        exportCanvas.height = canvasH * 2;
        const ectx = exportCanvas.getContext("2d");
        ectx.scale(2, 2);
        if (bgImageRef.current) ectx.drawImage(bgImageRef.current, 0, 0, canvasW, canvasH);
        else { ectx.fillStyle = "#1a1a2e"; ectx.fillRect(0, 0, canvasW, canvasH); }
        for (const el of elementsRef.current) renderElement(ectx, el, imageCache);
        const link = document.createElement("a");
        link.download = `banner-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL("image/png");
        link.click();
        setSelectedId(prevSel);
        showToast("Downloaded successfully!", "success");
      }, 50);
    } catch (e) {
      showToast("Download failed. Try again.", "error");
    }
  }, [canvasW, canvasH, showToast]);

 return {
  canvasRef,
  canvasW,
  canvasH,
  scale,

  elements,
  elementsRef,
  selectedId,
  selectedIdRef,
  setSelectedId,

  activeTemplate,

  canUndo: history.length > 0,
  canRedo: future.length > 0,

  undo,
  redo,
  pushHistory,
  updateEl,
  updateSelectedProp,

  addText,
  addShape,
  uploadImage,
  deleteSelected,

  applyTemplate,
  resetTemplate,
  downloadPNG,

  scaleRef,
  zoomSelectedImage,

  // 🔥 ADD THIS
  zoomIn,
  zoomOut,
};
}
