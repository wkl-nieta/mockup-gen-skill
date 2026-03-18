#!/usr/bin/env node
/**
 * AI Mockup Generator
 * Generates ai mockup generator using the Neta talesofai API.
 * Usage: node mockupgen.js "<prompt>" [--size portrait] [--style anime] [--token xxx]
 */
import { readFileSync } from 'fs';
import { homedir } from 'os';

const args = process.argv.slice(2);
const flagIdx = (f) => args.indexOf(f);
const flagVal = (f) => { const i = flagIdx(f); return i >= 0 ? args[i + 1] : null; };

const PROMPT = args.find(a => !a.startsWith('--')) || 'product mockup on clean background, professional photography style';
const SIZE   = flagVal('--size') || 'landscape';
const STYLE  = flagVal('--style') || 'realistic';
const TOKEN  = flagVal('--token') || process.env.NETA_TOKEN || (() => {
  try {
    const env = readFileSync(`${homedir()}/.openclaw/workspace/.env`, 'utf8');
    return env.match(/NETA_TOKEN=(.+)/)?.[1]?.trim();
  } catch { return null; }
})();

if (!TOKEN) { console.error('Error: NETA_TOKEN not found. Set env var or use --token'); process.exit(1); }
if (!PROMPT) { console.error('Usage: node mockupgen.js "<prompt>"'); process.exit(1); }

const SIZE_MAP = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 832, height: 1216 },
  landscape: { width: 1216, height: 832 },
  tall: { width: 704, height: 1408 },
  mobile: { width: 512, height: 910 },
};
const { width, height } = SIZE_MAP[SIZE] || SIZE_MAP.landscape;

async function generate() {
  console.error(`Generating: "${PROMPT}" [${SIZE}, ${STYLE}]`);

  const res = await fetch('https://api.talesofai.cn/v3/make_image', {
    method: 'POST',
    headers: { 'x-token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: PROMPT,
      extra_param: { width, height },
      style_args: [{ style_name: STYLE }],
    }),
  });

  if (!res.ok) { console.error('API error:', res.status, await res.text()); process.exit(1); }
  const { task_uuid } = await res.json();
  if (!task_uuid) { console.error('No task_uuid returned'); process.exit(1); }

  console.error('Polling task:', task_uuid);
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const poll = await fetch(`https://api.talesofai.cn/v1/artifact/task/${task_uuid}`, {
      headers: { 'x-token': TOKEN },
    });
    const data = await poll.json();
    if (data.status === 'DONE' || data.status === 'done') {
      const url = data.result_image_url || data.image_url || data.url;
      console.log(url);
      return;
    }
    if (data.status === 'FAILED' || data.status === 'failed') {
      console.error('Generation failed:', JSON.stringify(data));
      process.exit(1);
    }
  }
  console.error('Timeout waiting for image generation');
  process.exit(1);
}

generate();
