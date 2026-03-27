---
name: mockup-gen-skill
description: Generate mockup gen images using the Neta AI API. Returns a direct image URL.
tools: Bash
---

# AI Mockup Generator

Generate stunning ai mockup generator images from a text description. Get back a direct image URL instantly.

## When to use
Use when someone asks to generate or create ai mockup generator images.

## Quick start
```bash
node mockupgen.js "your description here"
```

## Options
- `--size` — `portrait`, `landscape`, `square`, `tall` (default: `landscape`)


## Token

Requires a Neta API token via the `--token` flag.
- Global: <https://www.neta.art/open/>
- China:  <https://app.nieta.art/security>

```bash
export NETA_TOKEN=your_token_here
node <script> "your prompt" --token "$NETA_TOKEN"
```

## Install
```bash
npx skills add wkl-nieta/mockup-gen-skill
```
