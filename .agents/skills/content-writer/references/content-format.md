# Content Format

The markdown format for blog posts in this Astro template. This is informed by:

- **The project's existing schema** in `src/content.config.ts` and the layout at `src/pages/blog/[...slug].astro`.
- **Markdown best practices for editorial content** — semantic headings, scannable structure, image placement that aids reading rather than interrupting it.

This file is the source of truth for _structure_. The companion file `writing-standard.md` is the source of truth for _voice_.

---

## 1. File location and naming

```
src/content/blog/<slug>.md
```

- `<slug>` is kebab-case, ASCII only, ≤ 60 characters.
- Generated from a sensible compression of the title with diacritics stripped: a post titled "Hội An Lantern Festival, a Field Guide" becomes `hoi-an-lantern-festival-field-guide.md`.
- The slug becomes the URL: `/blog/<slug>/`.

---

## 2. Frontmatter

Match the `blog` collection schema in `src/content.config.ts`:

```yaml
---
title: 'The Lanterns of Hội An: A Field Guide to the Monthly Festival'
description: "Hội An turns off its streetlights on the 14th day of every lunar month. A practical and honest guide for travelers who already know the basics."
pubDate: 2026-05-17
updatedDate: 2026-05-20
author: 'default'
image: '/images/blog/hoi-an-lantern-festival/hero.webp'
tags: ['Hội An', 'Festival', 'Culture', 'Travel Guide']
draft: false
---
```

### Field-by-field

| Field         | Required                 | Rule                                                                                                                                                              |
| ------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | yes                      | Sentence case or title case — be consistent within a site. Avoid clickbait ("You Won't Believe…"). Avoid empty hype words ("Ultimate Guide to…"). Be specific.    |
| `description` | yes                      | 150–160 characters. Written for humans first, search engines second. Should make a reader want to click. NEVER duplicate the title; extend it with the angle.     |
| `pubDate`     | yes                      | ISO date (`YYYY-MM-DD`). Today's date when first publishing.                                                                                                      |
| `updatedDate` | optional                 | Add when you substantively revise an existing post. Don't add for typo fixes.                                                                                     |
| `author`      | optional                 | Slug from `src/data/authors.ts`. Defaults to `'default'`. Add the author there first if you need a new one.                                                       |
| `image`       | optional but recommended | Path to the hero image — `/images/blog/<slug>/hero.webp`. Used by the layout for the hero, the listing card, and `og:image`.                                      |
| `tags`        | yes (defaults to `[]`)   | 3–6 tags. Capitalize. Use existing tags when possible. New tags should be reusable across at least 2–3 future posts. Tag URLs are kebab-case (handled by code).   |
| `draft`       | optional                 | `true` excludes the post from the listing, tag pages, and RSS. Use for WIP.                                                                                       |

### Field rules expressed as anti-patterns

- ❌ `description: 'A blog post about X.'` — Meta description; reader gains nothing.
- ❌ `tags: ['blog', 'post', 'article']` — Generic; not useful for filtering.
- ❌ `title: 'React State'` — Same as a doc page title. Add the angle.
- ❌ `pubDate: '2026'` — Must be a full ISO date.
- ❌ `author: 'Vova'` (when only `'default'` exists in `src/data/authors.ts`) — The page renders but the author link is broken.

---

## 3. Body structure

The blog layout renders the title as `<h1>` from frontmatter. **Start the markdown body with the lead paragraph — no `# Title` line.** A second-level `## Section` is the highest heading you should use in the body. Headings (`##`, `###`) populate the table of contents automatically.

Body skeleton:

```markdown
[Lead paragraph — the hook. 2–4 sentences. Specific, sensory, no clichés.]

[Optional second paragraph — extends the hook or transitions to the body.]

![Image alt text describing the scene specifically](/images/blog/<slug>/hero.webp)

## First Section Heading (concrete noun, not adjective)

[Body content. Mix prose, lists, and the occasional callout.]

### Optional subsection

[More detail. Keep H3s to 0–3 per section.]

## Second Section Heading

...

## Practical info / How to / What to know

[Useful service-journalism details — when applicable.]

## Close

[A short final movement. See writing-standard.md §2 "The close".]
```

### Heading rules

- **Only H2 and H3 in the body.** H1 is the title (frontmatter). H4 is almost never needed; if you reach for one, the section is too big — split it.
- **Headings are concrete nouns or short phrases**, not adjectives. ✅ "The river at dusk" / "Cao lầu and where to find it". ❌ "Stunning Scenery" / "Delicious Local Food".
- **Sentence case is fine.** Title case is also fine. Pick one per post and stick with it.

### Section count and length

