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

### Register

| Region | Sign up | Get token |
|--------|---------|-----------|
| Global | [neta.art](https://www.neta.art/) | [Open Portal → API Token](https://www.neta.art/open/) |
| China  | [nieta.art](https://app.nieta.art/) | [Security Settings](https://app.nieta.art/security) |

New accounts receive free credits to get started.

### Pricing

Neta uses a pay-per-generation credit model. View current plans and credit packages on the [pricing page](https://www.neta.art/pricing).

- Free tier: limited credits on signup
- Subscription: monthly AP allowance via Stripe
- One-time packs: top up credits as needed

### Get your API token

1. Sign in at [neta.art/open](https://www.neta.art/open/) (global) or [nieta.art/security](https://app.nieta.art/security) (China)
2. Generate a new API token
3. Set it as `NETA_TOKEN` in your environment or pass via `--token`

```bash
export NETA_TOKEN=your_token_here
node mockupgen.js "your prompt"

# or inline
node mockupgen.js "your prompt" --token your_token_here
```


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