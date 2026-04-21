import { Trophy } from 'lucide-react'
import { db } from '@/db'
import { worldCupMatches } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import BracketExporter from './BracketExporter'

const ROUND_ORDER = [
  '16avos de Final',
  'Octavos de Final',
  'Cuartos de Final',
  'Semifinales',
  'La Gran Final'
]

export default async function TournamentBracket() {
  const matches = await db.query.worldCupMatches.findMany({
    where: inArray(worldCupMatches.phase, ROUND_ORDER),
    with: {
      team1: true,
      team2: true,
    },
    orderBy: (matches, { asc }) => [asc(matches.date)],
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/New_York'
    }).format(date)
  }

  const formatMatch = (m: any) => ({
    id: m.id,
    team1: m.team1?.name || 'TBD',
    team2: m.team2?.name || 'TBD',
    date: formatDate(new Date(m.date)),
    location: `${m.venue}, ${m.city}`
  })

  // Group by phase
  const grouped = ROUND_ORDER.reduce((acc, phase) => {
    acc[phase] = matches.filter(m => m.phase === phase).map(formatMatch)
    return acc
  }, {} as Record<string, any[]>)

  // Helper to split array in half
  const halve = (arr: any[]) => {
    const half = Math.ceil(arr.length / 2)
    return { left: arr.slice(0, half), right: arr.slice(half) }
  }

  const r32 = halve(grouped['16avos de Final'] || [])
  const r16 = halve(grouped['Octavos de Final'] || [])
  const r8 = halve(grouped['Cuartos de Final'] || [])
  const sf = halve(grouped['Semifinales'] || [])
  const final = grouped['La Gran Final'] || []

  // Left bracket data (left to right)
  const leftRounds = [
    { id: 'l-r32', title: '16avos', matches: r32.left },
    { id: 'l-r16', title: 'Octavos', matches: r16.left },
    { id: 'l-r8', title: 'Cuartos', matches: r8.left },
    { id: 'l-sf', title: 'Semis', matches: sf.left },
  ]

  // Right bracket data (right to left from center, but we map it left-to-right rendering so Semis is first)
  const rightRounds = [
    { id: 'r-sf', title: 'Semis', matches: sf.right },
    { id: 'r-r8', title: 'Cuartos', matches: r8.right },
    { id: 'r-r16', title: 'Octavos', matches: r16.right },
    { id: 'r-r32', title: '16avos', matches: r32.right },
  ]

  const BracketColumn = ({ round, isRight }: { round: any, isRight?: boolean }) => (
    <div className="flex flex-col w-[240px] md:w-[260px] shrink-0 h-[800px] lg:h-auto">
      <div className="text-center pb-4 mb-2 lg:mb-6 border-b border-white/10 sticky top-0 bg-[var(--bg-base)] z-10">
        <h3 className="font-bold text-[var(--yellow)] uppercase tracking-wider text-[10px] md:text-xs">
          {round.title}
        </h3>
      </div>
      <div className="flex flex-col gap-4 lg:gap-6 flex-grow justify-around items-center h-full">
        {round.matches.map((match: any) => (
          <div 
            key={match.id} 
            className="w-full glass-card bg-black/40 border border-white/5 rounded-xl p-2 md:p-3 flex flex-col relative group transition-colors hover:border-[var(--yellow)]/30"
          >
            {/* Teams */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors truncate pr-2" title={match.team1}>{match.team1}</span>
                <div className="w-2 h-2 md:w-3 md:h-3 shrink-0 rounded-full bg-white/5 border border-white/10" />
              </div>
              <div className="h-[1px] w-full bg-white/5 relative">
                 <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-base)] px-1 text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest">VS</span>
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors truncate pr-2" title={match.team2}>{match.team2}</span>
                <div className="w-2 h-2 md:w-3 md:h-3 shrink-0 rounded-full bg-white/5 border border-white/10" />
              </div>
            </div>
            
            {/* Meta info */}
            <div className="mt-2 md:mt-3 pt-2 border-t border-white/5 flex flex-col gap-[2px] text-[8px] md:text-[9px] text-gray-500 font-mono tracking-widest uppercase truncate">
               <span>📅 {match.date}</span>
               <span className="truncate">📍 {match.location}</span>
            </div>

            {/* Connector Lines */}
            {round.title !== 'Semis' && !isRight && (
              <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-[2px] bg-white/10 group-hover:bg-[var(--yellow)]/50 transition-colors" />
            )}
            {round.title !== 'Semis' && isRight && (
              <div className="hidden lg:block absolute top-1/2 -left-6 w-6 h-[2px] bg-white/10 group-hover:bg-[var(--yellow)]/50 transition-colors" />
            )}
            {/* Final connectors from semis to Trophy */}
            {round.title === 'Semis' && !isRight && (
              <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-[2px] bg-white/10 group-hover:bg-[var(--yellow)]/50 transition-colors" />
            )}
            {round.title === 'Semis' && isRight && (
              <div className="hidden lg:block absolute top-1/2 -left-8 w-8 h-[2px] bg-white/10 group-hover:bg-[var(--yellow)]/50 transition-colors" />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className="mt-20 pt-16 border-t border-white/10 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[var(--yellow)] to-transparent opacity-50" />
      
      <div className="text-center mb-12 px-4">
        <h2 className="font-display text-4xl sm:text-5xl tracking-widest text-white mb-4 uppercase">
          Esquema del Mundial
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          El camino convergente hacia la máxima gloria. 48 equipos buscando llegar al centro de todo: La Gran Final.
        </p>

        <BracketExporter targetId="esquema-mundial-canvas" />
      </div>

      <div className="w-full overflow-x-auto pb-16 custom-scrollbar px-4 lg:px-8">
        <div 
          id="esquema-mundial-canvas"
          className="flex flex-row items-stretch justify-start lg:justify-center gap-6 lg:gap-8 min-w-max mx-auto py-8 px-4"
        >
          
          {/* Left Bracket */}
          <div className="flex flex-row gap-6 lg:gap-8 min-h-[600px] lg:min-h-[850px]">
            {leftRounds.map((round) => (
              <BracketColumn key={round.id} round={round} isRight={false} />
            ))}
          </div>

          {/* Center (Final & Trophy) */}
          <div className="flex flex-col items-center justify-center shrink-0 w-[280px] md:w-[300px] gap-8 mt-12 lg:mt-0 relative px-4">
            <Trophy className="w-24 h-24 md:w-32 md:h-32 text-[var(--yellow)] filter drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] animate-pulse" />
            
            <div className="w-full">
              <div className="text-center pb-4 mb-6 border-b border-[var(--yellow)]/30">
                <h3 className="font-bold text-[var(--yellow)] uppercase tracking-widest text-sm md:text-lg text-shadow-sm">
                  La Gran Final
                </h3>
              </div>
              {final.map(match => (
                <div 
                  key={match.id} 
                  className="w-full glass-card bg-black/60 border border-[var(--yellow)]/40 rounded-xl p-4 md:p-5 flex flex-col relative group shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-base md:text-lg">
                      <span className="font-bold text-white pr-2 truncate" title={match.team1}>{match.team1}</span>
                      <div className="w-4 h-4 md:w-5 md:h-5 shrink-0 rounded-full bg-[var(--yellow)]/20 border-2 border-[var(--yellow)]" />
                    </div>
                    <div className="h-[2px] w-full bg-[var(--yellow)]/20 relative">
                       <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-base)] px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs text-[var(--yellow)] font-black uppercase tracking-widest border border-[var(--yellow)]/30">VS</span>
                    </div>
                    <div className="flex justify-between items-center text-base md:text-lg">
                      <span className="font-bold text-white pr-2 truncate" title={match.team2}>{match.team2}</span>
                      <div className="w-4 h-4 md:w-5 md:h-5 shrink-0 rounded-full bg-[var(--yellow)]/20 border-2 border-[var(--yellow)]" />
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-5 pt-3 border-t border-[var(--yellow)]/20 flex flex-col gap-1 text-[9px] md:text-[11px] text-gray-400 font-mono tracking-widest uppercase text-center truncate">
                     <span>📅 {match.date}</span>
                     <span>📍 {match.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Bracket */}
          <div className="flex flex-row gap-6 lg:gap-8 min-h-[600px] lg:min-h-[850px]">
            {rightRounds.map((round) => (
              <BracketColumn key={round.id} round={round} isRight={true} />
            ))}
          </div>

        </div>
      </div>
      
      {/* Scroll Hint (Mobile mainly) */}
      <div className="text-center text-xs text-gray-500 mt-2 pb-8 lg:hidden animate-pulse">
        ⟵ Desliza para ver todo el esquema ⟶
      </div>
    </section>
  )
}
