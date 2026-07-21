// Product scraping service — extract product image from URL via OpenGraph meta tags

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
]

export async function scrapeProductImage(url) {
  for (const proxy of CORS_PROXIES) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url), { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const html = await res.text()

      // Try OpenGraph image
      const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
      if (ogMatch?.[1]) return { imageUrl: ogMatch[1], source: 'og:image' }

      // Try Twitter card image
      const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      if (twMatch?.[1]) return { imageUrl: twMatch[1], source: 'twitter:image' }

      // Try first large image in HTML
      const imgMatch = html.match(/<img[^>]*src=["']([^"']+\.(jpg|jpeg|png|webp)[^"']*)["']/i)
      if (imgMatch?.[1]) {
        let src = imgMatch[1]
        if (src.startsWith('/')) {
          const u = new URL(url)
          src = u.origin + src
        }
        return { imageUrl: src, source: 'img tag' }
      }
    } catch (e) {
      continue
    }
  }
  return null
}

// Extract product title from HTML
export async function scrapeProductTitle(url) {
  for (const proxy of CORS_PROXIES) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url), { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const html = await res.text()
      const titleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
        || html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return titleMatch?.[1]?.trim() || 'Unknown Product'
    } catch (e) {
      continue
    }
  }
  return 'Unknown Product'
}
