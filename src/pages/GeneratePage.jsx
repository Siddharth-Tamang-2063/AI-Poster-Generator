import { useState } from "react";
import { COLORS, PLATFORMS } from "../constants";

const IMAGE_MODELS = ["FLUX.2 Klein", "FLUX.1 Schnell", "FLUX.1 Dev (HF)"];
const IMAGE_TYPES = [
  "Marketing banner",
  "Product poster",
  "Event flyer",
  "Social ad",
  "Editorial graphic",
  "Cinematic scene",
];
const VISUAL_STYLES = [
  "Photorealistic",
  "Premium 3D",
  "Minimal modern",
  "Bold graphic",
  "Luxury editorial",
  "Anime inspired",
];
const LIGHTING_OPTIONS = [
  "Studio lighting",
  "Natural daylight",
  "Cinematic contrast",
  "Soft glow",
  "Neon lighting",
  "Dramatic shadows",
];
const COLOR_MOODS = [
  "Brand-friendly",
  "Vibrant",
  "Pastel",
  "Monochrome",
  "Warm",
  "Cool",
];
const COMPOSITIONS = [
  "Centered subject",
  "Left text space",
  "Right text space",
  "Rule of thirds",
  "Wide hero layout",
  "Close-up detail",
];
const DETAIL_LEVELS = [
  "Balanced",
  "High detail",
  "Clean and simple",
  "Ultra detailed",
];

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0f0f0f",
  surface: "#161616",
  surface2: "#1e1e1e",
  surface3: "#262626",
  border: "#2a2a2a",
  borderHover: "#3a3a3a",
  text: "#f0ede8",
  text2: "#9a9690",
  text3: "#5a5854",
  accent: "#8b7ff5",
  accentHover: "#9d92f7",
  accentDim: "rgba(139,127,245,0.12)",
  danger: "#e05858",
  radius: "6px",
};

// ─── Shared style objects ─────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  color: T.text,
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: "13px",
  padding: "10px 12px",
  outline: "none",
  WebkitAppearance: "none",
  appearance: "none",
  transition: "border-color 0.15s",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5854' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "32px",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: T.text3,
  marginBottom: "8px",
};

const sectionLabelStyle = {
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: T.text3,
  marginBottom: "16px",
};

