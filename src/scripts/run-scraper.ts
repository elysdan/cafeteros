import { config } from 'dotenv'
config({ path: '.env.local' })
import { runScraper } from '../lib/scraper/scraper'
import { db } from '../db'
import { newsItems } from '../db/schema'

async function bootstrap() {
  console.log('--- CRON JOB MANUAL ---')
  await runScraper()
  
  // Verify Database injection
  const currentNews = await db.query.newsItems.findMany({
    orderBy: (news, { desc }) => [desc(news.publishedAt)],
    limit: 5
  })
  
  console.log('\nÚltimas 5 noticias en DB:')
  currentNews.forEach(n => {
    console.log(`- [${n.source}] ${n.title}`)
  })
  
  process.exit(0)
}

bootstrap()
