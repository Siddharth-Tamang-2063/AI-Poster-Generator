import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const systemPrompt = `
You are a world-class AI image prompt engineer specializing in FLUX diffusion models.

The user provides their poster settings. Transform them into a visually stunning, production-ready image prompt by enriching every field with professional creative direction.

Return ONLY raw JSON — no markdown, no backticks, no explanation.

JSON shape:
{
  "topic": "Rich cinematic scene description. Include subject, environment, mood, materials, and atmosphere. Max 120 chars.",
  "context": "Enhanced supporting details — textures, depth, storytelling elements, product placement context. Max 120 chars.",
  "imageType": "one of: Marketing banner | Product poster | Event flyer | Social ad | Editorial graphic | Cinematic scene",
  "visualStyle": "one of: Photorealistic | Premium 3D | Minimal modern | Bold graphic | Luxury editorial | Anime inspired",
  "lighting": "one of: Studio lighting | Natural daylight | Cinematic contrast | Soft glow | Neon lighting | Dramatic shadows",
  "colorMood": "one of: Brand-friendly | Vibrant | Pastel | Monochrome | Warm | Cool",
  "composition": "one of: Centered subject | Left text space | Right text space | Rule of thirds | Wide hero layout | Close-up detail",
  "detailLevel": "one of: Balanced | High detail | Clean and simple | Ultra detailed",
  "negativePrompt": "blurry, distorted, low quality, oversaturated, flat lighting, extra limbs, text, watermark, logo. Max 100 chars."
}

Enrichment rules:
- Transform any simple product or topic into a vivid cinematic scene. Add environment, mood, surrounding elements, and atmosphere.
- ALWAYS replace any specific brand name, product name, or trademark with a generic visual descriptor that preserves the shape and category. Examples: iPhone → sleek glass smartphone, Nike → premium athletic shoe, Rolex → luxury timepiece, Lamborghini → exotic supercar, MacBook → ultra-thin laptop, Pepsi → chilled soda can. Apply this to ANY brand the user mentions.
- Add complementary textures and materials: brushed metal, frosted glass, silk fabric, polished marble, concrete, bokeh depth.
- Lighting should feel intentional — rim light, volumetric rays, gradient shadows, lens flare where appropriate.
- Color mood should feel cohesive — suggest dominant and accent tones that suit the product category.
- Always pick the most visually impactful options for dropdowns based on the product type.
- Never mention logos, brand names, trademarks, typography, or UI elements in the topic or context.
- NEVER include any words, letters, text, signs, labels, captions, or typography in the scene description. The image must be 100% text-free.
- Only pick values from the allowed options for dropdown fields.
- Return nothing except the JSON object.
`;
// ── HuggingFace client ────────────────────────────────────────────────────────
const copySystemPrompt = `
You are a senior social media copywriter for visual banners and posters.

The user provides the same prompt and settings used to generate an image. Write concise overlay copy that will fit inside a social media banner editor.

Return ONLY raw JSON - no markdown, no backticks, no explanation.

JSON shape:
{
  "eyebrow": "Short category, launch, or offer label. 2-4 words, max 24 chars.",
  "headline": "Punchy main headline. 2-6 words, max 38 chars.",
  "subheadline": "One clear supporting line. Max 86 chars.",
  "cta": "Short call to action. 1-3 words, max 18 chars.",
  "footer": "Tiny footer/contact/availability line. Max 46 chars.",
  "detail": "Extra short supporting phrase. Max 54 chars."
}

Rules:
- Match the user's topic, context, platform, and creative direction.
- If the user mentions an offer, event date, discount, product feature, or audience, use it.
- Do not invent URLs, phone numbers, prices, dates, discount percentages, or social handles.
- Avoid brand names unless the user explicitly provided them for the banner copy.
- Keep every field short enough for poster text overlays.
- Return nothing except the JSON object.
`;

const hf = new InferenceClient(process.env.HF_TOKEN);

