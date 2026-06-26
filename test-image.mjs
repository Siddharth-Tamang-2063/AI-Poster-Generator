import dotenv from "dotenv";
dotenv.config();

async function testNvidia() {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.log("No NVIDIA key found in .env");
    return;
  }
  const baseUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell";
  const requestBody = {
    prompt: "a cat",
    width: 1024,
    height: 1024,
    seed: 0,
    steps: 4,
    samples: 1
  };
  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const text = await res.text();
    console.log("NVIDIA response status:", res.status);
    console.log("NVIDIA response text:", text.slice(0, 300));
  } catch (e) {
    console.error("NVIDIA Error:", e);
  }
}

async function testHF() {
  const apiKey = process.env.HF_TOKEN;
  if (!apiKey) {
    console.log("No HF token found in .env");
    return;
  }
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: "a cat" }),
    });
    console.log("HF response status:", res.status);
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("image")) {
      console.log("HF success, returned image.");
    } else {
      const text = await res.text();
      console.log("HF response text:", text.slice(0, 300));
    }
  } catch (e) {
    console.error("HF Error:", e);
  }
}

async function main() {
  console.log("Testing NVIDIA...");
  await testNvidia();
  console.log("\nTesting HuggingFace...");
  await testHF();
}

main();
