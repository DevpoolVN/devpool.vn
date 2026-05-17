# Writing posts

How to add and structure a blog post, with the schema and conventions Astrolabe expects.

## File location

Posts live at `src/content/blog/<slug>.md`. The filename becomes the URL: `welcome.md` → `/blog/welcome/`.

**Slug rules:**

- kebab-case
- ASCII only — strip diacritics from the slug (keep them in the body)
- ≤ 60 characters
- descriptive: `hoi-an-lantern-festival`, not `post-7` or `untitled-2`

## Frontmatter

The schema is in `src/content.config.ts`. Zod validates it at build — invalid frontmatter fails the build.

```yaml
---
title: 'The lanterns of Hội An: a field guide to the monthly festival'
description: 'Hội An turns off its streetlights on the 14th day of every lunar month. A practical and honest guide for travelers who already know the basics.'
pubDate: 2026-05-17
updatedDate: 2026-05-20      # optional
author: 'default'            # optional, slug from src/data/authors.ts
image: '/images/blog/hoi-an-lantern-festival/hero.webp'   # optional
tags: ['Hội An', 'Festival', 'Culture', 'Travel Guide']
draft: false                 # optional, omit to publish
---
```

| Field         | Required | Notes                                                                                       |
| ------------- | -------- | ------------------------------------------------------------------------------------------- |
| `title`       | yes      | Specific. Avoid clickbait. Title or sentence case — be consistent.                          |
| `description` | yes      | 150–160 characters. Extends the title; never paraphrases it.                                |
| `pubDate`     | yes      | Full ISO date `YYYY-MM-DD`.                                                                 |
| `updatedDate` | no       | Add when you substantively revise an existing post.                                         |
| `author`      | no       | Slug from `src/data/authors.ts`. Defaults to `'default'`.                                   |
| `image`       | no       | Hero image. Used in the post header, listing card, and `og:image`.                          |
| `tags`        | no       | 3–6 tags. Capitalize. Each creates `/blog/tags/<kebab-case>/`.                              |
| `draft`       | no       | `true` excludes from listing, tag pages, and RSS.                                           |

## Body

**Start with the lead paragraph — no `# Title` heading.** The layout renders the title from frontmatter.

```markdown
The streetlights on Trần Phú go out one block at a time, beginning at the river. By the time the dark reaches the Japanese Bridge, the lanterns are already lit — a few thousand of them, paper and silk in red, orange, and a yellow so warm it looks edible. This happens on the 14th day of every lunar month.

![A row of paper lanterns reflecting on the Thu Bồn River at dusk](/images/blog/hoi-an-lantern-festival/hero.webp)

## The festival

Body content. Mix prose with the occasional list.

### A subsection

`##` and `###` populate the table of contents automatically.

> **Tip:** A specific, useful tip in one sentence.

## Practical info

| Activity | Time | Cost |
| -------- | ---- | ---- |
| …        | …    | …    |
```

### Heading rules

- Only `##` and `###` in the body. `#` is the title from frontmatter; `####` is too deep — split the section.
- Headings are concrete nouns or short phrases, not adjectives. ✅ "The river at dusk". ❌ "Stunning Scenery".

### Length

| Words   | H2 sections |
| ------- | ----------- |
| ~1000   | 3–5         |
| ~1500   | 5–7         |
| ~2500   | 6–9         |

Sections under ~80 words are usually too small — fold them into a neighbor.

## Images

All blog images live under `public/images/blog/<slug>/`. Reference them with absolute paths starting `/images/...`.

```markdown
![Specific alt text describing the image](/images/blog/<slug>/image-1.webp)
```

**Filenames:**

| Image                                | Filename                                       |
| ------------------------------------ | ---------------------------------------------- |
| Hero (also used in frontmatter)      | `hero.webp`                                    |
| Body images                          | `image-1.webp`, `image-2.webp`, …              |
| Specific things                      | descriptive: `lantern-makers-workshop.webp`    |

**Specs:** WebP, quality 80–85. Hero is 1200×630 (16:9, ≤150 KB). Body images 800–1200 px wide (≤100 KB).

**Optimizing raw photos:** drop them in `public/images/_source/blog/<slug>/`, install sharp (`npm i -D sharp`), then run `node scripts/optimize-image.mjs`. Output lands in the correct path. See [skills.md](./skills.md) for the `image-optimizer` skill that automates this.

**Always include alt text.** Describe what's in the image, not the topic of the post.

## Tags

Tags are free-form strings in frontmatter — Astrolabe automatically creates `/blog/tags/<kebab-case>/` pages for each unique tag across all posts. The kebab-case conversion uses `src/lib/slug.ts`:

- `Getting Started` → `/blog/tags/getting-started/`
- `Hội An` → `/blog/tags/hoi-an/`
- `React` → `/blog/tags/react/`

Recommendation: 3–6 tags per post, capitalized, reusable across multiple posts.

## Authors

The `author` field is a **slug** referring to a profile in `src/data/authors.ts`, not a display name. To attribute a post to a different author:

1. Add an entry to `AUTHORS` in `src/data/authors.ts`:

   ```ts
   alice: {
     slug: 'alice',
     name: 'Alice Example',
     role: 'Guest writer',
     bio: '...',
     links: [...],
     projects: [],
   },
   ```

2. Set `author: 'alice'` in the post frontmatter.
3. The author's profile is at `/authors/alice/`.

## Drafts

Set `draft: true` to keep a post out of:

- The blog listing (`/blog/`)
- Tag pages
- The RSS feed
- Related/prev/next on other posts
- The home page "Recent posts" section

Drafts can still be visited directly at `/blog/<slug>/` while in dev (and in the build, technically — drop the page or filter at build time if you need it gone entirely).

## Pages vs posts

Posts go in `src/content/blog/` and follow the schema. **Pages** go in `src/pages/` and are regular Astro files.

To add a new page (e.g. `/projects/`):

```astro
---
// src/pages/projects.astro
import PageLayout from '@/layouts/PageLayout.astro'
---

<PageLayout title="Projects" description="What I'm building.">
  <section class="container mx-auto max-w-3xl px-6 py-20 md:px-8">
    <h1 class="mb-8 font-serif text-4xl font-bold md:text-5xl">Projects</h1>
    <!-- your content -->
  </section>
</PageLayout>
```

Then add it to the `NAV` array in `src/config/site.ts`:

```ts
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
] as const
```

## Pre-publish checklist

1. Schema validates — no build errors.
2. Slug is kebab-case, ASCII, ≤ 60 chars.
3. No `# Title` H1 in the body.
4. Description is 150–160 chars, doesn't paraphrase the title.
5. Tags are 3–6, capitalized, reusable.
6. Hero image present (or you've decided not to use one).
7. Every body image has real, specific alt text.
8. Internal links use absolute paths starting `/`.
9. External links have descriptive text, not bare URLs.
10. `author` slug exists in `src/data/authors.ts`.
