# AI Mockup Generator

Generate stunning **ai mockup generator** images from a text description using AI — powered by the Neta talesofai API. Get back a direct image URL instantly, ready to embed or download.

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
node mockupgen.js "vintage coffee mug" --size portrait --style cinematic

# Pass token directly
node mockupgen.js "laptop on desk" --token YOUR_NETA_TOKEN
```

---

## Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--size` | `square`, `portrait`, `landscape`, `tall` | `landscape` | Output image dimensions |
| `--style` | `anime`, `cinematic`, `realistic` | `realistic` | Visual style of the generated image |
| `--token` | string | — | Override the API token (see Token Setup) |

### Size reference

| Name | Dimensions |
|------|-----------|
| `square` | 1024 × 1024 |
| `portrait` | 832 × 1216 |
| `landscape` | 1216 × 832 |
| `tall` | 704 × 1408 |

---

## Token Setup

The script looks for your `NETA_TOKEN` in this order:

1. `--token YOUR_TOKEN` CLI flag
2. `NETA_TOKEN` environment variable
3. `~/.openclaw/workspace/.env` file

**Recommended — store in `.env`:**
```
NETA_TOKEN=your_token_here
```

**Or export in your shell:**
```bash
export NETA_TOKEN=your_token_here
```

---

## Output

On success the script prints a single image URL to stdout and exits with code `0`:

```
https://cdn.talesofai.cn/.../<image>.png
```

On failure it prints an error message to stderr and exits with code `1`.

---

## Example

```bash
$ node mockupgen.js "product mockup on clean background, professional photography style" --size landscape --style realistic
[1/60] status: PENDING
[2/60] status: PROCESSING
https://cdn.talesofai.cn/artifacts/abc123/result.png
```

---

Built with Claude Code · Powered by Neta
