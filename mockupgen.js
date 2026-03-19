#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";

// --- CLI arg parsing ---
const args = process.argv.slice(2);
let prompt = "";
let size = "landscape";
let style = "realistic";
let tokenArg = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--size" && args[i + 1]) {
    size = args[++i];
  } else if (args[i] === "--style" && args[i + 1]) {
    style = args[++i];
  } else if (args[i] === "--token" && args[i + 1]) {
    tokenArg = args[++i];
  } else if (!args[i].startsWith("--") && !prompt) {
    prompt = args[i];
  }
}

if (!prompt) {
  prompt = "product mockup on clean background, professional photography style";
}

// --- Token resolution ---
function readTokenFromEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const match = content.match(/NETA_TOKEN=(.+)/);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

const token =
  tokenArg ||
  process.env.NETA_TOKEN ||
  readTokenFromEnvFile(
    path.join(os.homedir(), ".openclaw", "workspace", ".env")
  );

if (!token) {
  console.error(
    "Error: NETA_TOKEN not found. Set it via --token, NETA_TOKEN env var, or ~/.openclaw/workspace/.env"
  );
  process.exit(1);
}

// --- Size map ---
const SIZES = {
  square:    { width: 1024, height: 1024 },
  portrait:  { width: 832,  height: 1216 },
  landscape: { width: 1216, height: 832  },
  tall:      { width: 704,  height: 1408 },
};

const dimensions = SIZES[size] || SIZES.landscape;

// --- Submit image generation request ---
async function submitTask() {
  const response = await fetch("https://api.talesofai.cn/v3/make_image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      prompt,
      extra_param: {
        width: dimensions.width,
        height: dimensions.height,
      },
      style_args: [{ style_name: style }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Error submitting task (${response.status}): ${text}`);
    process.exit(1);
  }

  const data = await response.json();
  const taskUuid = data.task_uuid || data.uuid || data.id;
  if (!taskUuid) {
    console.error("Error: No task_uuid in response:", JSON.stringify(data));
    process.exit(1);
  }
  return taskUuid;
}

// --- Poll for result ---
async function pollTask(taskUuid) {
  const MAX_ATTEMPTS = 60;
  const INTERVAL_MS = 3000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));

    const response = await fetch(
      `https://api.talesofai.cn/v1/artifact/task/${taskUuid}`,
      {
        headers: { "x-token": token },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`Poll error (${response.status}): ${text}`);
      process.exit(1);
    }

    const data = await response.json();
    const status = data.status;

    if (status === "DONE") {
      const imageUrl =
        data.result_image_url || data.image_url || data.url;
      if (!imageUrl) {
        console.error("Error: No image URL in response:", JSON.stringify(data));
        process.exit(1);
      }
      console.log(imageUrl);
      process.exit(0);
    }

    if (status === "FAILED") {
      const reason = data.error || data.message || JSON.stringify(data);
      console.error(`Task failed: ${reason}`);
      process.exit(1);
    }

    // Still pending — continue polling
  }

  console.error("Error: Timed out waiting for image generation.");
  process.exit(1);
}

// --- Main ---
const taskUuid = await submitTask();
await pollTask(taskUuid);
