import { auth } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { db } from '@/db'
import { players } from '@/db/schema'
import { desc, asc } from 'drizzle-orm'
import Link from 'next/link'
import { Flame } from 'lucide-react'

const POSITION_LABELS: Record<string, string> = {
  POR: 'Portero', DEF: 'Defensa', MED: 'Centrocampista', DEL: 'Delantero',
}
const POSITION_COLORS: Record<string, string> = {
  POR: 'var(--yellow)', DEF: '#60a5fa', MED: '#a78bfa', DEL: 'var(--red-light)',
}

export const metadata = { title: 'Jugadores | Colombia 2026' }

export default async function JugadoresPage() {
  const session = await auth()
  const allPlayers = await db.select().from(players).orderBy(desc(players.hypeCount), asc(players.name))

  const byPosition = {
    POR: allPlayers.filter((p) => p.position === 'POR'),
    DEF: allPlayers.filter((p) => p.position === 'DEF'),
    MED: allPlayers.filter((p) => p.position === 'MED'),
    DEL: allPlayers.filter((p) => p.position === 'DEL'),
  }

  return (
    <>
      <Navbar userName={session?.user?.name} />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--blue-light)' }}>
              🇨🇴 La Selección
            </p>
            <h1 className="font-display text-6xl sm:text-8xl tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              JUGADORES
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Conoce a los guerreros del tricolor. Dale hype a tu favorito.
            </p>
          </div>

          {/* Grouped by position */}
          {Object.entries(byPosition).map(([pos, group]) => group.length > 0 && (
            <div key={pos} className="mb-16">
              <h2
                className="font-display text-3xl tracking-wider mb-8 pb-4"
                style={{ color: POSITION_COLORS[pos], borderBottom: `1px solid var(--border)` }}
              >
                {POSITION_LABELS[pos]}s
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {group.map((player) => (
                  <Link
                    key={player.id}
                    href={`/jugadores/${player.id}`}
                    className="glass-card group flex flex-col items-center text-center p-6 rounded-2xl hover:-translate-y-1 transition-all"
                  >
                    <div
                      className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-3xl overflow-hidden relative"
                      style={{ background: 'var(--bg-elevated)', border: '2px solid var(--border)' }}
                    >
                      {player.imageUrl ? (
                        <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
                      ) : <span>⚽</span>}
                      {player.number && (
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'var(--yellow)', color: '#000' }}>
                          {player.number}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-sm mb-1 group-hover:text-white transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {player.name}
                    </p>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{player.club}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: 'rgba(245,197,24,0.1)', color: 'var(--yellow)' }}>
                      <Flame className="w-3 h-3" />
                      {(player.hypeCount ?? 0).toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
