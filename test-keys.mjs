import dotenv from "dotenv";
dotenv.config();

const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const dim    = (s) => `\x1b[2m${s}\x1b[0m`;

function result(name, ok, detail) {
  const icon = ok === true ? green("✓ WORKING") : ok === "warn" ? yellow("⚠ WARNING") : red("✗ FAILED ");
  console.log(`  ${icon}  ${bold(name)}`);
  if (detail) console.log(`           ${dim(detail)}`);
}

// ── 1. Groq ───────────────────────────────────────────────────────────────────
async function testGroq() {
  console.log(bold("\n─── Prompt Optimizer — Groq ────────────────────────────\n"));
  const key = process.env.GROQ_API_KEY;
  if (!key) { result("Groq", false, "GROQ_API_KEY not set in .env"); return; }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        max_tokens: 20,
        messages: [{ role: "user", content: "Say hi in one word" }],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.choices?.[0]?.message?.content) {
      result("Groq prompt optimizer", true, `Model: ${data.model} | Response: "${data.choices[0].message.content.trim()}"`);
    } else {
      result("Groq", false, data.error?.message || `HTTP ${res.status}`);
    }
  } catch (e) { result("Groq", false, e.message); }
}

// ── 2. HuggingFace account ────────────────────────────────────────────────────
async function testHuggingFace() {
  console.log(bold("\n─── Image Generation — HuggingFace ─────────────────────\n"));
  const key = process.env.HF_TOKEN;
  if (!key) { result("HuggingFace Token", false, "HF_TOKEN not set in .env"); return false; }

  try {
    const res = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.name) {
      result("HuggingFace Token", false, data.error || `HTTP ${res.status}`);
      return false;
    }
    const plan = data.plan?.type || "free";
    result("HuggingFace Token", true, `User: ${data.name} | Plan: ${plan}`);
    return true;
  } catch (e) { result("HuggingFace Token", false, e.message); return false; }
}

// ── 3. FLUX model access ──────────────────────────────────────────────────────
async function testFluxModel(name, modelId) {
  const key = process.env.HF_TOKEN;
  try {
    const res = await fetch(`https://huggingface.co/api/models/${modelId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      result(name, true, `Model ID: ${modelId} | Gated: ${data.gated ?? "no"}`);
    } else {
      result(name, false, data.error || `HTTP ${res.status} — you may need to accept terms at huggingface.co/${modelId}`);
    }
  } catch (e) { result(name, false, e.message); }
}

// ── 4. NVIDIA key check ───────────────────────────────────────────────────────
async function testNvidiaKeys() {
  console.log(bold("\n─── NVIDIA NIM API Key (used for image generation) ────\n"));
  const key = process.env.NVIDIA_API_KEY;
  if (!key || key.startsWith("your_")) {
    result("NVIDIA_API_KEY", "warn", "Placeholder — not set");
    return;
  }
  if (!key.startsWith("nvapi-")) {
    result("NVIDIA_API_KEY", "warn", "Key does not look like an NVIDIA key");
    return;
  }
  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      result("NVIDIA_API_KEY", "warn", `Key is VALID but note: Image generation uses this key via NVIDIA NIM endpoints (OpenAI or native schema).`);
    } else {
      const d = await res.json().catch(() => ({}));
      result("NVIDIA_API_KEY", false, d.message || `HTTP ${res.status}`);
    }
  } catch (e) { result("NVIDIA_API_KEY", false, e.message); }

  const bflKey = process.env.BFL_API_KEY;
  if (!bflKey || bflKey.startsWith("your_")) {
    result("BFL_API_KEY", "warn", "Placeholder — not set (not needed; using HuggingFace for images)");
  }
}

// ── Run all tests ─────────────────────────────────────────────────────────────
console.log("\n" + bold("═══════════════════════════════════════════════════════════"));
console.log(bold("  PosterAI Studio — API Key Diagnostics"));
console.log(bold("═══════════════════════════════════════════════════════════") + "\n");

await testGroq();
const hfOk = await testHuggingFace();
if (hfOk) {
  await testFluxModel("FLUX.1 Schnell (Fast) — default model", "black-forest-labs/FLUX.1-schnell");
  await testFluxModel("FLUX.1 Dev (HF)       — high quality",  "black-forest-labs/FLUX.1-dev");
}
await testNvidiaKeys();

console.log("\n" + bold("═══════════════════════════════════════════════════════════"));
console.log(`  ${green("Prompt Optimization:")} Groq (llama-3.1-8b-instant)`);
console.log(`  ${green("Image Generation:")}    HuggingFace (FLUX.1-schnell + FLUX.1-dev)`);
console.log(bold("═══════════════════════════════════════════════════════════") + "\n");
