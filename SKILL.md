---
name: mockup-gen-skill
description: AI Mockup Generator — generate ai mockup generator using the Neta AI image API. Powered by talesofai.
tools: Bash
---

# AI Mockup Generator

Generate AI images for "ai mockup generator" using the Neta talesofai API.

## When to use
Use this skill when the user wants to create ai mockup generator images, artwork, or visuals. Accepts a text description and returns a direct image URL.

## Usage

```bash
node mockupgen.js "<description>"
node mockupgen.js "<description>" --size landscape
node mockupgen.js "<description>" --style realistic
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| description | string | required | What to generate |
| --size | string | `landscape` | portrait / landscape / square / tall |
| --style | string | `realistic` | anime / cinematic / realistic |
| --token | string | env | Neta API token (or set NETA_TOKEN) |

## Sizes

| Size | Dimensions | Best for |
|------|-----------|---------|
| square | 1:1 | Avatars, icons, stickers |
| portrait | 2:3 | Characters, posters, cards |
| landscape | 16:9 | Banners, thumbnails, backgrounds |
| tall | 9:16 | Mobile, stories |

## Examples

| Description | Result |
|-------------|--------|
| "product mockup on clean background, professional photography style" | AI Mockup Generator output |
| "custom prompt for ai mockup generator" | Custom generated image |

## Install

```bash
npx skills add wkl-nieta/mockup-gen-skill
clawhub install mockup-gen-skill
```
