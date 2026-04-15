import RSSParser from 'rss-parser'
import { db } from '@/db'
import { newsItems } from '@/db/schema'

const parser = new RSSParser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure'],
  },
})

// Fuentes RSS de webs deportivas en español
const RSS_SOURCES = [
  {
    name: 'ESPN' as const,
    url: 'https://www.espn.com.co/espn/rss/news',
    fallback: 'https://feeds.a.espncdn.com/apis/devcenter/v2/sports/soccer/fifa.world/news',
  },
  {
    name: 'AS' as const,
    url: 'https://as.com/rss/tags/seleccion_colombia.xml',
    fallback: 'https://as.com/rss.xml',
  },
  {
    name: 'MARCA' as const,
    url: 'https://e00-marca.uecdn.es/rss/futbol/colombia.xml',
    fallback: 'https://www.marca.com/rss/futbol.html',
  },
  {
    name: 'EL_TIEMPO' as const,
    url: 'https://www.eltiempo.com/rss/deportes.xml',
    fallback: 'https://www.eltiempo.com/rss/colombia.xml',
  },
]

const COLOMBIA_KEYWORDS = [
  'colombia', 'tricolor', 'cafeteros', 'luis díaz', 'james rodríguez',
  'falcao', 'cuadrado', 'ospina', 'lerma', 'yerry mina', 'mojica',
  'arias', 'córdoba', 'selección colombia',
]

function matchesColombiaKeywords(text: string): boolean {
  const lower = text.toLowerCase()
  return COLOMBIA_KEYWORDS.some((kw) => lower.includes(kw))
}

function extractImageUrl(item: Record<string, unknown>): string | null {
  // Try different possible image fields
  const mediaContent = item['media:content'] as { $?: { url?: string } } | undefined
  if (mediaContent?.$?.url) return mediaContent.$.url

  const mediaThumbnail = item['media:thumbnail'] as { $?: { url?: string } } | undefined
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url

  const enclosure = item['enclosure'] as { url?: string } | undefined
  if (enclosure?.url) return enclosure.url

  // Try to extract from content
  const content = (item.content || item['content:encoded'] || '') as string
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i)
  if (imgMatch?.[1]) return imgMatch[1]

  return null
}

export async function syncRSSFeeds(): Promise<{ added: number; skipped: number; errors: number }> {
  let added = 0
  let skipped = 0
  let errors = 0

  for (const source of RSS_SOURCES) {
    let feed

    // Try primary URL, fall back to secondary
    try {
      feed = await parser.parseURL(source.url)
    } catch {
      try {
        feed = await parser.parseURL(source.fallback)
      } catch (err) {
        console.error(`Error fetching RSS from ${source.name}:`, err)
        errors++
        continue
      }
    }

    for (const item of feed.items) {
      if (!item.link || !item.title) continue

      const textToCheck = `${item.title} ${item.contentSnippet || ''}`
      if (!matchesColombiaKeywords(textToCheck)) {
        skipped++
        continue
      }

      try {
        await db
          .insert(newsItems)
          .values({
            externalUrl: item.link,
            title: item.title,
            excerpt: item.contentSnippet?.slice(0, 300) || null,
            imageUrl: extractImageUrl(item as unknown as Record<string, unknown>),
            source: source.name,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          })
          .onConflictDoNothing() // Skip if externalUrl already exists

        added++
      } catch {
        skipped++
      }
    }
  }

  console.log(`RSS sync: +${added} added, ${skipped} skipped, ${errors} errors`)
  return { added, skipped, errors }
}
