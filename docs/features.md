# Features

Every built-in feature, what it does, where it lives, and how to turn it off if you don't want it.

## Blog & content

### Markdown posts with Zod-validated frontmatter

- **What:** Posts in `src/content/blog/*.md` validated by `src/content.config.ts`.
- **Why it's nice:** Schema errors fail the build, not production. Every post has the same fields.
- **Remove:** Replace the entire content collection with hand-written `.astro` files. Drop `src/content/`.

### Paginated blog index

- **What:** `/blog/` shows N posts per page; `/blog/2/`, `/blog/3/`, … for the rest.
- **Configure:** `postsPerPage` in `src/config/site.ts`.
- **Code:** `src/pages/blog/[...page].astro` using Astro's `paginate()`.
- **Remove:** Replace `[...page].astro` with a single `index.astro` that lists all posts and skip `paginate()`.

### Tag pages

- **What:** Every unique tag across all posts gets a page at `/blog/tags/<kebab-case>/`.
- **Code:** `src/pages/blog/tags/[tag].astro` + `src/components/molecules/TagCloud.astro` + `src/lib/slug.ts`.
- **Remove:** Delete `src/pages/blog/tags/` and the `TagCloud` import in `src/pages/blog/[...page].astro`.

### Author profiles

- **What:** Each entry in `src/data/authors.ts` gets a page at `/authors/<slug>/` with bio, location, social links, projects, and a list of their posts.
- **Code:** `src/pages/authors/[slug].astro` + `src/components/molecules/AuthorCard.astro`.
- **Remove:** Delete `src/pages/authors/` and the `AuthorCard` import / display on the post page. The `author` frontmatter field can stay as a display string if you prefer.

### Related + prev/next posts

- **What:** On a post page, three related posts (matched by shared tags, falling back to recent) plus the previous/next post chronologically.
- **Code:** in `src/pages/blog/[...slug].astro`.
- **Remove:** Delete the corresponding sections in `[...slug].astro`.

### Draft posts

- **What:** `draft: true` in frontmatter hides a post from listings, tag pages, RSS, and home recent-posts. Direct URL still resolves (you may want to remove the static path at build for full hiding).
- **Remove:** Drop the `draft` field from the schema in `src/content.config.ts` and the `({ data }) => !data.draft` filters in pages.

## Reader experience

### Table of contents

- **What:** Sticky sidebar on desktop, auto-generated from `##`/`###` headings, with scroll-spy highlighting the current section.
- **Code:** `src/components/molecules/TableOfContents.astro` (used in `src/pages/blog/[...slug].astro`).
- **Remove:** Delete the `<TableOfContents>` block in `[...slug].astro` and the file itself. The body simplifies to a single column.

### Dark mode toggle

