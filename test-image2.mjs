import dotenv from "dotenv";
dotenv.config();

async function testOpenAI(modelId) {
  const apiKey = process.env.NVIDIA_API_KEY;
  const baseUrl = "https://integrate.api.nvidia.com/v1/images/generations";

  const requestBody = {
    model: modelId,
    prompt: "a cat",
    response_format: "b64_json",
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
    console.log(`OpenAI ${modelId} status:`, res.status);
    const text = await res.text();
    console.log(`OpenAI ${modelId} text:`, text.slice(0, 100));
  } catch (e) {
    console.error("Error:", e);
  }
}

async function main() {
  await testOpenAI("black-forest-labs/flux.1-schnell");
  await testOpenAI("black-forest-labs/flux.2-klein-4b");
}

main();
