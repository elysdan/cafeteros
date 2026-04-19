'use client'

import { Trophy } from 'lucide-react'

const ROUND_32_MATCHUPS = [
  { team1: '2do Grupo A', team2: '2do Grupo B', date: '28 de junio de 2026', location: 'SoFi Stadium, Los Ángeles' },
  { team1: '1ro Grupo A', team2: '3ro C/E/F/H/I', date: '29 de junio de 2026', location: 'Gillette Stadium, Boston' },
  { team1: '1ro Grupo F', team2: '3ro C/D/G/H/I', date: '29 de junio de 2026', location: 'Estadio BBVA, Monterrey' },
  { team1: '1ro Grupo C', team2: '3ro A/B/D/E/F', date: '29 de junio de 2026', location: 'NRG Stadium, Houston' },
  { team1: '1ro Grupo I', team2: '3ro A/B/F/G/H', date: '30 de junio de 2026', location: 'MetLife Stadium, Nueva York/NJ' },
  { team1: '2do Grupo E', team2: '2do Grupo I', date: '30 de junio de 2026', location: 'Estadio Azteca, Ciudad de México' },
  { team1: '1ro Grupo D', team2: '3ro B/E/F/G/J', date: '30 de junio de 2026', location: 'AT&T Stadium, Dallas' },
  { team1: '1ro Grupo G', team2: '3ro A/E/H/I/J', date: '1 de julio de 2026', location: 'Mercedes-Benz Stadium, Atlanta' },
  { team1: '1ro Grupo H', team2: '3ro D/E/G/J/K', date: '1 de julio de 2026', location: 'Levi\'s Stadium, San Francisco' },
  { team1: '1ro Grupo J', team2: '3ro E/H/I/K/L', date: '1 de julio de 2026', location: 'Lumen Field, Seattle' },
  { team1: '2do Grupo D', team2: '2do Grupo G', date: '2 de julio de 2026', location: 'BMO Field, Toronto' },
  { team1: '1ro Grupo B', team2: '3ro E/F/G/I/J', date: '2 de julio de 2026', location: 'SoFi Stadium, Los Ángeles' },
  { team1: '1ro Grupo E', team2: '3ro A/B/C/D/F', date: '2 de julio de 2026', location: 'Hard Rock Stadium, Miami' },
  { team1: '1ro Grupo K', team2: '3ro D/G/H/I/L', date: '3 de julio de 2026', location: 'Arrowhead Stadium, Kansas City' },
  { team1: '2do Grupo H', team2: '2do Grupo J', date: '3 de julio de 2026', location: 'AT&T Stadium, Dallas' },
  { team1: '1ro Grupo L', team2: '3ro F/H/I/J/K', date: '3 de julio de 2026', location: 'Mercedes-Benz Stadium, Atlanta' },
]

const ROUND_16_MATCHUPS = [
  { team1: 'Ganador Llave 1', team2: 'Ganador Llave 2', date: '4 de julio de 2026', location: 'Lincoln Financial Field, Filadelfia' },
  { team1: 'Ganador Llave 3', team2: 'Ganador Llave 4', date: '4 de julio de 2026', location: 'NRG Stadium, Houston' },
  { team1: 'Ganador Llave 5', team2: 'Ganador Llave 6', date: '5 de julio de 2026', location: 'Estadio Azteca, Ciudad de México' },
  { team1: 'Ganador Llave 7', team2: 'Ganador Llave 8', date: '5 de julio de 2026', location: 'MetLife Stadium, Nueva York/NJ' },
  { team1: 'Ganador Llave 9', team2: 'Ganador Llave 10', date: '6 de julio de 2026', location: 'Lumen Field, Seattle' },
  { team1: 'Ganador Llave 11', team2: 'Ganador Llave 12', date: '6 de julio de 2026', location: 'AT&T Stadium, Dallas' },
  { team1: 'Ganador Llave 13', team2: 'Ganador Llave 14', date: '7 de julio de 2026', location: 'Mercedes-Benz Stadium, Atlanta' },
  { team1: 'Ganador Llave 15', team2: 'Ganador Llave 16', date: '7 de julio de 2026', location: 'BC Place, Vancouver' },
]

const QUARTERS_MATCHUPS = [
  { team1: 'Clasificado 1', team2: 'Clasificado 2', date: '9 de julio de 2026', location: 'Gillette Stadium, Boston' },
  { team1: 'Clasificado 3', team2: 'Clasificado 4', date: '10 de julio de 2026', location: 'SoFi Stadium, Los Ángeles' },
  { team1: 'Clasificado 5', team2: 'Clasificado 6', date: '11 de julio de 2026', location: 'Hard Rock Stadium, Miami' },
  { team1: 'Clasificado 7', team2: 'Clasificado 8', date: '11 de julio de 2026', location: 'Arrowhead Stadium, Kansas City' },
]

const SEMIS_MATCHUPS = [
  { team1: 'Semifinalista 1', team2: 'Semifinalista 2', date: '14 de julio de 2026', location: 'AT&T Stadium, Dallas' },
  { team1: 'Semifinalista 3', team2: 'Semifinalista 4', date: '15 de julio de 2026', location: 'Mercedes-Benz Stadium, Atlanta' },
]

const BRACKET_ROUNDS = [
  {
    title: '16avos de Final',
    id: 'round-32',
    matches: ROUND_32_MATCHUPS.map((match, i) => ({
      id: `r32-${i}`,
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      location: match.location
    }))
  },
  {
    title: 'Octavos de Final',
    id: 'round-16',
    matches: ROUND_16_MATCHUPS.map((match, i) => ({
      id: `r16-${i}`,
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      location: match.location
    }))
  },
  {
    title: 'Cuartos de Final',
    id: 'round-8',
    matches: QUARTERS_MATCHUPS.map((match, i) => ({
      id: `r8-${i}`,
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      location: match.location
    }))
  },
  {
    title: 'Semifinales',
    id: 'semifinal',
    matches: SEMIS_MATCHUPS.map((match, i) => ({
      id: `sf-${i}`,
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      location: match.location
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
