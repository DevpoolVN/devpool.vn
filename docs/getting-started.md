# Getting started

From zero to a running blog with your name on it, in under five minutes.

## Prerequisites

- **Node.js 20.10+ or 22+** (Astro 6 requires it).
- **npm**, **pnpm**, or **yarn** — the examples below use npm; substitute as you like.
- A code editor. Astrolabe is built for VS Code (there are no required extensions, but the Astro extension is nice).

## 1. Clone & install

```bash
git clone https://github.com/yourname/astrolabe.git my-blog
cd my-blog
npm install
```

Then start the dev server:

```bash
npm run dev
```

Open <http://localhost:4321>. You should see the home page with one blog post linked.

## 2. Make it yours

There are exactly three files to edit before you start writing.

### `src/config/site.ts`

```ts
export const SITE = {
  title: 'Your blog name',
  description: 'One sentence about what you write about.',
  url: 'https://your-domain.com',
  email: 'hello@your-domain.com',
  defaultAuthor: 'default',
  postsPerPage: 6,
} as const

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
] as const
```

`title`, `description`, and `url` flow into the `<head>`, RSS feed, sitemap, JSON-LD, and footer.

### `src/data/authors.ts`

```ts
export const AUTHORS: Record<string, Author> = {
  default: {
    slug: 'default',
    name: 'Your Name',
    role: 'What you do',
    bio: 'Short bio.',
    avatar: '/images/authors/default.svg', // optional
    location: 'Where you are',
    links: [
      { label: 'GitHub', href: 'https://github.com/yourname', icon: 'lucide:github' },
      // ...
    ],
    projects: [
      { name: 'Project name', description: 'One-liner.', href: 'https://…' },
    ],
  },
}
```

The `default` slug is what blog posts use by default. Add more entries here, then set `author: 'other-slug'` in a post's frontmatter to attribute it differently.

### `astro.config.mjs`

Update the `site` field with your real domain — it's used for the sitemap, RSS, JSON-LD, and canonical URLs:

```js
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
})
```

## 3. Write your first post

Create `src/content/blog/hello-world.md`:

```markdown
---
title: 'Hello, world'
description: 'A first post on a fresh blog. Just to see it render.'
pubDate: 2026-05-17
tags: ['Meta']
---

The blog works. Now I need something to say.
```

Save. The dev server reloads. The post is live at <http://localhost:4321/blog/hello-world/>.

The full reference is in [writing-posts.md](./writing-posts.md).

## 4. Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ at http://localhost:4321
```

`dist/` is a folder of static HTML, CSS, and JS. Drop it on any static host: Netlify, Cloudflare Pages, GitHub Pages, S3, an old laptop in your closet.

## 5. Deploy (Cloudflare Pages example)

```bash
# in the Cloudflare Pages dashboard, point at your Git repo with:
#   Build command:        npm run build
#   Build output:         dist
#   Environment variables: (none required by default)
```

For other hosts, the same two values work — build command is `npm run build`, output directory is `dist`.

## Common first-day questions

- **Can I delete the welcome post?** Yes. Delete `src/content/blog/welcome.md`.
- **How do I add a new page (not a blog post)?** Add `src/pages/<name>.astro`. See [writing-posts.md §pages](./writing-posts.md#pages-vs-posts).
- **Where do images go?** `public/images/blog/<slug>/hero.webp` etc. See [writing-posts.md §images](./writing-posts.md#images).
- **How do I switch to dark mode by default?** It already respects `prefers-color-scheme`. To force dark, see [customizing.md §dark-mode](./customizing.md#dark-mode).
- **How do I turn off RSS / view transitions / dark mode?** See [features.md](./features.md) — each section ends with how to remove the feature.
