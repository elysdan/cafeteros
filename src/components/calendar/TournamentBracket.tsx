'use client'

import { Trophy } from 'lucide-react'

// Dummy Data structure for the World Cup 2026 bracket
const BRACKET_ROUNDS = [
  {
    title: '16avos de Final',
    id: 'round-32',
    matches: Array.from({ length: 16 }, (_, i) => ({
      id: `r32-${i}`,
      team1: i % 2 === 0 ? `1ro Grupo ${String.fromCharCode(65 + i % 12)}` : `2do Grupo ${String.fromCharCode(65 + i % 12)}`,
      team2: i % 2 !== 0 ? `3ro Grupo ${String.fromCharCode(65 + i % 8)}` : `2do Grupo ${String.fromCharCode(65 + i % 10)}`,
      date: 'Por definir',
      location: 'Sede por confirmar'
    }))
  },
  {
    title: 'Octavos de Final',
    id: 'round-16',
    matches: Array.from({ length: 8 }, (_, i) => ({
      id: `r16-${i}`,
      team1: `Ganador Llave ${i * 2 + 1}`,
      team2: `Ganador Llave ${i * 2 + 2}`,
      date: 'Por definir',
      location: 'Sede por confirmar'
    }))
  },
  {
    title: 'Cuartos de Final',
    id: 'round-8',
    matches: Array.from({ length: 4 }, (_, i) => ({
      id: `r8-${i}`,
      team1: `Clasificado ${i * 2 + 1}`,
      team2: `Clasificado ${i * 2 + 2}`,
      date: 'Por definir',
      location: 'Sede por confirmar'
    }))
  },
  {
    title: 'Semifinal',
    id: 'semifinal',
    matches: Array.from({ length: 2 }, (_, i) => ({
      id: `sf-${i}`,
      team1: `Semifinalista ${i * 2 + 1}`,
      team2: `Semifinalista ${i * 2 + 2}`,
      date: 'Por definir',
      location: 'Sede por confirmar'
    }))
  },
  {
    title: 'La Gran Final',
    id: 'final',
    matches: [
      {
         id: 'final-1',
         team1: 'Finalista 1',
         team2: 'Finalista 2',
         date: '19 de julio de 2026',
         location: 'MetLife Stadium, Nueva York/NJ'
      }
    ]
  }
]

export default function TournamentBracket() {
  return (
    <section className="mt-20 pt-16 border-t border-white/10 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[var(--yellow)] to-transparent opacity-50" />
      
      <div className="text-center mb-12 px-4">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-[var(--yellow)]" />
        <h2 className="font-display text-4xl sm:text-5xl tracking-widest text-white mb-4">
          ESQUEMA DEL MUNDIAL
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Así será el camino hacia la Copa una vez finalice la fase de Grupos. El formato expandido de 48 equipos nos trae los emocionantes 16avos de final.
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-12 custom-scrollbar pl-4 sm:pl-8 pr-8">
        <div className="flex gap-12 min-w-max">
          {BRACKET_ROUNDS.map((round) => (
            <div key={round.id} className="flex flex-col w-[300px] shrink-0">
              <div className="text-center pb-4 mb-6 border-b border-white/10 sticky top-0 bg-[var(--bg-base)] z-10">
                <h3 className="font-bold text-[var(--yellow)] uppercase tracking-wider text-sm">
                  {round.title}
                </h3>
                <span className="text-xs text-gray-500">{round.matches.length} partidos</span>
              </div>
              
              <div className="flex flex-col gap-6 flex-grow justify-around">
                {round.matches.map((match) => (
                  <div 
                    key={match.id} 
                    className="glass-card bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col relative group transition-colors hover:border-[var(--yellow)]/30"
                  >
                    {/* Teams */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{match.team1}</span>
                        <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10" />
                      </div>
                      <div className="h-[1px] w-full bg-white/5 relative">
                         <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-base)] px-1 text-[10px] text-gray-600 font-bold uppercase tracking-widest">VS</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{match.team2}</span>
                        <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10" />
                      </div>
                    </div>
                    
                    {/* Meta info */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                       <span>📅 {match.date}</span>
                       <span className="truncate">📍 {match.location}</span>
                    </div>

                    {/* Connector lines (except last round) */}
                    {round.id !== 'final' && (
                      <div className="hidden md:block absolute top-1/2 -right-12 w-12 h-[2px] bg-white/5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="text-center text-xs text-gray-500 mt-2 pb-8 animate-pulse">
        ⟵ Desliza para ver todo el esquema ⟶
      </div>
    </section>
  )
}
