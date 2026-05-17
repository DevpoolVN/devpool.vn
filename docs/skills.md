# Agent skills

Astrolabe ships with four agent skills in `.agents/skills/`, following the open Agent Skills standard. Compatible AI coding tools can pick them up automatically (Cursor, OpenAI Codex, Gemini CLI, Warp, VS Code, OpenCode, JetBrains Junie, and others).

> **Heads up — Claude Code:** Claude Code currently only reads `.claude/skills/`, not `.agents/skills/` ([anthropics/claude-code#31005](https://github.com/anthropics/claude-code/issues/31005)). To use these skills with Claude Code today, either symlink `.claude/skills/` → `.agents/skills/`, or move them back into `.claude/skills/`.

## What's included

```
.agents/skills/
├── content-writer/        # Research a topic and write a publishable blog post
│   ├── SKILL.md
│   └── references/
│       ├── content-format.md      # Frontmatter, structure, slugs, images
│       └── writing-standard.md    # Voice, anti-patterns, worked examples
├── image-optimizer/       # Convert raws in _source/ to sized WebPs
│   └── SKILL.md
├── frontend-design/       # Build production-grade frontend interfaces
│   └── SKILL.md
└── skill-creator/         # Author / edit / evaluate skills
    ├── SKILL.md
    ├── agents/
    ├── assets/
    ├── references/
    └── scripts/
```

## Using them

In Claude Code (after symlinking or moving to `.claude/skills/`):

```
> /content-writer
> I want to write a post about why I stopped using Makefiles.
```

In Cursor, Codex, Gemini CLI, and other Agent-Skills-compatible tools: the skills are auto-discovered. Reference them by their `name` (from SKILL.md frontmatter) in any prompt where the trigger keywords match the skill description.

## What each skill does

### `content-writer`

Takes a topic from "I have an idea" to "a draft markdown post in `src/content/blog/`". Workflow:

1. Interview the user — topic, angle, audience, length, references, tags, author.
2. Research with `WebFetch` + `WebSearch` across multiple sources.
3. Plan structure using one of seven editorial patterns (Guide, Deep-Dive, How-To, Place Portrait, Human Story, Listicle, Opinion).
4. Draft following the voice rules in `references/writing-standard.md`.
5. Source or placeholder images.
6. Save the post — frontmatter validated against `src/content.config.ts`.
7. Report what was created, with preview URL and a list of placeholder images that need real files.

Voice references in `references/writing-standard.md` are extensive: opening patterns that work, opening patterns that don't, a long watchlist of AI-flavored phrases (`nestled`, `vibrant tapestry`, `in today's fast-paced world`, `delve into`, `boasts`, `must-visit`, …), and four worked before/after rewrites.

### `image-optimizer`

Converts raw `.jpg` / `.png` files in `public/images/_source/` into sized WebPs at the right output paths. Filename determines the preset:

| Source path                          | Preset    | Output dimensions | Quality |
| ------------------------------------ | --------- | ----------------- | ------- |
| `_source/blog/<slug>/hero.*`         | hero      | 1200×630 cover    | 85      |
| `_source/blog/<slug>/thumbnail.*`    | thumbnail | 600×400 cover     | 82      |
| `_source/blog/<slug>/image-N.*`      | body      | 1200 wide, ratio  | 82      |
| `_source/authors/<slug>.*`           | avatar    | 512×512 cover     | 85      |

Calls `scripts/optimize-image.mjs` under the hood. Requires `sharp` (`npm i -D sharp` — not included by default to keep the template lean).

Usage:

```bash
node scripts/optimize-image.mjs --dry              # show what would happen
node scripts/optimize-image.mjs                    # convert all pending
node scripts/optimize-image.mjs --slug welcome     # one post only
node scripts/optimize-image.mjs --force            # re-convert existing outputs
```

### `frontend-design`

A general-purpose skill for building high-quality frontend interfaces. Not project-specific — it's the same skill from Anthropic's distribution, unchanged.

### `skill-creator`

For authoring new skills, editing existing ones, and evaluating skill performance. Use it when you want to add a project-specific skill to `.agents/skills/`. Includes scripts for validation, packaging, and running evals.

## Adding your own skill

Create a folder under `.agents/skills/`:

```
.agents/skills/<your-skill>/
├── SKILL.md            # required — see frontmatter below
├── references/         # optional — knowledge files the skill reads
├── scripts/            # optional — executables the skill can run
└── assets/             # optional — templates, sample data, output formats
```

`SKILL.md` frontmatter:

```yaml
---
name: your-skill
description: One paragraph describing what the skill does and the triggers that should invoke it. The description matters — agents match user requests against it to decide whether to invoke the skill.
---
```

A specific, trigger-rich description outperforms a vague one. Mention the verbs and nouns users will say ("write a blog post about X", "optimize these images", "add a new feature page").

See `.agents/skills/skill-creator/SKILL.md` for the full author guide.

## Why `.agents/skills/`

It's the vendor-neutral path defined by the Agent Skills open standard. The format is identical to what Claude Code, Cursor, and others already use — only the parent directory name differs. Putting skills here makes them portable.

If you're only using one agent and don't care about portability, you can move skills to that agent's preferred directory (e.g. `.claude/skills/`, `.cursor/skills/`, `.warp/skills/`) — the internal `SKILL.md` format is the same everywhere.