const dividerStyle = {
  height: "1px",
  background: T.border,
  margin: "28px 0",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Field = ({ label, children, style }) => (
  <div style={{ marginBottom: "20px", ...style }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const SelectField = ({ label, value, onChange, options, style }) => (
  <Field label={label} style={style}>
    <select
      style={selectStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </Field>
);

const Grid = ({ cols, gap = 12, children, style }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────
const shimmerKeyframes = `
@keyframes shimmer {
  0%   { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}`;

const ShimmerBlock = ({ width, height, mb }) => (
  <div
    style={{
      width,
      height,
      borderRadius: "4px",
      marginBottom: mb,
      background: `linear-gradient(90deg, ${T.surface} 25%, ${T.surface2} 50%, ${T.surface} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }}
  />
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function GeneratePage({ onGenerate }) {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [platform, setPlatform] = useState(0);
  const [model, setModel] = useState(IMAGE_MODELS[0]);
  const [imageType, setImageType] = useState(IMAGE_TYPES[0]);
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0]);
  const [lighting, setLighting] = useState(LIGHTING_OPTIONS[0]);
  const [colorMood, setColorMood] = useState(COLOR_MOODS[0]);
  const [composition, setComposition] = useState(COMPOSITIONS[0]);
  const [detailLevel, setDetailLevel] = useState(DETAIL_LEVELS[0]);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const selectedPlatform = PLATFORMS[platform];
  const hasInput = topic.trim().length > 0;

  const getOptions = () => ({
    imageType,
    visualStyle,
    lighting,
    colorMood,
    composition,
    detailLevel,
    negativePrompt: negativePrompt.trim(),
  });

  const handleOptimize = async () => {
    if (!hasInput) return;
    setOptimizing(true);
    setError("");

    const fullPrompt = [
      `Topic: ${topic.trim()}`,
      context.trim() && `Context: ${context.trim()}`,
      `Image type: ${imageType}`,
      `Visual style: ${visualStyle}`,
      `Lighting: ${lighting}`,
      `Color mood: ${colorMood}`,
      `Composition: ${composition}`,
      `Detail level: ${detailLevel}`,
      negativePrompt.trim() && `Avoid: ${negativePrompt.trim()}`,
      `Platform: ${selectedPlatform.label}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch(`${apiUrl}/api/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, targetModel: model }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Prompt optimization failed.");

      if (data.topic) setTopic(data.topic);
      if (data.context) setContext(data.context);
      if (data.negativePrompt !== undefined)
        setNegativePrompt(data.negativePrompt);
      if (data.visualStyle && VISUAL_STYLES.includes(data.visualStyle))
        setVisualStyle(data.visualStyle);
      if (data.lighting && LIGHTING_OPTIONS.includes(data.lighting))
        setLighting(data.lighting);
      if (data.colorMood && COLOR_MOODS.includes(data.colorMood))
        setColorMood(data.colorMood);
      if (data.composition && COMPOSITIONS.includes(data.composition))
        setComposition(data.composition);
      if (data.imageType && IMAGE_TYPES.includes(data.imageType))
        setImageType(data.imageType);
      if (data.detailLevel && DETAIL_LEVELS.includes(data.detailLevel))
        setDetailLevel(data.detailLevel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Prompt optimization failed.",
      );
    } finally {
      setOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    if (!hasInput) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        prompt: topic.trim(),
        context: context.trim(),
        targetModel: model,
        model,
        platform: selectedPlatform.name,
        width: selectedPlatform.w,
        height: selectedPlatform.h,
        options: getOptions(),
      };

      const copyRequest = fetch(`${apiUrl}/api/generate-copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error || "Copy generation failed.");
          return data;
        })
        .catch(() => null);

      const response = await fetch(`${apiUrl}/api/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Image generation failed.");
      const generatedCopy = await copyRequest;

      onGenerate({
        imageUrl: data.imageUrl,
        platform: selectedPlatform.name,
        width: selectedPlatform.w,
        height: selectedPlatform.h,
        topic: topic.trim(),
        context: context.trim(),
        copy: generatedCopy,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <style>{shimmerKeyframes}</style>

      <div style={{ width: "100%", maxWidth: "680px" }}>
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: T.accent,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: T.text2,
            }}
          >
            PosterAI <span style={{ color: T.text }}>Studio</span>
          </span>
        </div>

        {loading ? (
          /* ── Loading skeleton ── */
          <div>
            <ShimmerBlock width="45%" height={14} mb={14} />
            <ShimmerBlock width="100%" height={100} mb={10} />
            <ShimmerBlock width="70%" height={12} mb={8} />
            <ShimmerBlock width="55%" height={12} mb={8} />
            <p
              style={{
                fontSize: "12px",
                color: T.text3,
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Generating your image…
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {/* Tag */}
            <div
              style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: T.accent,
                background: T.accentDim,
                borderRadius: "3px",
                padding: "2px 6px",
                marginBottom: "20px",
              }}
            >
              AI image generator
            </div>

            <h1
              style={{
                fontSize: "22px",
                fontWeight: 500,
                color: T.text,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              What are you making?
            </h1>
            <p
              style={{ color: T.text2, fontSize: "13px", marginBottom: "36px" }}
            >
              Describe it, set your options, generate.
            </p>

            {/* Subject */}
            <Field label="Subject">
              <input
                style={inputStyle}
                type="text"
                placeholder="Summer sale, product launch, event poster…"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </Field>

            {/* Context */}
            <Field label="Context">
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "80px",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                placeholder="50% off all items this weekend only. Minimal design, dark background."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </Field>

            <div style={dividerStyle} />

            {/* Output settings */}
            <div style={sectionLabelStyle}>Output settings</div>
            <Grid cols={2} style={{ marginBottom: "0" }}>
              <Field label="Format" style={{ marginBottom: 0 }}>
                <select
                  style={selectStyle}
                  value={platform}
                  onChange={(e) => setPlatform(+e.target.value)}
                >
                  {PLATFORMS.map((p, i) => (
                    <option key={p.name} value={i}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>
              <SelectField
                label="AI model"
                value={model}
                onChange={setModel}
                options={IMAGE_MODELS}
                style={{ marginBottom: 0 }}
              />
            </Grid>

            <div style={dividerStyle} />

            {/* Visual style */}
            <div style={sectionLabelStyle}>Visual style</div>
            <Grid cols={3} style={{ marginBottom: "12px" }}>
              <SelectField
                label="Image type"
                value={imageType}
                onChange={setImageType}
                options={IMAGE_TYPES}
                style={{ marginBottom: 0 }}
              />
              <SelectField
                label="Style"
                value={visualStyle}
                onChange={setVisualStyle}
                options={VISUAL_STYLES}
                style={{ marginBottom: 0 }}
              />
              <SelectField
                label="Lighting"
                value={lighting}
                onChange={setLighting}
                options={LIGHTING_OPTIONS}
                style={{ marginBottom: 0 }}
              />
            </Grid>
            <Grid cols={3}>
              <SelectField
                label="Color mood"
                value={colorMood}
                onChange={setColorMood}
                options={COLOR_MOODS}
                style={{ marginBottom: 0 }}
              />
              <SelectField
                label="Composition"
                value={composition}
                onChange={setComposition}
                options={COMPOSITIONS}
                style={{ marginBottom: 0 }}
              />
              <SelectField
                label="Detail"
                value={detailLevel}
                onChange={setDetailLevel}
                options={DETAIL_LEVELS}
                style={{ marginBottom: 0 }}
              />
            </Grid>

            <div style={dividerStyle} />

            {/* Avoid */}
            <Field label="Avoid" style={{ marginBottom: 0 }}>
              <input
                style={inputStyle}
                type="text"
                placeholder="Blurry text, extra fingers, low quality, distorted logo"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            </Field>

            {/* Buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "28px",
              }}
            >
              <button
                onClick={handleOptimize}
                disabled={!hasInput || optimizing}
                style={{
                  padding: "11px 16px",
                  background: T.surface2,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius,
                  color: hasInput && !optimizing ? T.text2 : T.text3,
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: hasInput && !optimizing ? "pointer" : "not-allowed",
                  opacity: hasInput && !optimizing ? 1 : 0.35,
                  transition: "all 0.15s",
                }}
              >
                {optimizing ? "Optimizing…" : "Optimize prompt"}
              </button>

              <button
                onClick={handleGenerate}
                disabled={!hasInput}
                style={{
                  padding: "11px 16px",
                  background: hasInput ? T.accent : T.surface3,
                  border: "none",
                  borderRadius: T.radius,
                  color: "#fff",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: hasInput ? "pointer" : "not-allowed",
                  opacity: hasInput ? 1 : 0.35,
                  transition: "all 0.15s",
                }}
              >
                Generate image
              </button>
            </div>

            {error && (
              <p
                style={{
                  color: T.danger,
                  fontSize: "12px",
                  marginTop: "12px",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
