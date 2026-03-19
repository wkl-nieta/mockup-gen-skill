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
  ) ||
  readTokenFromEnvFile(
    path.join(os.homedir(), "developer", "clawhouse", ".env")
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
      "content-type": "application/json",
      "x-token": token,
      "x-platform": "nieta-app/web",
    },
    body: JSON.stringify({
      storyId: "DO_NOT_USE",
      jobType: "universal",
      rawPrompt: [{ type: "freetext", value: prompt, weight: 1 }],
      width: dimensions.width,
      height: dimensions.height,
      meta: { entrance: "PICTURE,VERSE" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Error submitting task (${response.status}): ${text}`);
    process.exit(1);
  }

  const raw = await response.text();
  let taskUuid;
  try {
    const data = JSON.parse(raw);
    taskUuid = data.task_uuid;
  } catch {
    taskUuid = raw.trim();
  }
  if (!taskUuid) {
    console.error("Error: No task_uuid in response:", raw);
    process.exit(1);
  }
  return taskUuid;
}

// --- Poll for result ---
async function pollTask(taskUuid) {
  const MAX_ATTEMPTS = 90;
  const INTERVAL_MS = 2000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));

    const response = await fetch(
      `https://api.talesofai.cn/v1/artifact/task/${taskUuid}`,
      {
        headers: {
          "x-token": token,
          "x-platform": "nieta-app/web",
          "content-type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`Poll error (${response.status}): ${text}`);
      process.exit(1);
    }

    const data = await response.json();
    const status = data.task_status;

    if (status === "PENDING" || status === "MODERATION") {
      // Still running — continue polling
      continue;
    }

    // Any other status means done
    const imageUrl = data.artifacts && data.artifacts[0] && data.artifacts[0].url;
    if (!imageUrl) {
      console.error("Error: No artifact URL in response:", JSON.stringify(data));
      process.exit(1);
    }
    console.log(imageUrl);
    process.exit(0);
  }

  console.error("Error: Timed out waiting for image generation.");
  process.exit(1);
}

// --- Main ---
const taskUuid = await submitTask();
await pollTask(taskUuid);
