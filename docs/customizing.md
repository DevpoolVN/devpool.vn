# Customizing

How to change the look without breaking anything. Almost everything visual is driven by CSS custom properties in `src/styles/global.css`.

## Theme tokens

Light and dark palettes are defined as CSS custom properties. Components reference them via Tailwind utilities like `bg-ink`, `text-muted`, `border-border` — the utility names come from `@theme {}`.

```css
/* src/styles/global.css */

@theme {
  --color-ink: #1a1a1a;
  --color-muted: #6b6b6b;
  --color-surface: #ffffff;
  --color-surface-alt: #f6f5f1;
  --color-border: #e5e3dc;
  --color-accent: #b45309;
  --color-accent-dark: #92400e;

  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
}

:root.dark {
  --color-ink: #f2f2f2;
  --color-muted: #9a9a9a;
  --color-surface: #0d0d0d;
  --color-surface-alt: #1a1a1a;
  --color-border: #2a2a2a;
  --color-accent: #f59e0b;
  --color-accent-dark: #fbbf24;
}
```

Change the hex values; the rest of the site updates. The token names are stable — don't rename them unless you also update component classes.

## Fonts

Two font families: `font-sans` (body) and `font-serif` (headings, brand). Fonts load from Google Fonts in `src/layouts/BaseLayout.astro`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap"
  rel="stylesheet"
/>
```

To swap fonts:

1. Update the Google Fonts URL above with your chosen families.
2. Update the `--font-sans` and `--font-serif` tokens in `global.css`.
3. (Optional) Self-host the fonts by dropping `.woff2` files in `public/fonts/` and writing `@font-face` declarations instead of using the Google CDN.

## Dark mode

Dark mode is class-based via Tailwind v4's `@custom-variant dark (&:where(.dark, .dark *))`. The toggle:

- Reads system preference (`prefers-color-scheme: dark`) on first load.
- Persists user choice in `localStorage` under key `theme`.
- Boots before paint via an inline script in `BaseLayout.astro` (no FOUC).
- Re-applies on Astro view-transition swaps.

**Force a default mode:** edit the bootstrap script in `src/layouts/BaseLayout.astro` to set `dark = true` (or `false`) regardless of system.

**Remove dark mode entirely:**

1. Delete `src/components/utilities/ThemeToggle.astro`.
2. Remove `<ThemeToggle />` from `src/components/organisms/Header.astro`.
3. Remove the `@custom-variant dark` line and the `:root.dark` block from `global.css`.
4. Remove the two `<script is:inline>` blocks from `BaseLayout.astro`.

## Navigation

The header / footer nav comes from the `NAV` array in `src/config/site.ts`:

```ts
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
] as const
```

Add or remove entries; the header and footer both update. Add a "Projects" page? Create `src/pages/projects.astro`, then add `{ label: 'Projects', href: '/projects/' }`.

## Header & footer

Edit `src/components/organisms/Header.astro` and `Footer.astro` directly. They're plain Astro components, no abstraction layer. The header is `sticky top-0` by default with a translucent backdrop.

## Brand / logo

The header brand is just the site title rendered in `font-serif`. To use a logo image:

```astro
<a href="/" class="flex items-center gap-3">
  <img src="/logo.svg" alt={SITE.title} class="h-8 w-8" />
  <span class="font-serif text-2xl font-bold">{SITE.title}</span>
</a>
```

Drop your `logo.svg` in `public/`.

## Favicon

Replace `public/favicon.svg`. SVG is preferred — modern browsers use it; older ones fall back to nothing (which is fine). Add a `favicon.ico` and additional sizes if you care about legacy support; reference them from `<head>` in `BaseLayout.astro`.

## Posts per page

In `src/config/site.ts`:

```ts
export const SITE = {
  // ...
  postsPerPage: 6,
} as const
```

The blog index uses this for pagination. Anything from 6–12 is reasonable.

## Layout width

Containers use Tailwind's `container mx-auto px-6 md:px-8`. To widen or narrow content, edit the layout files (`BaseLayout.astro`, `PageLayout.astro`) or individual page files.

Common max-widths in use:

- Post body: `max-w-3xl`
- Post container (with TOC sidebar): `max-w-6xl`
- About / author: `max-w-4xl`

## Per-page customization

Pages take `title`, `description`, and `image` props on `PageLayout` to drive SEO:

```astro
<PageLayout
  title="My specific page"
  description="What this page is, in 150 chars."
  image="/images/og/my-page.png"
>
  <!-- ... -->
</PageLayout>
```

## Component styles

Components are unstyled outside of Tailwind utilities — there's no `Button.module.css` or styled-components anywhere. To add a variant to `Button`:

```astro
---
// src/components/atoms/Button.astro
const variants = {
  primary: 'bg-ink text-white hover:bg-accent',
  secondary: 'bg-surface-alt text-ink hover:bg-border',
  ghost: 'text-ink hover:text-accent',
  // add new variants here
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
}
---
```

## Prose styles

Markdown body styles (`.prose` on the post page) use Tailwind Typography (`@tailwindcss/typography`) plus overrides in `global.css` to tie them to the theme tokens. Edit the `.prose :where(...)` rules to change link color, quote styling, etc.

## Going further

- **Add an RSS-only category feed:** copy `src/pages/rss.xml.ts` to `src/pages/rss/<tag>.xml.ts` and filter posts by tag.
- **Add a different content collection** (e.g. notes, links): define it in `src/content.config.ts`, then add a page that reads `getCollection('notes')`.
- **Replace Tailwind with vanilla CSS:** delete the Tailwind plugin from `astro.config.mjs`, remove `@tailwindcss/vite` and `tailwindcss` from `package.json`, and write CSS in `global.css` directly. Components will lose styling — rewrite class lists or apply via `<style>` blocks.