- A 1000-word post: 3–5 H2 sections.
- A 1500-word post: 5–7 H2 sections.
- A 2500-word long-read: 6–9 H2 sections, with H3s in the larger ones.
- A section under ~80 words is almost always too small — fold it into a neighbor.

---

## 4. Structural patterns

Pick one when planning a post. Mixing two is fine; trying to be all of them at once produces mush.

### A. Guide

Practical, service-journalism pieces.

```
Lead (scene or a tip)
## What it is
## Getting there / when to do it
## What to do / see / use
## Practical info (costs, requirements, etiquette)
## What to skip (optional but valued)
## Close
```

### B. Deep-Dive

A craft, a tradition, a technology, an idea. Long-form, research-driven.

```
Lead (a specific maker, scene, or fact)
## The thing itself (what it is)
## How it works (process, technique, mechanism)
## Where it comes from (history, woven into scenes)
## Who keeps it alive today / where it's going (named people)
## How to engage with it (as a visitor, user, or learner)
## Close
```

### C. Subject / Place Portrait

A single street, building, neighborhood, tool, company, person.

```
Lead (a single, specific moment)
## The subject in space/context
## The subject in time (history, sparingly)
## The people involved
## The subject at different hours / from different angles
## How to engage
## Close
```

### D. How-To

For a single specific skill.

```
Lead (why this is worth knowing)
## The short version (3–5 bullets — the answer for the impatient)
## The longer version (step-by-step)
## Common mistakes
## When to skip the rules (optional)
## Close
```

### E. Human Story

For a person, a family, a profession.

```
Lead (a specific moment with the person)
## The work
## How they got here
## What they say about it (real quotes)
## What it means for the broader subject
## Close
```

### F. Themed Listicle-with-Narrative

```
Lead (why this list, why these picks)
## 1. [Specific name] — [the hook]
[Two or three sentences of real content per entry.]
## 2. ...
## Close
```

Avoid numbering when the order is arbitrary.

### G. Opinion / Argument

```
Lead (the claim, stated plainly)
## The conventional wisdom
## Where it breaks down
## What I think instead
## Where my argument is weakest (honest concession)
## What changes if you accept the argument
## Close
```

---

## 5. Paragraphs, lists, and callouts

### Paragraphs

- One idea per paragraph.
- 2–5 sentences each. A single-sentence paragraph is fine for emphasis; using them in a row is shouting.
- Mix long and short paragraphs.

### Bullet lists

Use bullets when:

- The order doesn't matter.
- The items are parallel.
- The reader benefits from scannability over rhythm.

### Numbered lists

Use numbered lists when:

1. The order genuinely matters (steps, rankings).
2. The reader will want to refer back to a specific item by number.

### Bold and italic

- **Bold** for the first instance of a key term or a price/time worth scanning to. Don't bold whole sentences.
- _Italic_ for non-English terms on first use (`*cao lầu*`, `*déjà vu*`) and for emphasis.

### Callouts (blockquotes)

The template uses standard `>` blockquotes:

```markdown
> **Tip:** Bring small bills. The 100,000₫ stalls don't carry change after 9 p.m.
```

```markdown
> "I have made lanterns for forty years. The trick is the wood, not the silk."
> — Ông Hùng, lantern maker
```

Use callouts sparingly — 1–3 per post.

### Tables

```markdown
| Activity            | Best time       | Cost              |
| ------------------- | --------------- | ----------------- |
| Walking the streets | 6:00 – 8:30 PM  | Free              |
| Boat ride           | 7:00 – 9:00 PM  | 150,000₫ / boat   |
```

---

## 6. Images

### File path

All blog images live under `public/images/blog/<slug>/`. Always reference them with absolute paths starting `/images/blog/<slug>/...` — never with relative paths, never from `src/`.

```markdown
![Three children release red and yellow paper lanterns onto the river at dusk](/images/blog/hoi-an-lantern-festival/image-2.webp)
```

### Filenames

| Image                                   | Filename                                               |
| --------------------------------------- | ------------------------------------------------------ |
| Featured / hero (used in frontmatter)   | `hero.webp`                                            |
| Body images                             | `image-1.webp`, `image-2.webp`, … (sequential)         |
| Anything else specific                  | descriptive kebab-case: `lantern-makers-workshop.webp` |

### Specifications

| Type         | Dimensions       | Aspect | Max size |
| ------------ | ---------------- | ------ | -------- |
| Hero         | 1200×630         | 16:9   | 150 KB   |
| Thumbnail    | 600×400          | 3:2    | 50 KB    |
| Body content | 800–1200 px wide | varies | 100 KB   |

