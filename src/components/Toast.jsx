import { COLORS } from "../constants";

export default function Toast({ toasts }) {
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 9999,
      display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center", pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: "0.6rem 1.2rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 500,
          display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "toastIn 0.25s ease", whiteSpace: "nowrap",
          background: t.type === "success" ? "#0f2a22" : t.type === "error" ? "#2a0f0f" : COLORS.surface,
          border: `1px solid ${t.type === "success" ? COLORS.success : t.type === "error" ? COLORS.danger : COLORS.border}`,
          color: t.type === "success" ? COLORS.success : t.type === "error" ? COLORS.danger : COLORS.text2,
        }}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "·"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