/**
 * Image model registry:
 * - NVIDIA NIM for FLUX.2 Klein  -> OpenAI-compatible /v1/images/generations (integrate.api.nvidia.com)
 * - NVIDIA NIM for FLUX.1 Schnell -> NVIDIA native    /v1/genai/{model}       (ai.api.nvidia.com)
 * - Hugging Face for FLUX.1 Dev
 */
const IMAGE_MODEL_CONFIG = {
 "FLUX.2 Klein": {
  provider: "nvidia",
  schema: "native",
  modelId: "black-forest-labs/flux.2-klein-4b",
},
  "FLUX.1 Schnell": {
    provider: "nvidia",
    schema: "native", // openai or native
    modelId: process.env.NVIDIA_FLUX1_SCHNELL_MODEL || "black-forest-labs/flux.1-schnell",
  },
  "FLUX.1 Dev (HF)": {
    provider: "huggingface",
    modelId: process.env.HF_FLUX1_DEV_MODEL || "black-forest-labs/FLUX.1-dev",
    hfProvider: process.env.HF_FLUX1_DEV_PROVIDER || "fal-ai",
    steps: 28,
  },
};

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

// ── Prompt Optimization via Groq ──────────────────────────────────────────────

app.post("/api/optimize", async (req, res) => {
  const { prompt, targetModel } = req.body ?? {};

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.4,
        max_tokens: 300,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Target model: ${targetModel || "FLUX"}\n\n${prompt.trim()}` },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || `Groq API error: ${response.status}`);
    }

    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) throw new Error("Groq did not return a response.");

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Groq returned invalid JSON.");
    }

    return res.json(parsed); // send all fields back directly

  } catch (error) {
    console.error("[/api/optimize]", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to optimize prompt.",
    });
  }
});

// ── Image Generation ──────────────────────────────────────────────────────────

app.post("/api/generate-copy", async (req, res) => {
  const { prompt, context, platform, targetModel, options } = req.body ?? {};

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const userPrompt = [
      `Subject: ${prompt.trim()}`,
      context?.trim() && `Context: ${context.trim()}`,
      platform && `Platform: ${platform}`,
      targetModel && `Image model: ${targetModel}`,
      options?.imageType && `Image type: ${options.imageType}`,
      options?.visualStyle && `Visual style: ${options.visualStyle}`,
      options?.colorMood && `Color mood: ${options.colorMood}`,
      options?.composition && `Composition: ${options.composition}`,
    ].filter(Boolean).join("\n");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 260,
        messages: [
          { role: "system", content: copySystemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || `Groq API error: ${response.status}`);
    }

    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) throw new Error("Groq did not return copy.");

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Groq returned invalid copy JSON.");
    }

    return res.json(normalizeGeneratedCopy(parsed, prompt, context));
  } catch (error) {
    console.error("[/api/generate-copy]", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate banner copy.",
    });
  }
});

app.post("/api/generate-image", async (req, res) => {
  const { prompt, context, model, width, height, platform, options } = req.body ?? {};

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const selectedModel = model || "FLUX.2 Klein";
  const modelCfg = IMAGE_MODEL_CONFIG[selectedModel];

  if (!modelCfg) {
    return res.status(400).json({
      error: `Unsupported model: "${selectedModel}". Available: ${Object.keys(IMAGE_MODEL_CONFIG).join(", ")}`,
    });
  }

  const imagePrompt = buildImagePrompt({ prompt: prompt.trim(), context, platform, width, height, options });

  try {
    let imageUrl;

    if (modelCfg.provider === "nvidia") {
      imageUrl = await generateWithNvidiaNim(imagePrompt, modelCfg, width, height);
    } else if (modelCfg.provider === "huggingface") {
      imageUrl = await generateWithHuggingFace(imagePrompt, modelCfg, width, height);
    }

    return res.json({ imageUrl, model: selectedModel });
  } catch (error) {
    console.error("[/api/generate-image]", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate image.",
    });
  }
});

// ── NVIDIA NIM Image Generation ───────────────────────────────────────────────

function getNvidiaNimDimensions(width, height) {
  const normalize = (value) => {
    const num = Number(value) || 1024;
    const rounded = Math.round(num / 16) * 16;
    return Math.max(512, Math.min(1568, rounded));
  };

  let w = normalize(width);
  let h = normalize(height);

  const MAX_PIXELS = 1062400;

  if (w * h > MAX_PIXELS) {
    // For now, safest fallback
    w = 1024;
    h = 1024;
  }

  return { w, h };
}

async function generateWithNvidiaNim(prompt, modelCfg, width, height) {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NVIDIA NIM API key not configured. Set NVIDIA_API_KEY in your .env file."
    );
  }

  if (modelCfg.schema === "openai") {
    return generateWithNvidiaOpenAiSchema(prompt, modelCfg, apiKey, width, height);
  }
  return generateWithNvidiaNativeSchema(prompt, modelCfg, apiKey, width, height);
}

// FLUX.2 Klein — OpenAI-compatible schema
async function generateWithNvidiaOpenAiSchema(prompt, modelCfg, apiKey, width, height) {
  const dims = getNvidiaNimDimensions(width, height);
    console.log("NVIDIA API KEY PRESENT:", !!apiKey);

  console.log("[NVIDIA OpenAI] POST https://integrate.api.nvidia.com/v1/images/generations");
  console.log("[NVIDIA OpenAI] model:", modelCfg.modelId, "| size:", dims.w, "x", dims.h);

  const response = await fetch("https://integrate.api.nvidia.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: modelCfg.modelId,
      prompt: prompt,
      n: 1,
      width: dims.w,
      height: dims.h,
      response_format: "b64_json",
    }),
  });

const responseText = await response.text();

console.log("[NVIDIA OpenAI] status:", response.status);
console.log("[NVIDIA OpenAI] raw response:");
console.log(responseText);

let createData = {};

try {
  createData = JSON.parse(responseText);
} catch (err) {
  console.log("[NVIDIA OpenAI] Response is not JSON");
}

  if (!response.ok) {
    throw new Error(
      createData.detail ||
        createData.message ||
        createData.error?.message ||
        `NVIDIA NIM request failed (${response.status}).`
    );
  }

  const b64Json = createData.data?.[0]?.b64_json;
  if (!b64Json) {
    const url = createData.data?.[0]?.url;
    if (url) return await downloadImageAsDataUrl(url);
    throw new Error("NVIDIA NIM did not return an image.");
  }

  if (b64Json.startsWith("data:")) return b64Json;
  return `data:image/jpeg;base64,${b64Json}`;
}

// FLUX.1 Schnell — NVIDIA native schema
async function generateWithNvidiaNativeSchema(prompt, modelCfg, apiKey, width, height) {
  const dims = getNvidiaNimDimensions(width, height);
  console.log("Original:", width, height);
console.log("Normalized:", dims.w, dims.h);
  const url = `https://ai.api.nvidia.com/v1/genai/${modelCfg.modelId}`;

  console.log("[NVIDIA Native] POST", url);
  console.log("[NVIDIA Native] size:", dims.w, "x", dims.h);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      width: dims.w,
      height: dims.h,
      seed: 0,
      steps: modelCfg.steps || 4,
      samples: 1,
    }),
  });

  const createData = await response.json().catch(() => ({}));
  console.log("[NVIDIA Native] status:", response.status);
  console.log("[NVIDIA Native] response:", JSON.stringify(createData, null, 2));

  if (!response.ok) {
    throw new Error(
      createData.detail ||
        createData.message ||
        createData.error?.message ||
        `NVIDIA NIM request failed (${response.status}).`
    );
  }

  const artifact = createData.artifacts?.[0];

  if (artifact?.finishReason === "CONTENT_FILTERED") {
    throw new Error("Image was blocked by NVIDIA's content filter. Try simplifying your prompt or using the Optimize button to rephrase it.");
  }

  const base64 = artifact?.base64;
  if (!base64) {
    throw new Error("NVIDIA NIM did not return an image.");
  }

  if (base64.startsWith("data:")) return base64;
  return `data:image/jpeg;base64,${base64}`;
}

