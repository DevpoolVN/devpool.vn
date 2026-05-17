export type AuthorLink = {
  label: string
  href: string
  icon?: string
}

export type AuthorProject = {
  name: string
  description: string
  href?: string
}

export type Author = {
  slug: string
  name: string
  role?: string
  bio: string
  avatar?: string
  location?: string
  links: AuthorLink[]
  projects: AuthorProject[]
}

export const AUTHORS: Record<string, Author> = {
  default: {
    slug: 'default',
    name: 'Your Name',
    role: 'Writer & developer',
    bio: 'Short bio — one or two sentences about who you are, what you do, and what you write about. Edit this in src/data/authors.ts.',
    avatar: '/images/authors/default.svg',
    location: 'Somewhere on Earth',
    links: [
      { label: 'Website', href: 'https://example.com', icon: 'lucide:globe' },
      { label: 'GitHub', href: 'https://github.com/yourname', icon: 'lucide:github' },
      { label: 'Twitter', href: 'https://twitter.com/yourname', icon: 'lucide:twitter' },
      { label: 'Email', href: 'mailto:hello@example.com', icon: 'lucide:mail' },
    ],
    projects: [
      {
        name: 'Astrolabe',
        description: 'A simple, lightweight Astro 6 + Tailwind v4 blog starter.',
        href: 'https://github.com/yourname/astrolabe',
      },
      {
        name: 'Another project',
        description: 'A short, one-line description of what it does and why it matters.',
        href: 'https://example.com/project',
      },
    ],
  },
}

export function getAuthor(slug: string | undefined): Author {
  if (slug && AUTHORS[slug]) return AUTHORS[slug]
  return AUTHORS.default
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS)
}