Format is **always WebP** at quality 80–85. Raw originals belong in `public/images/_source/blog/<slug>/` so they can be re-optimized later. Invoke the `image-optimizer` skill to convert raws into the right sizes.

### Alt text

Alt text must describe what's in the image specifically — not the topic of the post. ❌ `![Hội An Lantern Festival]` ✅ `![Three children release red and yellow paper lanterns onto the river at dusk]`.

### Placement

- **One hero**, declared in frontmatter. It renders both at the top of the post and on the listing card.
- **Body images** roughly every 200–400 words, where they support the surrounding text.
- Don't place two images back-to-back without prose between.
- Caption images only when the caption adds information the alt doesn't carry to sighted readers. Italic on the line below: `*Floating lanterns on the Thu Bồn River, 2024.*`

### Placeholders when an image isn't available

If the article calls for an image you can't source, still include the markdown — the file slot is reserved:

```markdown
![Close-up of a lantern maker's hands gluing red silk to a bamboo frame](/images/blog/<slug>/image-3.webp)
```

Track the missing file in the post-write report. Don't link to remote image URLs in the published post body.

---

## 7. Links

### Internal links

Cross-link with simple absolute paths — no language prefix is needed in this template:

```markdown
For more on this, see [the welcome post](/blog/welcome/).

You can also browse all [Astro posts](/blog/tags/astro/).
```

Tag links use kebab-case: `/blog/tags/getting-started/` not `/blog/tags/Getting Started/`.

### External links

Use descriptive link text (not "click here", not the bare URL):

```markdown
The festival is listed on [UNESCO's intangible heritage register](https://ich.unesco.org/en/RL/hoi-an-lantern-festival-00123).
```

---

## 8. Special characters and code

### Diacritics

In body text, **keep diacritics**: Hội An, Trần Phú, déjà vu, café. In URL slugs, **strip them**: `hoi-an-lantern-festival`.

### Currency

- Write currency how locals do: `30,000₫`, `$1.20`, `€15`.
- Convert when it helps an international reader calibrate: `30,000₫ (about $1.20)`. Don't convert every price.

### Em dashes

Use them with no surrounding spaces — like this — for parenthetical asides.

### Code

Fenced code blocks with a language tag for syntax highlighting:

````markdown
```ts
export function greet(name: string) {
  return `Hello, ${name}!`
}
```
````

Inline code with backticks: `useState`, `npm run dev`.

---

## 9. The minimum viable post — copy-paste skeleton

```markdown
---
title: 'TITLE — specific, with the angle, no clickbait'
description: 'One sentence that extends the title with a concrete promise (150–160 chars).'
pubDate: 2026-MM-DD
author: 'default'
image: '/images/blog/<slug>/hero.webp'
tags: ['Tag One', 'Tag Two', 'Tag Three']
draft: false
---

LEAD PARAGRAPH — drop the reader into a specific scene, fact, or claim. 2–4 sentences.

OPTIONAL SECOND PARAGRAPH — extend the hook or transition.

![ALT: describe the image specifically](/images/blog/<slug>/hero.webp)

## FIRST SECTION (concrete noun heading)

Body. Mix prose with the occasional list.

- Specific, useful point one
- Specific, useful point two
- Specific, useful point three

> **Tip:** A specific, useful tip in one sentence.

## SECOND SECTION

More body. Maybe a quote.

> "A real, attributed quote no longer than two sentences."
> — Name, role

![ALT: describe specifically](/images/blog/<slug>/image-1.webp)

### A subsection if needed

Use H3 sparingly — only when the section is too long otherwise.

## Practical info (optional)

| Item  | Detail          |
| ----- | --------------- |
| When  | Specific time   |
| Where | Specific place  |
| Cost  | Specific number |

## Closing section

A short final movement — return to the opening image, or send the reader somewhere specific. Resist the urge to recap.
```

---

## 10. Checklist before saving

1. **Schema** — every required field present, validates against `src/content.config.ts`?
2. **Slug** — kebab-case, ASCII, ≤ 60 characters?
3. **No `# Title` H1 in the body?**
4. **Headings are concrete nouns, not adjectives?**
5. **Hero image declared in frontmatter, present (or placeholder) at `/images/blog/<slug>/hero.webp`?**
6. **Every body image has a real, specific alt?**
7. **External links have descriptive text, not bare URLs?**
8. **Internal links use absolute paths starting `/`?**
9. **Diacritics correct in body, stripped in slug?**
10. **Description is 150–160 chars and not a paraphrase of the title?**
11. **Tags are 3–6, capitalized, reusable?**
12. **`author` slug exists in `src/data/authors.ts`?**

If all yes, save and report.
