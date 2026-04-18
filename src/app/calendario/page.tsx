import { auth } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { COLOMBIA_GROUP, FIRST_MATCH_DATE } from '@/lib/calendar-data'
import MatchViewer from '@/components/calendar/MatchViewer'
import TournamentBracket from '@/components/calendar/TournamentBracket'

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
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              CALENDARIO
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Los partidos de Colombia en el Mundial 2026 · USA, Canadá y México
            </p>
          </div>

          <MatchViewer />
        </div>
        
        {/* Esquema Completo / Bracket */}
        <TournamentBracket />
        
      </main>
      <Footer />
    </>
  )
}
