import { COLORS } from "../constants";
export default function Toolbar({
  platform,
  width,
  height,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onDownload,

  // 🔥 ADD THESE
  scale,
  onZoomIn,
  onZoomOut,
}) {
  const tbBtn = (onClick, disabled, primary, children) => (
    <button onClick={onClick} disabled={disabled} style={{
      display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.75rem",
      background: primary ? COLORS.accent : COLORS.surface2, border: `1px solid ${primary ? COLORS.accent : COLORS.border}`,
      borderRadius: 7, color: disabled ? COLORS.text3 : primary ? "#fff" : COLORS.text2,
      fontSize: "0.75rem", fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap",
    }}>{children}</button>
  );

  return (
    <div style={{
      position: "absolute", top: 0, left: 220, right: 260, height: 52, background: COLORS.surface,
      borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 1rem",
      gap: "0.5rem", zIndex: 10,
    }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.text2, marginRight: "auto", letterSpacing: "0.05em" }}>
        <strong style={{ color: COLORS.text }}>{platform}</strong> — {width}×{height}
      </span>
      <div style={{
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginRight: "0.5rem",
  padding: "0 0.5rem",
  borderLeft: `1px solid ${COLORS.border}`,
  borderRight: `1px solid ${COLORS.border}`,
}}>

  <button
    onClick={onZoomOut}
    style={{
      padding: "0.25rem 0.5rem",
      background: COLORS.surface2,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 6,
      cursor: "pointer",
      color: COLORS.text2,
    }}
  >
    −
  </button>

  <span style={{
    fontSize: "0.75rem",
    minWidth: "50px",
    textAlign: "center",
    color: COLORS.text2,
  }}>
    {Math.round(scale * 100)}%
  </span>

  <button
    onClick={onZoomIn}
    style={{
      padding: "0.25rem 0.5rem",
      background: COLORS.surface2,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 6,
      cursor: "pointer",
      color: COLORS.text2,
    }}
  >
    +
  </button>

</div>
      {tbBtn(onUndo, !canUndo, false, <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" /></svg>Undo</>)}
      {tbBtn(onRedo, !canRedo, false, <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" /></svg>Redo</>)}
      {tbBtn(onReset, false, false, <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 2v6h6M21.5 22v-6h-6" /><path d="M22 11.5A10 10 0 003.2 7.2M2 12.5a10 10 0 0018.8 4.2" /></svg>Reset</>)}
      {tbBtn(onDownload, false, true, <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download PNG</>)}
    </div>
  );
}
