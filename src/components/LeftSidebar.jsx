import { useEffect, useRef } from "react";
import { COLORS } from "../constants";
import { TEMPLATE_NAMES, drawTemplateMiniPreview } from "../canvas/templates";

export default function LeftSidebar({
  activeTemplate, onTemplateSelect, onBack, onAddText, onAddShape, onUploadImage, onDelete, hasSelection,
}) {
  const miniCanvasRefs = useRef([]);

  useEffect(() => {
    miniCanvasRefs.current.forEach((c, i) => {
      if (!c) return;
      const cx = c.getContext("2d");
      drawTemplateMiniPreview(cx, i, 200, 200);
    });
  }, []);

  const sidebarBtn = (onClick, children, disabled = false, accent = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "0.55rem 0.75rem",
        background: accent ? COLORS.accent : COLORS.surface2,
        border: `1px solid ${accent ? COLORS.accent : COLORS.border}`,
        borderRadius: 7,
        color: disabled ? COLORS.text3 : accent ? "#fff" : COLORS.text,
        fontSize: "0.78rem",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.4rem",
        transition: "background 0.15s, border-color 0.15s",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      style={{
        width: 230,
        minWidth: 230,
        height: "100vh",
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: 52,
        flexShrink: 0,
      }}
    >
      {/* Back button */}
      <div style={{ padding: "0.75rem", borderBottom: `1px solid ${COLORS.border}` }}>
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem",
            color: COLORS.text2,
            cursor: "pointer",
            padding: "0.45rem 0.6rem",
            background: COLORS.surface2,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 7,
            width: "100%",
            transition: "border-color 0.15s",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          New Design
        </button>
      </div>

      {/* Templates */}
      <div style={{ padding: "0.85rem", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, color: COLORS.text3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
          Templates
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {TEMPLATE_NAMES.map((name, i) => (
            <div
              key={i}
              onClick={() => onTemplateSelect(i)}
              title={name}
              style={{
                aspectRatio: "1",
                background: COLORS.surface2,
                border: `2px solid ${i === activeTemplate ? COLORS.accent : COLORS.border}`,
                borderRadius: 8,
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                transition: "border-color 0.15s, transform 0.1s",
                transform: i === activeTemplate ? "scale(1.03)" : "scale(1)",
              }}
            >
              <canvas
                ref={(el) => (miniCanvasRefs.current[i] = el)}
                width={200}
                height={200}
                style={{ width: "100%", height: "100%", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: i === activeTemplate ? COLORS.accent : "rgba(0,0,0,0.72)",
                  fontSize: "0.58rem",
                  color: "#fff",
                  padding: "3px 4px",
                  textAlign: "center",
                  fontWeight: i === activeTemplate ? 700 : 400,
                  letterSpacing: "0.03em",
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Elements */}
      <div style={{ padding: "0.85rem", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, color: COLORS.text3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
          Add Elements
        </div>
        <label
          style={{
            width: "100%",
            padding: "0.55rem 0.75rem",
            background: COLORS.surface2,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 7,
            color: COLORS.text,
            fontSize: "0.78rem",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.4rem",
            boxSizing: "border-box",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          Upload Image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: "none" }}
            onChange={(e) => onUploadImage(e.target.files[0])}
          />
        </label>
        {sidebarBtn(onAddText,
          <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h8M4 18h12" /></svg>Add Text</>
        )}
        {sidebarBtn(onAddShape,
          <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>Add Shape</>
        )}
      </div>

      {/* Selection */}
      <div style={{ padding: "0.85rem" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, color: COLORS.text3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
          Selection
        </div>
        {sidebarBtn(
          onDelete,
          <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>Delete Selected</>,
          !hasSelection
        )}
      </div>
    </div>
  );
}