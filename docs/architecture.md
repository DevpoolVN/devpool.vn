# Architecture

A short tour of how the pieces fit together. Read this before making non-trivial changes.

## The shape

Astrolabe is a static site. Astro renders one HTML file per route at build time; there is no server, no client-side routing (other than view transitions), no runtime API.

```
src/content/blog/*.md    ──┐
                           │
src/data/authors.ts        │
                           ├─►  Astro build (npm run build)  ──►  dist/  ──►  any static host
src/pages/*.astro          │
                           │
src/styles/global.css   ───┘
```

## The three load-bearing systems

### 1. Content collections drive the blog

Posts live in `src/content/blog/*.md`. The schema in `src/content.config.ts` validates frontmatter with Zod, loaded via Astro's Content Layer `glob` loader:

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('default'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})
```

`getCollection('blog')` returns typed entries. The same call appears in:

- `src/pages/index.astro` — recent posts on the home page
- `src/pages/blog/[...page].astro` — paginated listing
- `src/pages/blog/[...slug].astro` — the post itself, plus related + prev/next
- `src/pages/blog/tags/[tag].astro` — tag pages
- `src/pages/authors/[slug].astro` — author's posts
- `src/pages/rss.xml.ts` — RSS feed

All of them filter out `draft: true`.

### 2. Components are atomic and stateless

```
atoms/      ── Button, Link, Icon                      (no state, no logic)
molecules/  ── BlogCard, NavLink, BlogContent, TOC,    (composed atoms)
               TagCloud, Pagination, AuthorCard
organisms/  ── Header, Footer                          (full sections of a page)
utilities/  ── JsonLD, ThemeToggle                    (cross-cutting helpers)
```

Pages compose organisms + molecules; molecules compose atoms. **Components are locale-agnostic and stateless** — they take everything as props. The single exception is `ThemeToggle`, which reads/writes `localStorage`.

### 3. Layouts wrap pages in two steps

`BaseLayout.astro` owns the `<html>` shell: `<head>` meta, SEO, fonts, the no-FOUC dark-mode boot script, the view-transition `<ClientRouter />`, and the `<body>` open/close.

`PageLayout.astro` wraps `BaseLayout` and adds the `Header` + `<main>` + `Footer` shell. Most pages render under `PageLayout`. Pages that need a different shell (none currently, but e.g. a fullscreen landing page) can use `BaseLayout` directly.

## Routing

File-based, courtesy of Astro:

| File                                  | Route(s) produced                                  |
| ------------------------------------- | -------------------------------------------------- |
| `src/pages/index.astro`               | `/`                                                |
| `src/pages/about.astro`               | `/about/`                                          |
| `src/pages/blog/[...page].astro`      | `/blog/`, `/blog/2/`, `/blog/3/`, … (paginate)     |
| `src/pages/blog/[...slug].astro`      | `/blog/<slug>/` (one per post)                     |
| `src/pages/blog/tags/[tag].astro`     | `/blog/tags/<tag>/` (one per unique tag)           |
| `src/pages/authors/[slug].astro`      | `/authors/<slug>/` (one per AUTHORS entry)         |
| `src/pages/rss.xml.ts`                | `/rss.xml`                                         |

All routes have trailing slashes by default (Astro's default config).

## Styling

Tailwind CSS v4 with theme tokens defined in `src/styles/global.css` via `@theme {}`. Dark mode is class-based using the v4 `@custom-variant dark (&:where(.dark, .dark *))` directive — both light and dark palettes use the same Tailwind utility names (`bg-ink`, `text-muted`), and the actual values are swapped via CSS custom properties at the `:root.dark` level.

This means components don't care whether the user is in light or dark mode. They reference tokens; the tokens take care of themselves.

## SEO & semantic graph

Every page renders:

- `<title>`, `<meta name="description">`, canonical URL, Open Graph, Twitter cards — via the `astro-seo` integration in `BaseLayout.astro`.
- A JSON-LD `<script>` for structured data, via `src/components/utilities/JsonLD.astro`. The home page emits `WebSite + Person`. Post pages emit a `@graph` with `BlogPosting + Person + BreadcrumbList`. Tag and listing pages emit `BreadcrumbList`. Author pages emit `Person`.

JSON-LD is rendered in the body (Google reads both head and body — body is fine).

## Build pipeline

```
npm run build
  └─► astro build
       ├─► Sync content collections, generate types in .astro/
       ├─► Bundle CSS via Tailwind v4 (vite plugin)
       ├─► Render each route to HTML in dist/
       ├─► Emit /rss.xml from src/pages/rss.xml.ts
       └─► Generate sitemap-index.xml via @astrojs/sitemap
```

Total output is 7 HTML pages, `rss.xml`, `sitemap-index.xml`, `sitemap-0.xml`, the JS bundle for `ClientRouter`, and the CSS bundle.

## What's not in the box

By design:

- **No comments system.** Add Giscus or Disqus yourself if you want one.
- **No analytics.** Add Plausible / Umami / GA4 in `BaseLayout.astro` if you want one.
- **No newsletter signup.** Add Buttondown / ConvertKit / Mailchimp embed yourself.
- **No search.** Pagefind is a one-command add if you want it — see [features.md](./features.md).
- **No CMS.** Posts are markdown files. Use a Git-based CMS like Decap or Sveltia if you want a UI on top.
- **No MDX.** Plain markdown only, to keep the schema and build simple. Astro supports MDX with `@astrojs/mdx` if you need JSX in posts.

## Tooling

- **Astro 6** — framework, build, content collections (Content Layer), routing, sitemap.
- **astro-icon + @iconify-json/lucide** — Lucide icons via the `<Icon />` atom.
- **Tailwind v4** — styling via `@tailwindcss/vite`, no separate config file (tokens live in CSS).
- **TypeScript strict** — type-checked via `astro check` (`npm run type-check`).
- **ESLint** — flat config in `eslint.config.js`, with Astro, TypeScript, Prettier, and simple-import-sort plugins.
- **Prettier** — `semi: false`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, `printWidth: 100`. Plugins for Astro, Tailwind class sorting, JSON sorting.

## File locations cheat sheet

| What                | Where                                          |
| ------------------- | ---------------------------------------------- |
| Site config         | `src/config/site.ts`                           |
| Author profiles     | `src/data/authors.ts`                          |
| Theme tokens        | `src/styles/global.css`                        |
| Blog post schema    | `src/content.config.ts`                        |
| Posts               | `src/content/blog/*.md`                        |
| Pages               | `src/pages/*.astro`                            |
| Layouts             | `src/layouts/*.astro`                          |
| Components          | `src/components/{atoms,molecules,organisms,utilities}/` |
| Helpers (slugify)   | `src/lib/`                                     |
| Public assets       | `public/`                                      |
| Image optimizer     | `scripts/optimize-image.mjs`                   |
| Agent skills        | `.agents/skills/`                              |
