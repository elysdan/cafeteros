import * as cheerio from 'cheerio'
import { db } from '@/db'
import { newsItems } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { SCRAPING_SOURCES } from './config'
import { ScrapedNews } from './types'

// Chrome Windows 10 User-Agent (Very common, avoids 403 blocks)
const FAKE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1'
}

export interface ScraperOptions {
  startDate?: Date
  endDate?: Date
  selectedSources?: string[]
  customUrls?: string[]
  customDateFormat?: string
}

export async function runScraper(options: ScraperOptions = {}) {
  console.log('🚀 Iniciando recolector de noticias con opciones:', options)
  let totalSaved = 0

  // Determine which targets to process
  let targets: { sourceName: any, urlToScrape: string, config?: any }[] = []

  // 1. Process selected predefined sources
  if (!options.selectedSources || options.selectedSources.length === 0) {
    if (!options.customUrls || options.customUrls.length === 0) {
      targets = SCRAPING_SOURCES.map(s => ({ sourceName: s.name, urlToScrape: s.url, config: s }))
    }
  } else {
    const filtered = SCRAPING_SOURCES.filter(s => options.selectedSources?.includes(s.name))
    targets = filtered.map(s => ({ sourceName: s.name, urlToScrape: s.url, config: s }))
  }

  // 2. Process custom URLs
  if (options.customUrls && options.customUrls.length > 0) {
    for (const url of options.customUrls) {
      const matchedSource = SCRAPING_SOURCES.find(s => {
        try {
          const configDomain = new URL(s.url).hostname.replace('www.', '')
          const targetDomain = new URL(url).hostname.replace('www.', '')
          return targetDomain.includes(configDomain) || configDomain.includes(targetDomain)
        } catch { return false }
      })

      if (matchedSource) {
        targets.push({ sourceName: matchedSource.name, urlToScrape: url, config: matchedSource })
      } else {
        // Unknown source, use "OTHER"
        targets.push({ sourceName: 'OTHER', urlToScrape: url })
      }
    }
  }

  // Define generic selectors for Fallback List Scraping
  const genericSelectors = {
    container: 'article, .nota, .s-nota, .news-item, .post, .card, .item, li.news, .article, .list-item, .s',
    title: 'h1, h2, h3, .title, .titulo, .headline, .s-tl',
    link: 'a',
    image: 'img, picture source',
    date: 'time, .date, .fecha, .published, .s-date',
    excerpt: 'p, .excerpt, .bajada, .resumen, .description, .s-txt'
  }

  for (const target of targets) {
    const { sourceName, urlToScrape, config } = target
    console.log(`\n📡 Conectando a ${sourceName} [${urlToScrape}]...`)

    try {
      const results: ScrapedNews[] = []

      // --- ESPN WAF BYPASS STRATEGY ---
      // ESPN blocks server-side scraping (AWS WAF 202 Accepted). Usamos su API oficial oculta.
      if (urlToScrape.includes('espn.com')) {
        console.log(`📌 ESPN detectado. Usando API JSON oficial para evadir bloqueo WAF y obtener imágenes...`)
        try {
          // Usamos el endpoint de la Primera A de Colombia, que trae noticias completas con imágenes
          const apiRes = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/col.1/news')
          const data = await apiRes.json()
          
          if (data.articles && Array.isArray(data.articles)) {
            let itemsFound = 0
            for (const article of data.articles) {
              if (itemsFound >= 10 && !config) break
              
              // Si el usuario especificó un ID de noticia, intentamos filtrar
              const specificArticleMatch = urlToScrape.match(/\/(nota|story)\/_.*?\/id\/(\d+)/)
              const articleId = String(article.id)
              
              if (specificArticleMatch && articleId !== specificArticleMatch[2] && (!article.links?.web?.href || !article.links.web.href.includes(specificArticleMatch[2]))) {
                continue
              }

              const image = article.images && article.images.length > 0 ? article.images[0].url : null

              results.push({
                source: sourceName === 'OTHER' ? 'ESPN' : sourceName,
                title: article.headline?.trim() || '',
                url: article.links?.web?.href || urlToScrape,
                imageUrl: image,
                excerpt: (article.description || '').trim().substring(0, 255),
                publishedAt: article.published ? new Date(article.published) : new Date()
              })
              itemsFound++
            }

            // Si pidieron noticia específica pero ya no está en los recientes, traemos el top actual
            if (results.length === 0 && urlToScrape.match(/\/(nota|story)\/_.*?\/id\/(\d+)/)) {
              console.log(`Noticia específica no encontrada en API reciente. Trayendo últimas noticias como fallback...`)
              for (const article of data.articles.slice(0, 5)) {
                const image = article.images && article.images.length > 0 ? article.images[0].url : null
                results.push({
                  source: sourceName === 'OTHER' ? 'ESPN' : sourceName,
                  title: article.headline?.trim() || '',
                  url: article.links?.web?.href || urlToScrape,
                  imageUrl: image,
                  excerpt: (article.description || '').trim().substring(0, 255),
                  publishedAt: article.published ? new Date(article.published) : new Date()
                })
              }
            }
          }
        } catch (apiErr) {
          console.error(`Error procesando API JSON de ESPN:`, apiErr)
        }
      }
      // --- NORMAL HTML FETCH ---
      else {
        const response = await fetch(urlToScrape, { headers: FAKE_HEADERS })

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // --- STRATEGY 1: SINGLE ARTICLE DETECTION (Open Graph) ---
        // Si la URL pegada es un artículo individual (ej. FCF, Pulzo, AS)
        const isSingleArticle =
          $('meta[property="og:type"]').attr('content') === 'article' ||
          $('meta[property="article:published_time"]').length > 0 ||
          $('meta[name="article:published_time"]').length > 0

        // Only force Single Article strategy if we don't have a known config that specifically targets this as a list, 
        // OR if it explicitly says it's an article type.
        if (isSingleArticle) {
          console.log(`📌 Se detectó un artículo individual usando metadatos OpenGraph.`)

          const title = $('meta[property="og:title"]').attr('content') || $('title').text()
          const link = $('meta[property="og:url"]').attr('content') || urlToScrape
          const image = $('meta[property="og:image"]').attr('content')
          const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
          const dateStr = $('meta[property="article:published_time"]').attr('content') || $('time').attr('datetime')

          let parsedDate = dateStr ? new Date(dateStr) : new Date()

          if (title && link) {
            results.push({
              source: sourceName,
              title: title.trim(),
              url: link,
              imageUrl: image,
              excerpt: description.substring(0, 255),
              publishedAt: parsedDate
            })
          }
        }
        // --- STRATEGY 2: LIST OF ARTICLES (Configured or Generic) ---
        else {
          console.log(`📋 Se detectó una página de lista/categoría. Buscando noticias...`)

          const selectors = config ? config.selectors : genericSelectors
          const dateParser = config ? config.dateParser : null

          let itemsFound = 0
          $(selectors.container).each((_, el) => {
            if (itemsFound >= 10 && !config) return // Max 10 items for generic fallback

            const titleEl = $(el).find(selectors.title).first()
            let title = titleEl.text().trim()

            if (!title) {
              title = $(el).find('h2 a, h3 a').text().trim()
            }

            let link = $(el).find(selectors.link).first().attr('href') || ''
            if (!link && titleEl.is('a')) link = titleEl.attr('href') || ''
            if (!link && titleEl.find('a').length > 0) link = titleEl.find('a').attr('href') || ''
            if (!link) link = $(el).closest('a').attr('href') || '' // Sometimes the container itself is a link

            // Make link absolute
            if (link && link.startsWith('/')) {
              const urlObj = new URL(urlToScrape)
              link = `${urlObj.protocol}//${urlObj.host}${link}`
            }

            const image = $(el).find(selectors.image).first().attr('src') || $(el).find(selectors.image).first().attr('data-src') || $(el).find('img').first().attr('src')

            const dateText = $(el).find(selectors.date).first().text().trim() || $(el).find('time').attr('datetime') || ''

            let parsedDate = new Date()
            if (dateParser) {
              parsedDate = dateParser(dateText, options.customDateFormat)
            } else if (dateText) {
              const possibleDate = new Date(dateText)
              if (!isNaN(possibleDate.getTime())) parsedDate = possibleDate
            }

            const excerpt = $(el).find(selectors.excerpt).first().text().trim()

            if (title && link) {
              results.push({
                source: sourceName,
                title,
                url: link,
                imageUrl: image,
                excerpt: excerpt.substring(0, 255),
                publishedAt: parsedDate
              })
              itemsFound++
            }
          })
        }
      }

      // Filter by Date
      const finalResults = results.filter(item => {
        if (item.publishedAt && options.startDate && item.publishedAt < options.startDate) return false
        if (item.publishedAt && options.endDate && item.publishedAt > options.endDate) return false
        return true
      })

      console.log(`✓ Encontradas ${finalResults.length} noticias válidas en ${sourceName} (${urlToScrape}).`)

      if (finalResults.length > 0) {
        console.log(`💾 Guardando en base de datos PostgreSQL (Upsert)...`)
        for (const item of finalResults) {
          try {
            await db.insert(newsItems)
              .values({
                externalUrl: item.url,
                title: item.title,
                excerpt: item.excerpt,
                imageUrl: item.imageUrl,
                source: item.source as any,
                publishedAt: item.publishedAt,
                fetchedAt: new Date()
              })
              .onConflictDoUpdate({
                target: newsItems.externalUrl,
                set: {
                  title: item.title,
                  excerpt: item.excerpt,
                  imageUrl: item.imageUrl,
                  fetchedAt: new Date()
                }
              })
            totalSaved++
          } catch (dbErr) {
            console.error(`DB Insert Error for ${item.url}:`, dbErr)
          }
        }
      }
    } catch (error: any) {
      console.error(`❌ Error scrapeando ${sourceName} (${urlToScrape}): ${error.message}`)
    }
  }

  console.log(`\n🎉 Scraper terminado! Total noticias procesadas/actualizadas: ${totalSaved}`)
  return totalSaved
}
