---
name: image-optimizer
description: Scan raw photos in public/images/_source/ for un-optimized files, then run them through sharp to produce sized WebP outputs in public/images/blog/<slug>/ and public/images/authors/. Use this skill whenever the user mentions adding/optimizing/processing images, drops new blog or author photos, asks to "check for unoptimized images", or wants to refresh image assets for a post. Also use when the user asks about image organization conventions in this template.
---

# Image Optimizer

Convert raw images dropped in `public/images/_source/` into sized WebPs at the right paths under `public/images/`. Lightweight — uses `sharp` lazily via a small script the template ships with.

## When this skill applies

- "I added new photos for the X post, can you optimize them?"
- "Scan for unoptimized images"
- "Update my author avatar"
- "Why isn't my new image showing up?" (often = not yet converted to WebP)
- Any time a raw `.jpg`/`.jpeg`/`.png` is dropped into `public/images/_source/`

## Folder conventions

```
public/images/
├── _source/                      # raw originals (never referenced from markdown)
│   ├── blog/
│   │   └── <slug>/
│   │       ├── hero.png          # → public/images/blog/<slug>/hero.webp (1200×630)
│   │       ├── thumbnail.jpg     # → public/images/blog/<slug>/thumbnail.webp (600×400)
│   │       ├── image-1.jpg       # → public/images/blog/<slug>/image-1.webp (1200 wide)
│   │       └── image-2.jpg       # → public/images/blog/<slug>/image-2.webp (1200 wide)
│   └── authors/
│       └── <author-slug>.jpg     # → public/images/authors/<author-slug>.webp (512×512)
├── blog/
│   └── <slug>/                   # OUTPUT — referenced from markdown as /images/blog/<slug>/...
└── authors/                      # OUTPUT — referenced from src/data/authors.ts
```

**Filename → size preset mapping** (from `scripts/optimize-image.mjs`):

| Source filename pattern    | Preset    | Output dims      | Quality | Target size |
| -------------------------- | --------- | ---------------- | ------- | ----------- |
| `blog/<slug>/hero.*`       | hero      | 1200×630 cover   | 85      | ≤150 KB     |
| `blog/<slug>/thumbnail.*`  | thumbnail | 600×400 cover    | 82      | ≤50 KB      |
| `blog/<slug>/image-N.*`    | body      | 1200 wide, ratio | 82      | ≤100 KB     |
| `blog/<slug>/<other>.*`    | body      | 1200 wide, ratio | 82      | ≤100 KB     |
| `authors/<slug>.*`         | avatar    | 512×512 cover    | 85      | ≤80 KB      |

The filename of the source determines the preset, so if a user drops `my-photo.jpg` into `_source/blog/welcome/` and they meant it to be the hero, **rename it to `hero.jpg` first**.

## The workflow

### 1. Confirm raw files are in place

Ask the user where the new raw images are (or what slug they're for), or check `public/images/_source/` directly. If they handed you files outside the project, move/copy them into the correct `_source/<type>/...` folder first — the script only sees files there.

For new types of asset the user doesn't explicitly classify, infer:

- A photo intended for a specific blog post → `_source/blog/<slug>/<filename>`
- An author avatar → `_source/authors/<author-slug>.<ext>`

### 2. Check that sharp is installed

The script needs `sharp` as a devDependency. It's not included by default to keep the template lean. If not installed, run:

```bash
npm i -D sharp
```

(One-time. Sharp is ~30 MB on disk but only used at build time.)

### 3. Dry-run the scan to show what will happen

```bash
node scripts/optimize-image.mjs --dry
```

This lists pending conversions without writing anything. Show the output to the user before processing — it's cheap reassurance and lets them catch a misplaced file.

To restrict to one blog slug:

```bash
node scripts/optimize-image.mjs --dry --slug welcome
```

### 4. Run the optimization

```bash
node scripts/optimize-image.mjs                  # convert everything pending
node scripts/optimize-image.mjs --slug welcome   # one post only
node scripts/optimize-image.mjs --force          # re-convert even if output exists
```

The script:

- Walks every raw file under `public/images/_source/`
- Picks a preset based on the source filename pattern (see table above)
- Resizes & converts to WebP at the target quality
- Writes to the matching path under `public/images/`
- Skips files where the output already exists (use `--force` to override)

### 5. Report what was done

After the run, summarise:

- Which raw files were processed
- The output paths the user can now reference: `/images/blog/<slug>/hero.webp`, `/images/authors/<slug>.webp`
- Any files where the output size exceeded the target (rerun with smaller source if you care)
- Anything skipped because the output already existed

### 6. Wire the image into the site (if applicable)

Optimization alone doesn't make an image appear:

- **Blog hero:** set `image: '/images/blog/<slug>/hero.webp'` in the post's frontmatter.
- **Blog body images:** reference them in the markdown body with `![real alt](/images/blog/<slug>/image-N.webp)`.
- **Author avatar:** set `avatar: '/images/authors/<slug>.webp'` in `src/data/authors.ts`.

If a recently optimized image is for an existing post or author, offer to update those references — but don't auto-edit without asking.

## Edge cases

- **The user wants the output kept at original aspect (e.g. for a portrait hero):** the `hero` preset is fixed at 16:9 (1200×630). If they want portrait, rename the source to `image-1.*` (the body preset preserves aspect at 1200 wide), or have the user request a custom override and update the script.
- **The user re-saves an existing raw with the same filename:** the script skips it because the output already exists. Use `--force`.
- **A raw image is huge (10MB+):** sharp handles it, but conversion is slower. Suggest the user downsize the raw before committing.
- **WebP source files** are also accepted as inputs — the script will resize them and re-write at the target quality.

## Why this design

- **Filename determines preset** — no manifest file, no separate config. The convention is the API; if it ever doesn't fit, edit the preset table in `scripts/optimize-image.mjs`.
- **Sharp is lazy-loaded** — the template doesn't ship sharp by default, but the script fails gracefully with the install command if it's missing. Users who never optimize images locally pay zero install cost.
- **Idempotent by default** — running the script twice does nothing the second time. Safe to suggest casually; safe to wire into a pre-commit hook later if a project grows.
- **Sources and outputs live in different folders** — `public/images/_source/` is for raw originals (which still ship to production because of how Astro treats `public/`, so consider gitignoring it for large repos), and `public/images/<type>/` is what markdown and code reference.
