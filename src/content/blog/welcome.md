---
title: 'Welcome to Astrolabe'
description: 'A quick tour of how this template is organized, how to add posts, and the conventions worth knowing before you start writing.'
pubDate: 2026-05-17
author: 'default'
tags: ['Getting Started', 'Astro']
---

This is your first blog post. It lives at `src/content/blog/welcome.md` and is rendered through `src/pages/blog/[...slug].astro`. Delete it once you have something of your own to say.

## How posts work

Each markdown file in `src/content/blog/` becomes a post. Astro reads the frontmatter at build time, Zod validates it against the schema in `src/content.config.ts`, and the file's name becomes the URL slug. This post is `welcome.md`, so the route is `/blog/welcome/`.

Required frontmatter:

- `title` — shown in the header and the `<title>` tag
- `description` — used for the listing card and the `<meta>` description
- `pubDate` — full ISO date (`YYYY-MM-DD`)

Optional:

- `author` — slug from `src/data/authors.ts`, defaults to `'default'`
- `image`, `tags`, `updatedDate`, `draft`

If you add a field that isn't in the schema, the build fails. That's a feature — it keeps every post consistent.

## Writing the body

Start with a lead paragraph, not an `# H1`. The layout already renders the title from frontmatter. Use `##` for sections and `###` sparingly for subsections — these populate the table of contents.

You have the full markdown vocabulary: **bold**, _italic_, `inline code`, lists, blockquotes, tables, and fenced code blocks with syntax highlighting:

```ts
export function greet(name: string) {
  return `Hello, ${name}!`
}
```

### A subsection

Nested under the section above. Subsections also appear in the table of contents.

## Linking and images

Internal links: `[the blog](/blog/)`. Images live in `public/` and are referenced from `/`:

```markdown
![Alt text describing the image](/images/blog/welcome/hero.webp)
```

Always write real alt text — it shows up to screen readers and to anyone whose images fail to load.

## Tags and authors

Add tags in frontmatter — each one gets its own page at `/blog/tags/<tag>/`. The `author` field is a slug that resolves to a profile in `src/data/authors.ts`; visit `/authors/default/` to see how it renders.

## What to do next

1. Edit `src/config/site.ts` — set your title, description, URL, and nav items.
2. Edit `src/data/authors.ts` — fill in your name, bio, links, and projects.
3. Replace this post in `src/content/blog/` with one of your own.
4. Customize the theme tokens in `src/styles/global.css` (`--color-*`, `--font-*`).
5. Update `site` in `astro.config.mjs` so the sitemap, RSS, and canonical URLs are correct.

There's more in [`/docs`](https://github.com/yourname/astrolabe/tree/main/docs) if you want it. Happy writing.
