import { auth } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { db } from '@/db'
import { newsItems } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { ExternalLink, Clock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

export const metadata = { title: 'Noticias | Colombia 2026' }

const SOURCE_COLORS: Record<string, string> = {
  ESPN: '#e31837', AS: '#111', MARCA: '#00843D', EL_TIEMPO: '#0038A8', OTHER: '#5a6478',
}
const SOURCE_LABELS: Record<string, string> = {
  ESPN: 'ESPN', AS: 'AS Colombia', MARCA: 'Marca', EL_TIEMPO: 'El Tiempo', OTHER: 'Noticia',
}

export default async function NoticiasPage() {
  const session = await auth()
  const news = await db.select().from(newsItems).orderBy(desc(newsItems.publishedAt)).limit(60)

  return (
    <>
      <Navbar userName={session?.user?.name} />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--yellow)' }}>
              📰 Actualidad
            </p>
            <h1 className="font-display text-6xl sm:text-8xl tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              NOTICIAS
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Las últimas noticias de la Selección Colombia, agregadas automáticamente.
            </p>
          </div>

          {news.length === 0 ? (
            <div className="glass-card p-20 text-center rounded-2xl" style={{ border: '1px dashed var(--border)' }}>
              <p className="text-5xl mb-4">📡</p>
              <p className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                Aún no hay noticias
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Las noticias se sincronizan automáticamente. Vuelve pronto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <a
                  key={item.id}
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group flex flex-col overflow-hidden rounded-2xl hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-48 overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🇨🇴</div>
                    )}
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white uppercase"
                      style={{ background: SOURCE_COLORS[item.source] }}>
                      {SOURCE_LABELS[item.source]}
                    </span>
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.7)' }}>
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-semibold text-sm leading-snug mb-3 line-clamp-3 group-hover:text-white transition-colors"
                      style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h2>
                    {item.excerpt && (
                      <p className="text-xs leading-relaxed mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-muted)' }}>
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-auto" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        {item.publishedAt ? formatRelativeTime(item.publishedAt) : 'Reciente'}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
