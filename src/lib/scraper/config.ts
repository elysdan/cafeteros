import { ScrapingSource } from './types'
import { parse, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

// Helper to parse dates with multiple formats
const parseDateString = (dateString: string, customFormat?: string): Date => {
  if (!dateString) return new Date()
  
  // Clean string to remove "de" and extra spaces to help parsing
  const cleanStr = dateString.toLowerCase().replace(/ de /g, ' ').trim()

  if (customFormat) {
    const parsed = parse(cleanStr, customFormat, new Date(), { locale: es })
    if (isValid(parsed)) return parsed
  }

  // Common Spanish formats
  const formatsToTry = [
    'd MMMM yyyy', // 17 marzo 2026
    'd MMM yyyy',  // 17 mar 2026
    'dd/MM/yyyy',  // 17/03/2026
    'MM/dd/yyyy',  // 03/17/2026
    'yyyy-MM-dd',  // 2026-03-17
    'dd/MM/yy',    // 17/03/26
    'MM/dd/yy',    // 03/17/26
    'd MMMM',      // 17 marzo (assume current year)
  ]

  for (const fmt of formatsToTry) {
    const parsed = parse(cleanStr, fmt, new Date(), { locale: es })
    if (isValid(parsed)) {
      return parsed
    }
  }

  // Fallback to native parsing
  const nativeDate = new Date(dateString)
  if (isValid(nativeDate)) return nativeDate

  return new Date() // Final fallback
}

export const SCRAPING_SOURCES: ScrapingSource[] = [
  {
    name: 'FCF',
    url: 'https://fcf.com.co/category/noticias/',
    selectors: {
      // Bricks builder specific for FCF or generic WordPress
      container: '.brx-grid > .brxe-block, article.post, div.post',
      title: 'h3, h2, .entry-title, .title',
      link: 'a', 
      image: 'img', 
      date: 'time, .posted-on, .date',
      excerpt: '.brxe-text, .entry-content p, .excerpt, p'
    },
    dateParser: parseDateString
  }
  // You can easily add 'ESPN', 'MARCA' here extending this array
]
