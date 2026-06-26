import { uid } from "../utils/id";

export const TEMPLATE_NAMES = [
  "Cinematic Split",
  "Luxury Card",
  "Neon Strike",
  "Editorial Grid",
  "Bold Hero",
  "Glass Morph",
];

/** Builds rich starter layouts sized for the given canvas and seeded with topic/context text. */
export function getTemplates(W, H, topic, context, copy = {}) {
  const fs = (r) => Math.round(W * r);
  const clean = (value, fallback) =>
    typeof value === "string" && value.trim() ? value.trim() : fallback;
  const headline = clean(copy.headline, topic || "Your Headline");
  const subheadline = clean(copy.subheadline, context || "Add your message here");
  const eyebrow = clean(copy.eyebrow, "Featured").toUpperCase();
  const cta = clean(copy.cta, "Explore Now");
  const footer = clean(copy.footer, "Available now");
  const detail = clean(copy.detail, subheadline);

  const headlines = [
    "Your Headline",
    "Brand Name",
    "Stand Out",
    "Your Title",
    "Big Idea",
    "Your Product",
  ];
  const subtexts = [
    "Add your tagline here",
    "Est. 2024  ·  Premium Quality",
    "Add your message here",
    "Add your description here",
    "Describe your offer",
    "Add your description here",
  ];

  return [
    // ── 0: Cinematic Split ──────────────────────────────────────────────
    {
      name: "Cinematic Split",
      elements: [
        // Dark overlay left half
        { id: uid(), type: "shape", x: 0, y: 0, width: W * 0.52, height: H, rotation: 0, draggable: true, fill: "#000000", opacity: 0.82, cornerRadius: 0 },
        // Accent diagonal slash
        { id: uid(), type: "shape", x: W * 0.44, y: -H * 0.1, width: W * 0.14, height: H * 1.2, rotation: -8, draggable: true, fill: "#7c6dfa", opacity: 0.9, cornerRadius: 0 },
        // Top label pill
        { id: uid(), type: "shape", x: W * 0.05, y: H * 0.08, width: W * 0.22, height: H * 0.045, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 1, cornerRadius: 20 },
        { id: uid(), type: "text", x: W * 0.05, y: H * 0.082, width: W * 0.22, height: H * 0.04, rotation: 0, draggable: true, text: eyebrow, fontSize: fs(0.018), fontFamily: "Inter", fill: "#ffffff", fontStyle: "bold", align: "center", opacity: 1 },
        // Main headline
        { id: uid(), type: "text", x: W * 0.05, y: H * 0.2, width: W * 0.42, height: H * 0.28, rotation: 0, draggable: true, text: headline, fontSize: fs(0.078), fontFamily: "Syne", fill: "#ffffff", fontStyle: "bold", align: "left", opacity: 1 },
        // Accent line
        { id: uid(), type: "shape", x: W * 0.05, y: H * 0.5, width: W * 0.08, height: 4, rotation: 0, draggable: true, fill: "#a78bfa", opacity: 1, cornerRadius: 2 },
        // Subtext
        { id: uid(), type: "text", x: W * 0.05, y: H * 0.54, width: W * 0.42, height: H * 0.1, rotation: 0, draggable: true, text: subheadline, fontSize: fs(0.024), fontFamily: "Inter", fill: "#c4c4d8", fontStyle: "", align: "left", opacity: 1 },
        // CTA button
        { id: uid(), type: "shape", x: W * 0.05, y: H * 0.68, width: W * 0.24, height: H * 0.07, rotation: 0, draggable: true, fill: "#ffffff", opacity: 1, cornerRadius: 8 },
        { id: uid(), type: "text", x: W * 0.05, y: H * 0.685, width: W * 0.24, height: H * 0.06, rotation: 0, draggable: true, text: cta, fontSize: fs(0.022), fontFamily: "Inter", fill: "#0a0a0f", fontStyle: "bold", align: "center", opacity: 1 },
      ],
    },

    // ── 1: Luxury Card ──────────────────────────────────────────────────
    {
      name: "Luxury Card",
      elements: [
        // Gold top border
        { id: uid(), type: "shape", x: 0, y: 0, width: W, height: H * 0.006, rotation: 0, draggable: true, fill: "#c9a84c", opacity: 1, cornerRadius: 0 },
        // Outer frame
        { id: uid(), type: "shape", x: W * 0.04, y: H * 0.04, width: W * 0.92, height: H * 0.92, rotation: 0, draggable: true, fill: "transparent", opacity: 1, cornerRadius: 3, stroke: "#c9a84c", strokeWidth: 1 },
        // Inner frame
        { id: uid(), type: "shape", x: W * 0.07, y: H * 0.07, width: W * 0.86, height: H * 0.86, rotation: 0, draggable: true, fill: "transparent", opacity: 1, cornerRadius: 2, stroke: "#c9a84c", strokeWidth: 0.5 },
        // Corner accent TL
        { id: uid(), type: "shape", x: W * 0.04, y: H * 0.04, width: W * 0.06, height: H * 0.06, rotation: 0, draggable: true, fill: "#c9a84c", opacity: 1, cornerRadius: 0 },
        // Corner accent BR
        { id: uid(), type: "shape", x: W * 0.9, y: H * 0.9, width: W * 0.06, height: H * 0.06, rotation: 0, draggable: true, fill: "#c9a84c", opacity: 1, cornerRadius: 0 },
        // Decorative top text
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.13, width: W * 0.8, height: H * 0.06, rotation: 0, draggable: true, text: eyebrow, fontSize: fs(0.02), fontFamily: "Inter", fill: "#c9a84c", fontStyle: "", align: "center", opacity: 0.8 },
        // Divider line
        { id: uid(), type: "shape", x: W * 0.35, y: H * 0.21, width: W * 0.3, height: 1, rotation: 0, draggable: true, fill: "#c9a84c", opacity: 0.5, cornerRadius: 1 },
        // Main headline
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.32, width: W * 0.8, height: H * 0.22, rotation: 0, draggable: true, text: headline, fontSize: fs(0.085), fontFamily: "Syne", fill: "#f5e6c8", fontStyle: "bold", align: "center", opacity: 1 },
        // Center divider
        { id: uid(), type: "shape", x: W * 0.3, y: H * 0.56, width: W * 0.4, height: 1, rotation: 0, draggable: true, fill: "#c9a84c", opacity: 0.6, cornerRadius: 1 },
        // Subtext
        { id: uid(), type: "text", x: W * 0.15, y: H * 0.6, width: W * 0.7, height: H * 0.1, rotation: 0, draggable: true, text: subheadline, fontSize: fs(0.026), fontFamily: "Inter", fill: "#c9a84c", fontStyle: "", align: "center", opacity: 0.85 },
        // Bottom label
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.8, width: W * 0.8, height: H * 0.05, rotation: 0, draggable: true, text: footer, fontSize: fs(0.016), fontFamily: "Inter", fill: "#c9a84c", fontStyle: "", align: "center", opacity: 0.5 },
      ],
    },

    // ── 2: Neon Strike ──────────────────────────────────────────────────
    {
      name: "Neon Strike",
      elements: [
        // Neon horizontal bar top
        { id: uid(), type: "shape", x: 0, y: H * 0.12, width: W, height: H * 0.004, rotation: 0, draggable: true, fill: "#00ffcc", opacity: 0.7, cornerRadius: 0 },
        // Neon horizontal bar bottom
        { id: uid(), type: "shape", x: 0, y: H * 0.88, width: W, height: H * 0.004, rotation: 0, draggable: true, fill: "#00ffcc", opacity: 0.7, cornerRadius: 0 },
        // Left vertical neon
        { id: uid(), type: "shape", x: W * 0.06, y: H * 0.12, width: 3, height: H * 0.76, rotation: 0, draggable: true, fill: "#a78bfa", opacity: 0.8, cornerRadius: 0 },
        // Glitch block 1
        { id: uid(), type: "shape", x: 0, y: H * 0.38, width: W * 0.15, height: H * 0.06, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 0.4, cornerRadius: 0 },
        // Glitch block 2
        { id: uid(), type: "shape", x: W * 0.72, y: H * 0.55, width: W * 0.28, height: H * 0.04, rotation: 0, draggable: true, fill: "#00ffcc", opacity: 0.2, cornerRadius: 0 },
        // Top tag
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.15, width: W * 0.5, height: H * 0.05, rotation: 0, draggable: true, text: "// FUTURE.VISION", fontSize: fs(0.02), fontFamily: "Courier New", fill: "#00ffcc", fontStyle: "", align: "left", opacity: 0.9 },
        // Main headline
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.28, width: W * 0.85, height: H * 0.3, rotation: 0, draggable: true, text: headlines[2], fontSize: fs(0.09), fontFamily: "Syne", fill: "#ffffff", fontStyle: "bold", align: "left", opacity: 1 },
        // Neon accent line under headline
        { id: uid(), type: "shape", x: W * 0.1, y: H * 0.6, width: W * 0.35, height: 3, rotation: 0, draggable: true, fill: "#00ffcc", opacity: 1, cornerRadius: 2 },
        // Subtext
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.65, width: W * 0.75, height: H * 0.1, rotation: 0, draggable: true, text: subtexts[2], fontSize: fs(0.024), fontFamily: "Inter", fill: "#9191a8", fontStyle: "", align: "left", opacity: 1 },
        // CTA
        { id: uid(), type: "shape", x: W * 0.1, y: H * 0.78, width: W * 0.26, height: H * 0.065, rotation: 0, draggable: true, fill: "transparent", opacity: 1, cornerRadius: 4, stroke: "#00ffcc", strokeWidth: 2 },
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.784, width: W * 0.26, height: H * 0.055, rotation: 0, draggable: true, text: "GET STARTED", fontSize: fs(0.019), fontFamily: "Inter", fill: "#00ffcc", fontStyle: "bold", align: "center", opacity: 1 },
      ],
    },

    // ── 3: Editorial Grid ───────────────────────────────────────────────
    {
      name: "Editorial Grid",
      elements: [
        // Top bar
        { id: uid(), type: "shape", x: 0, y: 0, width: W, height: H * 0.09, rotation: 0, draggable: true, fill: "#f0f0f8", opacity: 1, cornerRadius: 0 },
        { id: uid(), type: "text", x: W * 0.04, y: H * 0.01, width: W * 0.4, height: H * 0.07, rotation: 0, draggable: true, text: "POSTER AI", fontSize: fs(0.038), fontFamily: "Syne", fill: "#0a0a0f", fontStyle: "bold", align: "left", opacity: 1 },
        { id: uid(), type: "text", x: W * 0.55, y: H * 0.025, width: W * 0.4, height: H * 0.04, rotation: 0, draggable: true, text: "VOL. 01  ·  2024", fontSize: fs(0.018), fontFamily: "Inter", fill: "#5a5a72", fontStyle: "", align: "right", opacity: 1 },
        // Thick left accent
        { id: uid(), type: "shape", x: W * 0.04, y: H * 0.14, width: 6, height: H * 0.28, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 1, cornerRadius: 3 },
        // Main headline
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.13, width: W * 0.86, height: H * 0.3, rotation: 0, draggable: true, text: headlines[3], fontSize: fs(0.088), fontFamily: "Syne", fill: "#f0f0f8", fontStyle: "bold", align: "left", opacity: 1 },
        // Horizontal rule
        { id: uid(), type: "shape", x: W * 0.04, y: H * 0.46, width: W * 0.92, height: 1, rotation: 0, draggable: true, fill: "#2a2a3d", opacity: 1, cornerRadius: 0 },
        // Column 1 text
        { id: uid(), type: "text", x: W * 0.04, y: H * 0.5, width: W * 0.42, height: H * 0.22, rotation: 0, draggable: true, text: subtexts[3], fontSize: fs(0.026), fontFamily: "Inter", fill: "#c4c4d8", fontStyle: "", align: "left", opacity: 1 },
        // Column divider
        { id: uid(), type: "shape", x: W * 0.5, y: H * 0.5, width: 1, height: H * 0.22, rotation: 0, draggable: true, fill: "#2a2a3d", opacity: 1, cornerRadius: 0 },
        // Column 2 tag
        { id: uid(), type: "shape", x: W * 0.55, y: H * 0.5, width: W * 0.16, height: H * 0.04, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 1, cornerRadius: 4 },
        { id: uid(), type: "text", x: W * 0.55, y: H * 0.502, width: W * 0.16, height: H * 0.036, rotation: 0, draggable: true, text: "FEATURED", fontSize: fs(0.016), fontFamily: "Inter", fill: "#fff", fontStyle: "bold", align: "center", opacity: 1 },
        { id: uid(), type: "text", x: W * 0.55, y: H * 0.56, width: W * 0.4, height: H * 0.16, rotation: 0, draggable: true, text: "Premium design tools for modern creators.", fontSize: fs(0.026), fontFamily: "Inter", fill: "#9191a8", fontStyle: "", align: "left", opacity: 1 },
        // Bottom bar
        { id: uid(), type: "shape", x: 0, y: H * 0.92, width: W, height: H * 0.08, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 1, cornerRadius: 0 },
        { id: uid(), type: "text", x: W * 0.04, y: H * 0.933, width: W * 0.9, height: H * 0.05, rotation: 0, draggable: true, text: "www.yourwebsite.com  ·  @yourhandle", fontSize: fs(0.02), fontFamily: "Inter", fill: "#ffffff", fontStyle: "", align: "center", opacity: 0.9 },
      ],
    },

    // ── 4: Bold Hero ────────────────────────────────────────────────────
    {
      name: "Bold Hero",
      elements: [
        // Full dark overlay
        { id: uid(), type: "shape", x: 0, y: 0, width: W, height: H, rotation: 0, draggable: true, fill: "#0a0a0f", opacity: 0.75, cornerRadius: 0 },
        // Large background circle
        { id: uid(), type: "shape", x: W * 0.35, y: -H * 0.15, width: W * 0.85, height: W * 0.85, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 0.12, cornerRadius: W * 0.5 },
        // Medium circle
        { id: uid(), type: "shape", x: W * 0.5, y: H * 0.55, width: W * 0.55, height: W * 0.55, rotation: 0, draggable: true, fill: "#a78bfa", opacity: 0.08, cornerRadius: W * 0.3 },
        // Eyebrow label
        { id: uid(), type: "text", x: W * 0.06, y: H * 0.18, width: W * 0.6, height: H * 0.05, rotation: 0, draggable: true, text: "— INTRODUCING", fontSize: fs(0.02), fontFamily: "Inter", fill: "#a78bfa", fontStyle: "", align: "left", opacity: 1 },
        // Giant headline
        { id: uid(), type: "text", x: W * 0.06, y: H * 0.24, width: W * 0.88, height: H * 0.38, rotation: 0, draggable: true, text: headlines[4], fontSize: fs(0.1), fontFamily: "Syne", fill: "#ffffff", fontStyle: "bold", align: "left", opacity: 1 },
        // Purple underline accent
        { id: uid(), type: "shape", x: W * 0.06, y: H * 0.64, width: W * 0.12, height: 5, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 1, cornerRadius: 3 },
        { id: uid(), type: "shape", x: W * 0.2, y: H * 0.64, width: W * 0.6, height: 5, rotation: 0, draggable: true, fill: "#2a2a3d", opacity: 1, cornerRadius: 3 },
        // Subtext
        { id: uid(), type: "text", x: W * 0.06, y: H * 0.7, width: W * 0.65, height: H * 0.1, rotation: 0, draggable: true, text: subtexts[4], fontSize: fs(0.027), fontFamily: "Inter", fill: "#9191a8", fontStyle: "", align: "left", opacity: 1 },
        // CTA pill
        { id: uid(), type: "shape", x: W * 0.06, y: H * 0.83, width: W * 0.28, height: H * 0.08, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 1, cornerRadius: 40 },
        { id: uid(), type: "text", x: W * 0.06, y: H * 0.835, width: W * 0.28, height: H * 0.07, rotation: 0, draggable: true, text: "Get Started →", fontSize: fs(0.024), fontFamily: "Inter", fill: "#ffffff", fontStyle: "bold", align: "center", opacity: 1 },
      ],
    },

    // ── 5: Glass Morph ──────────────────────────────────────────────────
    {
      name: "Glass Morph",
      elements: [
        // Background blobs
        { id: uid(), type: "shape", x: -W * 0.1, y: -H * 0.1, width: W * 0.7, height: W * 0.7, rotation: 0, draggable: true, fill: "#4f46e5", opacity: 0.35, cornerRadius: W * 0.5 },
        { id: uid(), type: "shape", x: W * 0.5, y: H * 0.4, width: W * 0.65, height: W * 0.65, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 0.25, cornerRadius: W * 0.4 },
        { id: uid(), type: "shape", x: W * 0.2, y: H * 0.6, width: W * 0.4, height: W * 0.4, rotation: 0, draggable: true, fill: "#a78bfa", opacity: 0.2, cornerRadius: W * 0.3 },
        // Glass card
        { id: uid(), type: "shape", x: W * 0.06, y: H * 0.22, width: W * 0.88, height: H * 0.56, rotation: 0, draggable: true, fill: "#ffffff", opacity: 0.07, cornerRadius: 20, stroke: "#ffffff", strokeWidth: 1 },
        // Card inner highlight
        { id: uid(), type: "shape", x: W * 0.07, y: H * 0.23, width: W * 0.86, height: H * 0.01, rotation: 0, draggable: true, fill: "#ffffff", opacity: 0.15, cornerRadius: 10 },
        // Tag
        { id: uid(), type: "shape", x: W * 0.12, y: H * 0.3, width: W * 0.2, height: H * 0.045, rotation: 0, draggable: true, fill: "#7c6dfa", opacity: 0.9, cornerRadius: 20 },
        { id: uid(), type: "text", x: W * 0.12, y: H * 0.302, width: W * 0.2, height: H * 0.04, rotation: 0, draggable: true, text: "PREMIUM", fontSize: fs(0.017), fontFamily: "Inter", fill: "#fff", fontStyle: "bold", align: "center", opacity: 1 },
        // Headline
        { id: uid(), type: "text", x: W * 0.1, y: H * 0.38, width: W * 0.8, height: H * 0.22, rotation: 0, draggable: true, text: headlines[5], fontSize: fs(0.078), fontFamily: "Syne", fill: "#ffffff", fontStyle: "bold", align: "center", opacity: 1 },
        // Divider
        { id: uid(), type: "shape", x: W * 0.35, y: H * 0.62, width: W * 0.3, height: 1, rotation: 0, draggable: true, fill: "#ffffff", opacity: 0.2, cornerRadius: 1 },
        // Subtext
        { id: uid(), type: "text", x: W * 0.12, y: H * 0.65, width: W * 0.76, height: H * 0.08, rotation: 0, draggable: true, text: subtexts[5], fontSize: fs(0.025), fontFamily: "Inter", fill: "#c4c4d8", fontStyle: "", align: "center", opacity: 0.9 },
        // Bottom CTA
        { id: uid(), type: "shape", x: W * 0.3, y: H * 0.76, width: W * 0.4, height: H * 0.065, rotation: 0, draggable: true, fill: "#ffffff", opacity: 0.12, cornerRadius: 10, stroke: "#ffffff", strokeWidth: 1 },
        { id: uid(), type: "text", x: W * 0.3, y: H * 0.763, width: W * 0.4, height: H * 0.058, rotation: 0, draggable: true, text: "Discover More", fontSize: fs(0.022), fontFamily: "Inter", fill: "#ffffff", fontStyle: "bold", align: "center", opacity: 1 },
      ],
    },
  ];
}