// ── HuggingFace image generation ──────────────────────────────────────────────

function getHuggingFaceDimensions(width, height) {
  const w = Number(width) || 1024;
  const h = Number(height) || 1024;
  const scale = Math.min(1024 / w, 1024 / h, 1);
  const scaledWidth = Math.max(256, Math.round((w * scale) / 8) * 8);
  const scaledHeight = Math.max(256, Math.round((h * scale) / 8) * 8);
  return { width: scaledWidth, height: scaledHeight };
}

async function generateWithHuggingFace(prompt, modelCfg, width, height) {
  if (!process.env.HF_TOKEN) {
    throw new Error("HF_TOKEN is not configured.");
  }

  const dimensions = getHuggingFaceDimensions(width, height);

  try {
    return await hf.textToImage(
      {
        model: modelCfg.modelId,
        provider: modelCfg.hfProvider,
        inputs: prompt,
        parameters: {
          ...dimensions,
          num_inference_steps: modelCfg.steps,
        },
      },
      { outputType: "dataUrl" }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Image generation failed: ${message}`);
  }
}

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildImagePrompt({ prompt, options }) {
  // Strip words that trigger NVIDIA content filter — Groq handles brand replacement
  const sanitized = prompt
    .replace(/\b(logo|watermark|trademark|copyright|brand|slogan)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const parts = [sanitized];

  if (options) {
    const { imageType, visualStyle, lighting, colorMood, composition, detailLevel, negativePrompt } = options;
    if (imageType)              parts.push(imageType);
    if (visualStyle)            parts.push(visualStyle);
    if (lighting)               parts.push(lighting);
    if (colorMood)              parts.push(`${colorMood} color palette`);
    if (composition)            parts.push(composition);
    if (detailLevel)            parts.push(detailLevel);
    if (negativePrompt?.trim()) parts.push(`avoid: ${negativePrompt.trim()}`);
  }

  // Cinematic quality suffixes — text suppression is listed first and repeated for weight
  parts.push(
    "no text",
    "no letters",
    "no words",
    "no typography",
    "no captions",
    "no labels",
    "no watermark",
    "no logo",
    "ultra high resolution",
    "professional product photography",
    "volumetric lighting",
    "shallow depth of field",
    "cinematic atmosphere",
    "clean empty copy space for text overlays"
  );

  const result = parts.join(", ");
  const MAX_LENGTH = 780;
  return result.length > MAX_LENGTH ? result.slice(0, MAX_LENGTH - 3) + "..." : result;
}

// ── Utility ───────────────────────────────────────────────────────────────────

function normalizeGeneratedCopy(copy, prompt, context) {
  const clean = (value, fallback, max) => {
    const text = typeof value === "string" && value.trim() ? value.trim() : fallback;
    return text.replace(/\s+/g, " ").slice(0, max).trim();
  };

  const fallbackHeadline = prompt.trim().replace(/\s+/g, " ").slice(0, 38).trim() || "Big Idea";
  const fallbackSubheadline = context?.trim()
    ? context.trim().replace(/\s+/g, " ").slice(0, 86).trim()
    : "Designed to stand out and get noticed.";

  return {
    eyebrow: clean(copy?.eyebrow, "Featured", 24),
    headline: clean(copy?.headline, fallbackHeadline, 38),
    subheadline: clean(copy?.subheadline, fallbackSubheadline, 86),
    cta: clean(copy?.cta, "Explore Now", 18),
    footer: clean(copy?.footer, "Available now", 46),
    detail: clean(copy?.detail, "Premium quality for modern audiences.", 54),
  };
}

async function downloadImageAsDataUrl(imageUrl) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Generated image could not be downloaded.");
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${imageBuffer.toString("base64")}`;
}

// ── Startup ───────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`PosterAI server running on http://localhost:${port}`);
  console.log(`Frontend origin: ${frontendOrigin}`);
  console.log(`Groq model: ${process.env.GROQ_MODEL || "llama-3.1-8b-instant"}`);
  console.log(`Available image models: ${Object.keys(IMAGE_MODEL_CONFIG).join(", ")}`);
});