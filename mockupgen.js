#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";

// --- CLI argument parsing ---
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
function readTokenFromEnvFile() {
  const envPath = path.join(os.homedir(), ".openclaw", "workspace", ".env");
  try {
    const content = fs.readFileSync(envPath, "utf8");
    const match = content.match(/NETA_TOKEN=(.+)/);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

const token =
  tokenArg ||
  process.env.NETA_TOKEN ||
  readTokenFromEnvFile();

if (!token) {
  console.error(
    "Error: NETA_TOKEN not found. Set it via --token, NETA_TOKEN env var, or ~/.openclaw/workspace/.env"
  );
  process.exit(1);
}

// --- Size mapping ---
const SIZES = {
  square:    { width: 1024, height: 1024 },
  portrait:  { width: 832,  height: 1216 },
  landscape: { width: 1216, height: 832  },
  tall:      { width: 704,  height: 1408 },
};

const dimensions = SIZES[size];
if (!dimensions) {
  console.error(`Error: unknown size "${size}". Choose from: ${Object.keys(SIZES).join(", ")}`);
  process.exit(1);
}

// --- Submit image generation task ---
async function submitTask() {
  const body = {
    prompt,
    extra_param: {
      width: dimensions.width,
      height: dimensions.height,
    },
    style_args: [{ style_name: style }],
  };

  const res = await fetch("https://api.talesofai.cn/v3/make_image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Error submitting task (HTTP ${res.status}): ${text}`);
    process.exit(1);
  }

  const data = await res.json();
  const taskUuid = data.task_uuid || data.uuid || data.id;
  if (!taskUuid) {
    console.error("Error: no task_uuid in response:", JSON.stringify(data));
    process.exit(1);
  }
  return taskUuid;
}

// --- Poll for result ---
async function pollTask(taskUuid) {
  const maxAttempts = 60;
  const intervalMs = 3000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, intervalMs));

    const res = await fetch(
      `https://api.talesofai.cn/v1/artifact/task/${taskUuid}`,
      {
        headers: { "x-token": token },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`Error polling task (HTTP ${res.status}): ${text}`);
      process.exit(1);
    }

    const data = await res.json();
    const status = data.status;

    if (status === "DONE") {
      const imageUrl =
        data.result_image_url || data.image_url || data.url;
      if (!imageUrl) {
        console.error("Task DONE but no image URL found:", JSON.stringify(data));
        process.exit(1);
      }
      console.log(imageUrl);
      process.exit(0);
    }

    if (status === "FAILED") {
      const reason = data.error || data.message || JSON.stringify(data);
      console.error(`Task FAILED: ${reason}`);
      process.exit(1);
    }

    // Still pending — continue polling
    process.stderr.write(`[${attempt}/${maxAttempts}] status: ${status}\n`);
  }

  console.error("Error: timed out waiting for task to complete.");
  process.exit(1);
}

// --- Main ---
(async () => {
  const taskUuid = await submitTask();
  process.stderr.write(`Task submitted: ${taskUuid}\n`);
  await pollTask(taskUuid);
})();
