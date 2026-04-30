export interface ScrapedNews {
  title: string
  url: string
  publishedAt: Date | null
  imageUrl?: string
  excerpt?: string
  source: 'FCF' | 'ESPN' | 'AS' | 'MARCA' | 'EL_TIEMPO' | 'OTHER'
}

export interface ScraperSelectors {
  container: string
  title: string
  link: string
  image: string
  date: string
  excerpt: string
}

export interface ScrapingSource {
  name: 'FCF' | 'ESPN' | 'AS' | 'MARCA' | 'EL_TIEMPO' | 'OTHER'
  url: string
  selectors: ScraperSelectors
  // Function to clean or parse the date uniquely per site if needed
  dateParser?: (dateString: string, customFormat?: string) => Date | null
}