/** Renders a mini thumbnail of template idx onto a 2D context. */
export function drawTemplateMiniPreview(cx, idx, w, h) {
  const accent = "#7c6dfa";
  const accent2 = "#a78bfa";
  const gold = "#c9a84c";
  const neon = "#00ffcc";
  const white = "#f0f0f8";

  cx.fillStyle = "#0a0a0f";
  cx.fillRect(0, 0, w, h);

  switch (idx) {
    case 0: { // Cinematic Split
      cx.fillStyle = "rgba(0,0,0,0.82)";
      cx.fillRect(0, 0, w * 0.52, h);
      cx.fillStyle = accent;
      cx.save(); cx.translate(w * 0.51, -h * 0.1); cx.rotate(-0.14);
      cx.fillRect(0, 0, w * 0.14, h * 1.2); cx.restore();
      cx.fillStyle = white; cx.font = "bold 11px Inter";
      cx.fillText("CINEMATIC", w * 0.06, h * 0.45);
      cx.fillStyle = accent; cx.fillRect(w * 0.06, h * 0.7, w * 0.22, h * 0.07);
      break;
    }
    case 1: { // Luxury Card
      cx.strokeStyle = gold; cx.lineWidth = 2;
      cx.strokeRect(w * 0.06, h * 0.06, w * 0.88, h * 0.88);
      cx.fillStyle = gold; cx.fillRect(w * 0.06, h * 0.06, w * 0.1, h * 0.1);
      cx.fillRect(w * 0.84, h * 0.84, w * 0.1, h * 0.1);
      cx.fillStyle = gold; cx.font = "10px Inter";
      cx.textAlign = "center"; cx.fillText("LUXURY", w / 2, h * 0.55);
      cx.textAlign = "left";
      break;
    }
    case 2: { // Neon Strike
      cx.fillStyle = neon; cx.fillRect(0, h * 0.12, w, 2);
      cx.fillRect(0, h * 0.88, w, 2);
      cx.fillStyle = accent2; cx.fillRect(w * 0.08, h * 0.12, 2, h * 0.76);
      cx.fillStyle = white; cx.font = "bold 10px Inter";
      cx.fillText("NEON", w * 0.12, h * 0.52);
      cx.strokeStyle = neon; cx.lineWidth = 1.5;
      cx.strokeRect(w * 0.12, h * 0.7, w * 0.3, h * 0.1);
      break;
    }
    case 3: { // Editorial Grid
      cx.fillStyle = white; cx.fillRect(0, 0, w, h * 0.1);
      cx.fillStyle = "#0a0a0f"; cx.font = "bold 9px Inter";
      cx.fillText("EDITORIAL", w * 0.04, h * 0.075);
      cx.fillStyle = accent; cx.fillRect(w * 0.04, h * 0.15, 4, h * 0.26);
      cx.fillStyle = white; cx.font = "bold 11px Inter";
      cx.fillText("GRID", w * 0.1, h * 0.33);
      cx.fillStyle = "#2a2a3d"; cx.fillRect(w * 0.04, h * 0.47, w * 0.92, 1);
      cx.fillStyle = accent; cx.fillRect(0, h * 0.9, w, h * 0.1);
      break;
    }
    case 4: { // Bold Hero
      cx.fillStyle = accent; cx.globalAlpha = 0.12;
      cx.beginPath(); cx.arc(w * 0.75, h * 0.2, w * 0.45, 0, Math.PI * 2); cx.fill();
      cx.globalAlpha = 1;
      cx.fillStyle = accent2; cx.font = "9px Inter";
      cx.fillText("— INTRODUCING", w * 0.06, h * 0.28);
      cx.fillStyle = white; cx.font = "bold 12px Inter";
      cx.fillText("BOLD", w * 0.06, h * 0.48);
      cx.fillStyle = accent; cx.fillRect(w * 0.06, h * 0.56, w * 0.1, 3);
      cx.fillStyle = "#2a2a3d"; cx.fillRect(w * 0.18, h * 0.56, w * 0.55, 3);
      cx.fillStyle = accent; cx.fillRect(w * 0.06, h * 0.76, w * 0.26, h * 0.1);
      break;
    }
    case 5: { // Glass Morph
      cx.fillStyle = "#4f46e5"; cx.globalAlpha = 0.35;
      cx.beginPath(); cx.arc(w * 0.2, h * 0.2, w * 0.35, 0, Math.PI * 2); cx.fill();
      cx.fillStyle = accent; cx.globalAlpha = 0.25;
      cx.beginPath(); cx.arc(w * 0.75, h * 0.7, w * 0.3, 0, Math.PI * 2); cx.fill();
      cx.globalAlpha = 0.08;
      cx.fillStyle = white;
      cx.beginPath();
      cx.roundRect?.(w * 0.06, h * 0.25, w * 0.88, h * 0.5, 10);
      cx.fill();
      cx.globalAlpha = 1;
      cx.fillStyle = white; cx.font = "bold 10px Inter";
      cx.textAlign = "center"; cx.fillText("GLASS", w / 2, h * 0.54);
      cx.textAlign = "left";
      break;
    }
    default: break;
  }
}
