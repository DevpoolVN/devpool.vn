// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'

/**
 * Feature route map: URL pattern → feature page entrypoint.
 * Replaces `src/pages/` filesystem routing. Each feature owns its pages.
 */
const featureRoutes = [
  { pattern: '/', entrypoint: './src/features/landing/pages/index/index.astro' },
]

/**
 * Inject routes from featureRoutes — lets us skip `src/pages/`.
 * @type {import('astro').AstroIntegration}
 */
const featureRouter = {
  name: 'feature-router',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      for (const route of featureRoutes) injectRoute(route)
    },
  },
}

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  integrations: [icon(), sitemap(), featureRouter],

  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
      wrap: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
