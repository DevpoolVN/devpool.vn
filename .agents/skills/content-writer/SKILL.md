---
name: content-writer
description: Research a topic and produce a publishable blog post for this Astro template — following an editorial writing standard and the project's markdown content format. Use this whenever the user wants to draft, research, or write a new blog post; says things like "write a post about X", "I want a blog about Y", "draft an article on Z", or wants to add new editorial content to the blog collection — even if they don't explicitly mention "content-writer". Also use when the user asks for content research or a multi-source writeup.
---

# content-writer

A skill for taking a topic from "the user has an idea" to "a draft blog post ready to preview". Built around two things the model on its own is bad at being consistent about:

1. **Voice** — distilled from how good editorial writers actually work.
2. **Structure** — markdown that matches the project's content collection schema and renders cleanly in the existing blog layout.

Both live as reference files in this skill. Read them whenever the skill is invoked — don't try to remember them.

## Reference files

| File                             | What it covers                                                                                                                                | When to read                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `references/writing-standard.md` | Voice, tone, opening patterns, structural movement, anti-patterns ("nestled", "vibrant tapestry", etc.), worked before/after rewrites.        | Before drafting. Re-skim before the final pass.                             |
| `references/content-format.md`   | Frontmatter schema, markdown body structure, callouts, image conventions, internal/external links, slug + filename rules.                     | Before drafting. Use as a checklist during writing and again before saving. |

These are the source of truth. If anything in this SKILL.md ever contradicts them, the reference files win.

## Project context

This is an Astro 6 blog template. Posts live at **`src/content/blog/<slug>.md`** — flat, single-language (English). The blog route is `/blog/<slug>/`. The post title is rendered as `<h1>` from frontmatter by the layout at `src/pages/blog/[...slug].astro` — do **not** repeat it as `# Title` in the markdown body. Images live under `public/images/blog/<slug>/`. The schema is in `src/content.config.ts`.

The site also has:

- **Tag pages** at `/blog/tags/<tag>/` — every tag in your frontmatter gets a filtered page automatically. Tag slugs are kebab-case (`getting-started` for `Getting Started`).
- **Author profiles** at `/authors/<slug>/` — the `author` frontmatter field is a slug pointing to a profile in `src/data/authors.ts`. Default is `'default'`.
- **RSS feed** at `/rss.xml` — generated from `pubDate` order; drafts (`draft: true`) are excluded.
- **JSON-LD** structured data — `BlogPosting` + `Person` + `BreadcrumbList` are emitted per post automatically; you don't need to write this in the markdown.

## The workflow

### Step 1 — Interview the user

Use the `AskUserQuestion` tool to gather what you need. Group questions sensibly (2–4 per call); don't fire one question at a time.

Always ask (or infer with confirmation):

- **Topic & angle.** What's the post about, and what's the specific angle? "React state management" is the topic; "why most teams over-reach for Redux" is an angle. Without an angle, the post drifts into Wikipedia-summary territory.
- **Audience.** Who's the reader? Newcomers? Practitioners with five years in? People shopping for a tool?
- **Length.** Short feature (~600–900 words), standard (~1000–1500), or long-read (~1800–2500)?
- **Personal notes.** Anything the user wants woven in — a specific anecdote, a quote, an opinion, a project they want referenced.
- **Reference URLs.** Articles, videos, social posts, official docs, the user's own draft. Anything you should read before writing.
- **Tags.** Suggest 3–6 based on the topic; confirm with the user. Reuse existing tags when possible.
- **Author.** Default to `'default'` (resolves to the profile in `src/data/authors.ts`). Ask if the post should be attributed to a different author slug.
- **Hard constraints.** Things to include or avoid.

If the user is in a hurry, infer reasonable defaults but always confirm topic + angle + length. Without those three, the post will be wrong-shaped.

### Step 2 — Research

