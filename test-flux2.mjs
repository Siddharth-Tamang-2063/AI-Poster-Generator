import dotenv from "dotenv";
dotenv.config();

async function testModel(modelId) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.log("No NVIDIA key found in .env");
    return;
  }
  const baseUrl = `https://ai.api.nvidia.com/v1/genai/${modelId}`;
  console.log("Testing:", baseUrl);
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
    console.log("Response status:", res.status);
    console.log("Response text:", text.slice(0, 300));
  } catch (e) {
    console.error("Error:", e);
  }
}

async function main() {
  await testModel("black-forest-labs/flux-2-klein-4b");
  await testModel("black-forest-labs/flux_2-klein-4b");
  await testModel("black-forest-labs/flux.2-klein-4b");
}

main();
