import { useState } from "react";
import { COLORS, FONTS } from "../constants";
import { ctrl, group, toggleBtn } from "./FormControls";

function ImageZoomControl({ selectedEl, onZoomImage }) {
  const currentZoom = selectedEl.originalWidth
    ? selectedEl.width / selectedEl.originalWidth
    : 1;
  const zoomPct = Math.round(currentZoom * 100);

  const [inputVal, setInputVal] = useState(String(zoomPct));

  const clamp = (v) => Math.min(300, Math.max(20, v));

  const applyZoom = (pct) => {
    const clamped = clamp(pct);
    setInputVal(String(clamped));
    onZoomImage(clamped / 100);
  };

  // Keep input in sync when slider or buttons change the value externally
  const syncedPct = Math.round(currentZoom * 100);
  if (inputVal !== String(syncedPct) && document.activeElement?.dataset?.zoomInput !== "true") {
    setInputVal(String(syncedPct));
  }

  const PRESETS = [50, 100, 150, 200];

  const btnStyle = (active) => ({
    padding: "0.3rem 0.5rem",
    background: active ? COLORS.accent : COLORS.surface2,
    border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
    borderRadius: 6,
    color: active ? "#fff" : COLORS.text2,
    fontSize: "0.72rem",
    fontWeight: 500,
    cursor: "pointer",
    lineHeight: 1,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {/* Label */}
      <div style={{ fontSize: "0.7rem", fontWeight: 600, color: COLORS.text3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Zoom
      </div>

      {/* − input + row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <button onClick={() => applyZoom(syncedPct - 10)} style={btnStyle(false)}>−</button>

        <div style={{ flex: 1, position: "relative" }}>
          <input
            data-zoom-input="true"
            type="number"
            min={20}
            max={300}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={(e) => {
              const parsed = parseInt(e.target.value, 10);
              applyZoom(isNaN(parsed) ? syncedPct : parsed);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const parsed = parseInt(inputVal, 10);
                applyZoom(isNaN(parsed) ? syncedPct : parsed);
                e.target.blur();
              }
            }}
            style={{
              width: "100%",
              padding: "0.35rem 1.6rem 0.35rem 0.6rem",
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              color: COLORS.text,
              fontSize: "0.8rem",
              fontWeight: 600,
              textAlign: "center",
              outline: "none",
              boxSizing: "border-box",
              appearance: "textfield",
              MozAppearance: "textfield",
            }}
          />
          <span style={{
            position: "absolute", right: "0.45rem", top: "50%", transform: "translateY(-50%)",
            fontSize: "0.7rem", color: COLORS.text3, pointerEvents: "none",
          }}>%</span>
        </div>

        <button onClick={() => applyZoom(syncedPct + 10)} style={btnStyle(false)}>+</button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={20}
        max={300}
        step={1}
        value={syncedPct}
        onChange={(e) => applyZoom(Number(e.target.value))}
        style={{ width: "100%", accentColor: COLORS.accent, cursor: "pointer" }}
      />

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: "0.35rem" }}>
        {PRESETS.map((p) => (
          <button key={p} onClick={() => applyZoom(p)} style={{ ...btnStyle(syncedPct === p), flex: 1 }}>
            {p}%
          </button>
        ))}
      </div>

      {/* Reset to original */}
      <button
        onClick={() => applyZoom(100)}
        style={{
          padding: "0.4rem",
          background: "transparent",
          border: `1px dashed ${COLORS.border}`,
          borderRadius: 6,
          color: COLORS.text3,
          fontSize: "0.72rem",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        Reset to original size
      </button>
    </div>
  );
}

export default function RightSidebar({
  selectedEl,
  onUpdateProp,
  onZoomImage,
}) {
  if (!selectedEl) {
    return (
      <div style={{
        width: 260, minWidth: 260, height: "100vh", background: COLORS.surface, borderLeft: `1px solid ${COLORS.border}`,
        paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        gap: "0.5rem", color: COLORS.text3, fontSize: "0.78rem", textAlign: "center", padding: "52px 1.5rem 1.5rem",
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
          <path d="M15 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9M15 3l4 4M15 3v4h4" />
        </svg>
        Select an element<br />to edit its properties
      </div>
    );
  }

  const isBold = (selectedEl.fontStyle || "").includes("bold");
  const isItalic = (selectedEl.fontStyle || "").includes("italic");
  const opacity = Math.round((selectedEl.opacity ?? 1) * 100);

  return (
    <div style={{ width: 260, minWidth: 260, height: "100vh", background: COLORS.surface, borderLeft: `1px solid ${COLORS.border}`, paddingTop: 52, overflowY: "auto", flexShrink: 0 }}>
      <div style={{ padding: "0.85rem" }}>
        {selectedEl.type === "text" && (
          <>
            {group(<>{ctrl.label("Content")}{ctrl.textarea({ value: selectedEl.text || "", onChange: (e) => onUpdateProp("text", e.target.value) })}</>)}
            {group(<>
              {ctrl.label("Font Family")}
              {ctrl.select({
                value: selectedEl.fontFamily || "Inter",
                onChange: (e) => onUpdateProp("fontFamily", e.target.value),
                children: FONTS.map((f) => <option key={f} value={f}>{f}</option>),
              })}
            </>)}
            {group(<>{ctrl.label(`Font Size — ${selectedEl.fontSize || 48}px`)}{ctrl.range({ min: 8, max: 200, value: selectedEl.fontSize || 48, onChange: (e) => onUpdateProp("fontSize", +e.target.value) })}</>)}
            {group(<>{ctrl.label("Text Color")}{ctrl.color({ value: selectedEl.fill || "#ffffff", onInput: (e) => onUpdateProp("fill", e.target.value) })}</>)}
            {group(<>
              {ctrl.label("Style")}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {toggleBtn(isBold, () => {
                  const style = isBold
                    ? (selectedEl.fontStyle || "").replace("bold", "").trim()
                    : (selectedEl.fontStyle ? selectedEl.fontStyle + " bold" : "bold");
                  onUpdateProp("fontStyle", style);
                }, <b>B</b>)}
                {toggleBtn(isItalic, () => {
                  const style = isItalic
                    ? (selectedEl.fontStyle || "").replace("italic", "").trim()
                    : (selectedEl.fontStyle ? selectedEl.fontStyle + " italic" : "italic");
                  onUpdateProp("fontStyle", style);
                }, <i>I</i>)}
              </div>
            </>)}
            {group(<>
              {ctrl.label("Alignment")}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {["left", "center", "right"].map((a) => (
                  <button key={a} onClick={() => onUpdateProp("align", a)} style={{
                    flex: 1, padding: "0.4rem", background: selectedEl.align === a ? COLORS.accent : COLORS.surface2,
                    border: `1px solid ${selectedEl.align === a ? COLORS.accent : COLORS.border}`, borderRadius: 7,
                    color: selectedEl.align === a ? "#fff" : COLORS.text2, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {a === "left" && <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></>}
                      {a === "center" && <><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>}
                      {a === "right" && <><line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" /></>}
                    </svg>
                  </button>
                ))}
              </div>
            </>)}
            {group(<>{ctrl.label(`Opacity — ${opacity}%`)}{ctrl.range({ min: 0, max: 100, value: opacity, onChange: (e) => onUpdateProp("opacity", e.target.value / 100) })}</>)}
          </>
        )}

        {selectedEl.type === "shape" && (
          <>
            {group(<>{ctrl.label("Fill Color")}{ctrl.color({ value: selectedEl.fill || "#7c6dfa", onInput: (e) => onUpdateProp("fill", e.target.value) })}</>)}
            {group(<>{ctrl.label(`Opacity — ${opacity}%`)}{ctrl.range({ min: 0, max: 100, value: opacity, onChange: (e) => onUpdateProp("opacity", e.target.value / 100) })}</>)}
            {group(<>{ctrl.label(`Corner Radius — ${selectedEl.cornerRadius || 0}`)}{ctrl.range({ min: 0, max: 60, value: selectedEl.cornerRadius || 0, onChange: (e) => onUpdateProp("cornerRadius", +e.target.value) })}</>)}
          </>
        )}

        {selectedEl.type === "image" && (
          <>
            {group(<ImageZoomControl selectedEl={selectedEl} onZoomImage={onZoomImage} />)}
            {group(<>{ctrl.label(`Opacity — ${opacity}%`)}{ctrl.range({ min: 0, max: 100, value: opacity, onChange: (e) => onUpdateProp("opacity", e.target.value / 100) })}</>)}
            {group(<>{ctrl.label(`Rotation — ${selectedEl.rotation || 0}°`)}{ctrl.range({ min: 0, max: 360, value: selectedEl.rotation || 0, onChange: (e) => onUpdateProp("rotation", +e.target.value) })}</>)}
          </>
        )}
      </div>
    </div>
  );
}