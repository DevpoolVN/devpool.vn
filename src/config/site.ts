export const SITE = {
  title: 'Astrolabe',
  description:
    'A simple, lightweight Astro 6 + Tailwind v4 starter with a markdown blog. Named for the old instrument that helped travelers find their bearings by the stars.',
  url: 'https://example.com',
  email: 'hello@example.com',
  defaultAuthor: 'default',
  postsPerPage: 6,
} as const

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
] as const
