import { COLORS } from "../constants";

/** Small styled form-field primitives shared by the property inspector. */
export const ctrl = {
  label: (text) => (
    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: COLORS.text3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.45rem" }}>
      {text}
    </span>
  ),
  input: (props) => (
    <input {...props} style={{ width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 7, color: COLORS.text, fontSize: "0.8rem", padding: "0.45rem 0.65rem", outline: "none", fontFamily: "Inter" }} />
  ),
  textarea: (props) => (
    <textarea {...props} style={{ width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 7, color: COLORS.text, fontSize: "0.8rem", padding: "0.45rem 0.65rem", outline: "none", fontFamily: "Inter", resize: "vertical", minHeight: 60 }} />
  ),
  select: ({ children, ...props }) => (
    <select {...props} style={{ width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 7, color: COLORS.text, fontSize: "0.8rem", padding: "0.45rem 0.65rem", outline: "none", cursor: "pointer" }}>
      {children}
    </select>
  ),
  range: (props) => (
    <input type="range" {...props} style={{ width: "100%", accentColor: COLORS.accent, cursor: "pointer" }} />
  ),
  color: (props) => (
    <input type="color" {...props} style={{ width: "100%", height: 34, background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 7, cursor: "pointer", padding: 2 }} />
  ),
};

export const group = (children) => <div style={{ marginBottom: "1rem" }}>{children}</div>;

export const toggleBtn = (active, onClick, children) => (
  <button onClick={onClick} style={{
    flex: 1, padding: "0.4rem", background: active ? COLORS.accent : COLORS.surface2,
    border: `1px solid ${active ? COLORS.accent : COLORS.border}`, borderRadius: 7,
    color: active ? "#fff" : COLORS.text2, fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", textAlign: "center",
  }}>{children}</button>
);
