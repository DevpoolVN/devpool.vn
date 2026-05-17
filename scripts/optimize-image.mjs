#!/usr/bin/env node
/**
 * optimize-image.mjs
 *
 * Convert raw images in public/images/_source/ into sized WebPs in public/images/.
 * Lightweight: needs `sharp` as a devDependency — install once with `npm i -D sharp`.
 *
 * Usage:
 *   node scripts/optimize-image.mjs                 # scan & convert all pending
 *   node scripts/optimize-image.mjs --dry           # show what would happen
 *   node scripts/optimize-image.mjs --slug <slug>   # restrict to one blog slug
 *   node scripts/optimize-image.mjs --force         # re-convert even if output exists
 *
 * Source layout:
 *   public/images/_source/blog/<slug>/<filename>.{jpg,jpeg,png,webp}
 *   public/images/_source/authors/<slug>.{jpg,jpeg,png}
 *
 * Filename convention determines size preset:
 *   hero.*       -> 1200x630, q85, ~150 KB target  (blog hero)
 *   thumbnail.*  -> 600x400,  q82, ~50 KB target   (blog thumbnail)
 *   image-N.*    -> 1200 wide, q82, ~100 KB target (blog body)
 *   authors/<x>  -> 512x512, q85, ~80 KB target    (author avatar)
 *   anything else under blog/<slug>/ -> 1200 wide, q82, ~100 KB target
 */

import { readdir, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'public', 'images', '_source')
const OUT = path.join(ROOT, 'public', 'images')

const ARGS = process.argv.slice(2)
const DRY = ARGS.includes('--dry')
const FORCE = ARGS.includes('--force')
const slugArgIdx = ARGS.indexOf('--slug')
const SLUG_FILTER = slugArgIdx >= 0 ? ARGS[slugArgIdx + 1] : null

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('[optimize-image] `sharp` is not installed.')
  console.error('  Install it with: npm i -D sharp')
  process.exit(1)
}

const PRESETS = {
  hero: { width: 1200, height: 630, fit: 'cover', quality: 85 },
  thumbnail: { width: 600, height: 400, fit: 'cover', quality: 82 },
  body: { width: 1200, quality: 82 },
  avatar: { width: 512, height: 512, fit: 'cover', quality: 85 },
}

function presetFor(relPath) {
  // relPath is like "blog/<slug>/hero.png" or "authors/default.jpg"
  const parts = relPath.split(path.sep)
  if (parts[0] === 'authors') return PRESETS.avatar
  if (parts[0] === 'blog') {
    const base = path.basename(parts[parts.length - 1], path.extname(parts[parts.length - 1]))
    if (base === 'hero') return PRESETS.hero
    if (base === 'thumbnail') return PRESETS.thumbnail
    return PRESETS.body
  }
  return PRESETS.body
}

function outputPathFor(relPath) {
  // Replace extension with .webp, keep folder structure
  const parsed = path.parse(relPath)
  return path.join(OUT, parsed.dir, `${parsed.name}.webp`)
}

async function walk(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

async function ensureDir(p) {
  await mkdir(path.dirname(p), { recursive: true })
}

async function convert(sourceAbs) {
  const rel = path.relative(SRC, sourceAbs)
  if (SLUG_FILTER && !rel.includes(SLUG_FILTER)) return null
  const outAbs = outputPathFor(rel)
  const exists = existsSync(outAbs)
  const action = exists && !FORCE ? 'skip' : DRY ? 'plan' : 'write'
  const preset = presetFor(rel)

  if (action !== 'skip' && action !== 'plan') {
    await ensureDir(outAbs)
    let pipeline = sharp(sourceAbs)
    if (preset.height) {
      pipeline = pipeline.resize({ width: preset.width, height: preset.height, fit: preset.fit })
    } else {
      pipeline = pipeline.resize({ width: preset.width, withoutEnlargement: true })
    }
    await pipeline.webp({ quality: preset.quality }).toFile(outAbs)
  }

  const sizeKb = action === 'write' ? Math.round((await stat(outAbs)).size / 1024) : null
  return { rel, out: path.relative(ROOT, outAbs), action, sizeKb }
}

async function main() {
  if (!existsSync(SRC)) {
    console.log(`[optimize-image] No source directory at ${path.relative(ROOT, SRC)} — nothing to do.`)
    console.log(`  Drop raw images in public/images/_source/blog/<slug>/ or public/images/_source/authors/`)
    return
  }

  const sources = await walk(SRC)
  if (sources.length === 0) {
    console.log('[optimize-image] No raw images found.')
    return
  }

  console.log(`[optimize-image] Found ${sources.length} source file(s)${DRY ? ' (DRY RUN)' : ''}`)
  for (const sourceAbs of sources) {
    const result = await convert(sourceAbs)
    if (!result) continue
    const flag = result.action === 'skip' ? '·' : result.action === 'plan' ? '?' : '✓'
    const size = result.sizeKb ? ` (${result.sizeKb} KB)` : ''
    console.log(`  ${flag} ${result.rel}  →  ${result.out}${size}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
