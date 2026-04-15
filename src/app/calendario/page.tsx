import { auth } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { COLOMBIA_MATCHES, COLOMBIA_GROUP, FIRST_MATCH_DATE } from '@/lib/calendar-data'
import { formatDate } from '@/lib/utils'
import { MapPin, Calendar } from 'lucide-react'

export const metadata = { title: 'Calendario | Colombia 2026' }

const COUNTRY_LABELS: Record<string, string> = {
  USA: '🇺🇸 Estados Unidos',
  CAN: '🇨🇦 Canadá',
  MEX: '🇲🇽 México',
}

export default async function CalendarioPage() {
  const session = await auth()
  const now = new Date()

  return (
    <>
      <Navbar userName={session?.user?.name} />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--red-light)' }}>
              🏆 Mundial FIFA 2026™
            </p>
            <h1 className="font-display text-6xl sm:text-8xl tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              CALENDARIO
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Los partidos de Colombia en el Mundial 2026 · USA, Canadá y México
            </p>
          </div>

          {/* Grupo de Colombia */}
          <div className="glass-card rounded-2xl p-8 mb-12">
            <h2 className="font-display text-3xl tracking-wider mb-6" style={{ color: 'var(--yellow)' }}>
              GRUPO {COLOMBIA_GROUP.group}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {COLOMBIA_GROUP.teams.map((team, i) => (
                <div
                  key={team.name}
                  className={`flex items-center gap-3 p-4 rounded-xl ${team.name === 'Colombia' ? 'border' : ''}`}
                  style={{
                    background: team.name === 'Colombia' ? 'rgba(245,197,24,0.08)' : 'var(--bg-elevated)',
                    borderColor: team.name === 'Colombia' ? 'rgba(245,197,24,0.3)' : 'transparent',
                  }}
                >
                  <span className="text-2xl">{team.flag}</span>
                  <div>
                    <p className="font-semibold text-sm"
                      style={{ color: team.name === 'Colombia' ? 'var(--yellow)' : 'var(--text-primary)' }}>
                      {team.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partidos */}
          <div>
            <h2 className="font-display text-3xl tracking-wider mb-8" style={{ color: 'var(--text-primary)' }}>
              PARTIDOS
            </h2>
            <div className="space-y-4">
              {COLOMBIA_MATCHES.map((match, index) => {
                const isPast = match.date < now
                const isNext = !isPast && COLOMBIA_MATCHES.find((m) => m.date > now)?.id === match.id

                return (
                  <div
                    key={match.id}
                    className={`glass-card rounded-2xl p-6 transition-all ${isNext ? 'border' : ''}`}
                    style={{
                      borderColor: isNext ? 'rgba(245,197,24,0.4)' : 'var(--glass-border)',
                      opacity: isPast ? 0.7 : 1,
                    }}
                  >
                    {isNext && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--yellow)' }} />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--yellow)' }}>
                          Próximo partido
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Equipos */}
                      <div className="flex items-center gap-4 flex-1 justify-center sm:justify-start">
                        <div className="text-center">
                          <div className="text-4xl mb-1">🇨🇴</div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Colombia</p>
                        </div>
                        <div className="font-display text-3xl tracking-widest" style={{ color: 'var(--text-muted)' }}>VS</div>
                        <div className="text-center">
                          <div className="text-4xl mb-1">{match.opponentFlag}</div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{match.opponent}</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-2 text-sm sm:items-end" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span>{formatDate(match.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span>{match.venue}, {match.city}</span>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: 'var(--glass)', color: 'var(--text-muted)' }}
                        >
                          {match.phase}
                        </span>
                      </div>
                    </div>

                    {/* Result if past */}
                    {isPast && match.result && (
                      <div className="mt-4 pt-4 text-center font-display text-4xl tracking-widest"
                        style={{ borderTop: '1px solid var(--border)', color: 'var(--yellow)' }}>
                        {match.result.colombia} — {match.result.opponent}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
