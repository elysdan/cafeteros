import 'dotenv/config'
import { runScraper } from '../src/lib/scraper/scraper'

async function test() {
  console.log('--- Test 1: Single Article (FCF) ---')
  await runScraper({
    customUrls: ['https://fcf.com.co/2026/02/02/apertura-del-proceso-de-acreditacion-y-pre-inscripcion-para-la-prensa-colombiana-copa-mundial-de-la-fifa-2026/']
  })

  console.log('\n--- Test 2: Category List (AS) ---')
  await runScraper({
    customUrls: ['https://colombia.as.com/noticias/seleccion-futbol-colombia/']
  })
  
  process.exit(0)
}

test()
