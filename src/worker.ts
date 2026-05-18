interface Env {
  ASSETS: Fetcher
  SITE_URL?: string
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (env.SITE_URL && url.hostname.endsWith('.workers.dev')) {
      const target = new URL(env.SITE_URL)
      target.pathname = url.pathname
      target.search = url.search
      return Response.redirect(target.toString(), 301)
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
