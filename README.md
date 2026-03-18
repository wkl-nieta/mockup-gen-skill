# AI Mockup Generator

> AI-powered ai mockup generator using the Neta talesofai API.

## Quick Start

```bash
# Install via skills.sh
npx skills add wkl-nieta/mockup-gen-skill

# Install via ClawHub
clawhub install mockup-gen-skill
```

## Usage

```bash
node mockupgen.js "product mockup on clean background, professional photography style"
node mockupgen.js "your custom prompt" --size landscape --style realistic
```

## Sizes
`square` · `portrait` · `landscape` · `tall` · `mobile`

## Styles
`anime` · `cinematic` · `realistic`

## Token Setup

Set your Neta API token in `~/.openclaw/workspace/.env`:
```
NETA_TOKEN=your_token_here
```

Or pass via `--token` flag.

---
Powered by [Neta / talesofai](https://talesofai.cn) · Built with Claude Code