Read every URL the user provides with `WebFetch`. Then go broader with `WebSearch` to fill gaps — primary sources, contrasting takes, technical specs, dates, names. The mistake to avoid is paraphrasing one Wikipedia page; a useful post triangulates across at least 3–5 sources, including at least one primary source where applicable (the docs, the original paper, the maker's own writing).

For each useful source, capture:

- 2–3 specific facts worth citing
- The URL
- Any direct quote you might attribute
- Any image you might want to use (and whether the license permits reuse)

### Step 3 — Plan the structure

Pick a structural pattern from `references/content-format.md` that fits the topic — Guide, Deep-Dive, How-To, Place/Subject Portrait, Human Story, Themed Listicle-with-Narrative, or Opinion/Argument. Sketch an outline: hook → 3–6 body sections → practical/closing section → close. Mark 2–4 image spots in the outline.

### Step 4 — Write the draft

Follow the writing standard. The most-frequently-violated rules:

- **Open in a scene, a fact, or a tension — not a summary.** No "Imagine yourself…" or "Welcome to…".
- **Be specific.** Concrete numbers, real names, real dates, real prices. "An 84-year-old woman selling bánh mì at the corner of Trần Phú and Nguyễn Thái Học" beats "a local vendor"; "the 12 KB Astro client runtime" beats "a tiny JS payload".
- **Weave context; don't lecture.** History, definitions, and background belong inside scenes or arguments — not in standalone "Background" paragraphs.
- **No `# Title` H1 in the body** — the layout renders the title from frontmatter. The first markdown line should be the lead paragraph.
- **Avoid AI-flavor giveaways.** "Nestled", "in the heart of", "vibrant tapestry", "a must-visit", "boasts", "delve into", "in today's fast-paced world" — see the anti-pattern list in `writing-standard.md`.

### Step 5 — Source images

For each image spot in the outline:

1. **Check user references.** If the user shared a URL with a usable image (Wikipedia, Creative Commons, Unsplash, Pexels, the user's own material), prefer that.
2. **Try to download.** Use `WebFetch` or `Bash` (`curl` / `Invoke-WebRequest` on Windows). Save raw originals to `public/images/_source/blog/<slug>/` (so they can be re-optimized later) and the WebP output to `public/images/blog/<slug>/image-N.webp` (`hero.webp` for the lead). Invoke the `image-optimizer` skill to handle the conversion if you'd rather not do it inline.
3. **Otherwise, placeholder.** Insert the markdown image with the canonical path **and** a descriptive alt: `![Close-up of the keyboard with the spacebar highlighted](/images/blog/<slug>/image-2.webp)`. The file won't exist yet — that's fine; the post will render with a broken image until the user adds it. Track every placeholder for the final report.

Image specs:

| Type      | Dimensions    | Aspect | Max size |
| --------- | ------------- | ------ | -------- |
| Hero      | 1200×630      | 16:9   | 150 KB   |
| Thumbnail | 600×400       | 3:2    | 50 KB    |
| Content   | 800–1200 wide | varies | 100 KB   |

Always include alt text. Always WebP.

### Step 6 — Save the post

Write to `src/content/blog/<slug>.md`.

Slug rules: kebab-case, ASCII only, descriptive, ≤ 60 characters. Strip diacritics from the slug; keep them in the body. Examples: `react-state-without-redux`, `hoi-an-lantern-festival`, `why-i-stopped-using-makefiles`.

Frontmatter must validate against the `blog` collection schema in `src/content.config.ts`:

```yaml
---
title: 'Post Title'
description: 'SEO description, 150–160 characters, written for humans first'
pubDate: 2026-05-17
author: 'default'
image: '/images/blog/<slug>/hero.webp'
tags: ['Tag One', 'Tag Two', 'Tag Three']
draft: false
---
```

- `pubDate` is today's date (it's in the system context — use it).
- `author` is a slug from `src/data/authors.ts`. Default is `'default'`.
- `tags` should be 3–6 specific, reusable tags. Capitalize them in frontmatter; the URL slug is normalized to kebab-case automatically.
- `draft: true` keeps the post out of the listing, RSS, and tag pages. Useful for work-in-progress.

### Step 7 — Report

Tell the user:

1. **File created**: `src/content/blog/<slug>.md`
2. **Preview URL**: `http://localhost:4321/blog/<slug>/` (assuming `npm run dev` is running)
3. **Tag pages**: list the `/blog/tags/<slug>/` URLs that will now exist (or already exist) because of this post's tags.
4. **Images** — a list of what was downloaded vs. what's a placeholder. Placeholders need real images before publish. Offer to invoke the `image-optimizer` skill on any raw files dropped in `public/images/_source/`.
5. **A direct ask**: "Open the URL and tell me what to fix — tone, structure, factual issues, anything."

If `npm run dev` doesn't appear to be running, suggest the user start it.

## Hard rules

- Output validates against the `blog` schema in `src/content.config.ts`.
- Slugs are kebab-case, ASCII, ≤ 60 characters.
- Images live under `public/images/blog/<slug>/`. Never embed remote image URLs in the post body.
- No `# Title` H1 in markdown body — the layout already renders it.
- Default voice: informative, practically useful, occasionally warm or wry, honest about trade-offs, never condescending.
- Cite specific facts when the user can check them. When uncertain, prefer hedged phrasing ("typically", "around 30 ms") over invented precision.
- Never invent a quote and attribute it to a real person.
- Do not introduce political opinions the user did not ask for.
- Don't set an `author` slug that doesn't exist in `src/data/authors.ts`. If a new author is needed, add them there first.

## What success looks like

One end-to-end run produces:

- One markdown file at `src/content/blog/<slug>.md` that builds without schema errors.
- A `public/images/blog/<slug>/` folder with as many real WebP images as could be sourced, plus documented placeholders.
- A short report to the user with the preview URL, tag pages that now exist, and a punch list of anything that still needs hands-on attention.
