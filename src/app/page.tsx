import { auth } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import NewsPreview from '@/components/landing/NewsPreview'
import PlayersCarousel from '@/components/landing/PlayersCarousel'
import { db } from '@/db'
import { newsItems, players } from '@/db/schema'
import { desc, asc } from 'drizzle-orm'

export default async function HomePage() {
  const session = await auth()

  // Obtener últimas 3 noticias y top 6 jugadores (por hype)
  const [latestNews, topPlayers] = await Promise.all([
    db.select().from(newsItems).orderBy(desc(newsItems.publishedAt)).limit(3),
    db.select().from(players).orderBy(desc(players.hypeCount), asc(players.name)).limit(6),
  ])

  return (
    <>
      <Navbar userName={session?.user?.name} />
      <main>
        <HeroSection />
        <NewsPreview news={latestNews} />
        <PlayersCarousel players={topPlayers} />
      </main>
      <Footer />
    </>
  )
}
