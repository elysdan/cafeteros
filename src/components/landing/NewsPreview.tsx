import Link from 'next/link'
import { ExternalLink, Clock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { newsItems } from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

type NewsItem = InferSelectModel<typeof newsItems>

const SOURCE_COLORS: Record<string, string> = {
  ESPN: '#e31837',
  AS: '#000',
  MARCA: '#00843D',
  EL_TIEMPO: '#0038A8',
  OTHER: '#5a6478',
}

const SOURCE_LABELS: Record<string, string> = {
  ESPN: 'ESPN Deportes',
  AS: 'AS Colombia',
  MARCA: 'Marca Claro',
  EL_TIEMPO: 'El Tiempo',
  OTHER: 'Noticia',
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card group flex flex-col h-full overflow-hidden transition-transform hover:-translate-y-1"
      aria-label={`Leer en ${SOURCE_LABELS[item.source]}: ${item.title}`}
    >
      {/* Imagen */}
      <div className="relative h-44 overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🇨🇴</span>
          </div>
        )}
        {/* Source badge */}
        <span
          className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white"
          style={{ background: SOURCE_COLORS[item.source] || SOURCE_COLORS.OTHER }}
        >
          {SOURCE_LABELS[item.source]}
        </span>
        {/* External link icon */}
        <div
          className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-semibold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-white transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-3 flex-1" style={{ color: 'var(--text-muted)' }}>
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
  )
}

export default function NewsPreview({ news }: { news: NewsItem[] }) {
  return (
    <section className="py-24 px-4" style={{ background: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--yellow)' }}>
              📰 Lo más reciente
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
              NOTICIAS
            </h2>
          </div>
          <Link
            href="/noticias"
            className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--yellow)' }}
          >
            Ver todas →
          </Link>
        </div>

        {/* News grid */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div
            className="glass-card p-16 text-center rounded-2xl"
            style={{ border: '1px dashed var(--border)' }}
          >
            <p className="text-4xl mb-4">📡</p>
            <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Sincronizando noticias...
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Las noticias aparecerán aquí una vez que se sincronicen los feeds RSS.
            </p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/noticias"
            className="text-sm font-medium"
            style={{ color: 'var(--yellow)' }}
          >
            Ver todas las noticias →
          </Link>
        </div>
      </div>
    </section>
  )
}