- **What:** Sun/moon button in the header. Respects `prefers-color-scheme` on first load, persists to `localStorage`. No FOUC.
- **Code:** `src/components/utilities/ThemeToggle.astro` + the two `<script is:inline>` blocks in `src/layouts/BaseLayout.astro` + `:root.dark` overrides in `src/styles/global.css`.
- **Remove:** see [customizing.md §dark-mode](./customizing.md#dark-mode).

### View transitions

- **What:** Smooth SPA-like page transitions (cross-fade by default) via Astro's `<ClientRouter />`.
- **Code:** `<ClientRouter />` in `src/layouts/BaseLayout.astro`; `transition:persist` on the `<header>` in `Header.astro`.
- **Cost:** ~5 KB of client JS (the only client JS on most pages).
- **Remove:** Delete `<ClientRouter />` from `BaseLayout.astro` and the `transition:persist` attribute in `Header.astro`.

### Reading time

- **What:** "X min read" on post pages, computed at build from word count.
- **Code:** `src/pages/blog/[...slug].astro` — `Math.ceil(wordCount / 200)`.
- **Remove:** Delete the meta-info span in `[...slug].astro`.

## SEO & feeds

### RSS feed

- **What:** `/rss.xml` with every published post, sorted by `pubDate`. Linked from `<head>` and the footer.
- **Code:** `src/pages/rss.xml.ts` using `@astrojs/rss`. Drafts excluded.
- **Remove:** Delete `src/pages/rss.xml.ts`, the `<link rel="alternate" type="application/rss+xml">` in `BaseLayout.astro`, the RSS entry in `Footer.astro`, and `@astrojs/rss` from `package.json`.

### Sitemap

- **What:** `sitemap-index.xml` + `sitemap-0.xml` listing every route. Auto-discovers from Astro's route list.
- **Code:** `@astrojs/sitemap` integration in `astro.config.mjs`.
- **Remove:** Delete the `sitemap()` line in `astro.config.mjs` and the dep.

### Open Graph / Twitter cards

- **What:** `<meta property="og:*">` and `<meta name="twitter:*">` tags on every page; per-page `title`, `description`, and `image` come from page props.
- **Code:** `astro-seo` in `src/layouts/BaseLayout.astro`.
- **Remove:** Drop `astro-seo` from the import and replace with hand-written `<meta>` tags.

### JSON-LD structured data

- **What:** Schema.org `BlogPosting`, `Person`, `WebSite`, `BreadcrumbList` injected as `<script type="application/ld+json">` on relevant pages. Helps Google build rich results.
- **Code:** `src/components/utilities/JsonLD.astro` used in `index.astro`, `[...slug].astro`, `[tag].astro`, `[...page].astro`, `authors/[slug].astro`.
- **Remove:** Delete the `<JsonLD>` calls and the component file.

### Canonical URLs

- **What:** Every page has a `<link rel="canonical">` with the absolute URL, derived from `Astro.site` (set in `astro.config.mjs`) + the current pathname.
- **Code:** `BaseLayout.astro` via `astro-seo`.
- **Why it matters:** Prevents duplicate-content issues if your site is reachable at multiple URLs.

## Tooling

### Type-checking

- `npm run type-check` runs `astro check` (TypeScript + Astro template checks).

### Linting

- `npm run lint` / `npm run lint:fix` — ESLint flat config with Astro, TypeScript, Prettier, simple-import-sort.

### Formatting

- `npm run format` / `npm run format:check` — Prettier with the Astro, Tailwind class-sorting, and JSON-sorting plugins.

### Image optimization

- **What:** `scripts/optimize-image.mjs` converts raw images in `public/images/_source/` into sized WebPs at the right output paths.
- **Code:** `scripts/optimize-image.mjs`; requires `sharp` (install with `npm i -D sharp` when you need it).
- **More:** [skills.md](./skills.md) — the `image-optimizer` skill in `.agents/skills/` knows how to drive this.

### Agent skills

- **What:** `.agents/skills/` with four skills: `content-writer`, `image-optimizer`, `frontend-design`, `skill-creator`.
- **More:** [skills.md](./skills.md).

## Features not included (you can add them)

### Search

- **Recommendation:** [Pagefind](https://pagefind.app). Runs at build time, produces a static index, ~50 KB JS.
- **Install:** `npm i -D pagefind`, add to your build script: `"build": "astro build && pagefind --site dist"`, then drop a Pagefind UI component on a page.

### Comments

- **Recommendation:** [Giscus](https://giscus.app) (GitHub Discussions-backed). Free, no tracking, single `<script>` tag.

### Newsletter signup

- **Recommendation:** [Buttondown](https://buttondown.com) or [Listmonk](https://listmonk.app) self-hosted. Embed the form in the footer or a CTA section.

### Analytics

- **Recommendation:** [Plausible](https://plausible.io) or [Umami](https://umami.is) — cookieless, GDPR-friendly. Single `<script>` tag in `BaseLayout.astro`.

### MDX

- **Add:** `npm i @astrojs/mdx`, add to `astro.config.mjs` integrations. Posts can then import components: `import Chart from '@/components/Chart.astro'`.
