# AI Mockup Generator

Generate stunning **ai mockup generator** images from a text prompt — powered by the Neta talesofai API. Get back a direct image URL in seconds.

---

## Install

**Via npx skills:**
```bash
npx skills add wkl-nieta/mockup-gen-skill
```

**Via ClawHub / OpenClaw:**
```bash
clawhub install mockup-gen-skill
```

---

## Usage

```bash
# Basic — uses default prompt
node mockupgen.js

# Custom prompt
node mockupgen.js "red sneaker on white studio background"

# With size and style options
node mockupgen.js "luxury watch on marble surface" --size square --style cinematic

# Pass token inline
node mockupgen.js "coffee cup mockup" --token YOUR_NETA_TOKEN
```

---

## Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--size` | `portrait`, `landscape`, `square`, `tall` | `landscape` | Output image dimensions |
| `--style` | `anime`, `cinematic`, `realistic` | `realistic` | Visual style preset |
| `--token` | string | — | Override the NETA_TOKEN |

### Size reference

| Name | Dimensions |
|------|-----------|
| `square` | 1024 × 1024 |
| `portrait` | 832 × 1216 |
| `landscape` | 1216 × 832 |
| `tall` | 704 × 1408 |

---

## Token Setup

The script looks for your Neta API token in the following order:

1. `--token YOUR_TOKEN` CLI flag
2. `NETA_TOKEN` environment variable
3. `~/.openclaw/workspace/.env` file (line matching `NETA_TOKEN=...`)

**Recommended — add to your `.env` file:**
```
NETA_TOKEN=your_token_here
```

Or export it in your shell:
```bash
export NETA_TOKEN=your_token_here
```

---

## Output

The script prints a single image URL to stdout on success, making it easy to pipe into other tools:

```bash
URL=$(node mockupgen.js "product shot") && open "$URL"
```

---

## Example prompts

- `product mockup on clean background, professional photography style`
- `wireless headphones floating on pastel gradient`
- `skincare bottle on wet stone, natural light`
- `sneaker exploded view, technical diagram style`

---

Built with Claude Code · Powered by Neta
