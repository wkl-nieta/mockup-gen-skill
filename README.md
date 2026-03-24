# AI Mockup Generator

Generate professional AI-powered product mockup images from a text description. Powered by the Neta talesofai API, this skill returns a direct image URL in seconds.

---

## Install

**Via npx skills:**
```bash
npx skills add wkl-nieta/mockup-gen-skill
```

**Via ClawHub:**
```bash
clawhub install mockup-gen-skill
```

---

## Usage

```bash
# Basic usage (uses default prompt)
node mockupgen.js

# Custom prompt
node mockupgen.js "white ceramic mug on marble surface, soft lighting"

# Specify size
node mockupgen.js "sneaker floating on gradient background" --size portrait

# Use a reference image UUID
node mockupgen.js "same product, outdoor setting" --ref abc123-uuid

# Pass token directly
node mockupgen.js "luxury watch flat lay" --token YOUR_NETA_TOKEN
```

The script prints the generated image URL to stdout and exits.

---

## Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--size` | `square`, `portrait`, `landscape`, `tall` | `landscape` | Output image dimensions |
| `--token` | string | — | Neta API token (overrides env/file) |
| `--ref` | UUID string | — | Reference picture UUID for style inheritance |

### Size dimensions

| Name | Width × Height |
|------|---------------|
| `square` | 1024 × 1024 |
| `portrait` | 832 × 1216 |
| `landscape` | 1216 × 832 |
| `tall` | 704 × 1408 |

---

## About Neta

[Neta](https://www.neta.art/) (by TalesofAI) is an AI image and video generation platform with a powerful open API. It uses a **credit-based system (AP — Action Points)** where each image generation costs a small number of credits. Subscriptions are available for heavier usage.

### Register & Get Token

| Region | Sign up | Get API token |
|--------|---------|---------------|
| Global | [neta.art](https://www.neta.art/) | [neta.art/open](https://www.neta.art/open/) |
| China  | [nieta.art](https://app.nieta.art/) | [nieta.art/security](https://app.nieta.art/security) |

New accounts receive free credits to get started. No credit card required to try.

### Pricing

Neta uses a pay-per-generation credit model. View current plans on the [pricing page](https://www.neta.art/pricing).

- **Free tier:** limited credits on signup — enough to test
- **Subscription:** monthly AP allowance via Stripe
- **Credit packs:** one-time top-up as needed

### Set up your token

```bash
# Step 1 — get your token:
#   Global: https://www.neta.art/open/
#   China:  https://app.nieta.art/security

# Step 2 — set it
export NETA_TOKEN=your_token_here

# Step 3 — run
node mockupgen.js "your prompt"
```

Or pass it inline:
```bash
node mockupgen.js "your prompt" --token your_token_here
```

> **API endpoint:** defaults to `api.talesofai.cn` (works with all token types).  
> Override with `NETA_API_URL=https://api.talesofai.cn` if using a global Open Platform token.


---

## Default prompt

If no prompt argument is provided, the script uses:
> `product mockup on clean background, professional photography style`

---

## Example output

```
https://cdn.talesofai.cn/artifacts/abc123.jpg
```

The URL is printed directly to stdout, making it easy to pipe into other tools or scripts.

---

Built with [Claude Code](https://claude.ai/claude-code) · Powered by [Neta](https://www.neta.art/) · [API Docs](https://www.neta.art/open/)