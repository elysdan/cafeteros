'use client'

import { Trophy } from 'lucide-react'
import { useState, useMemo } from 'react'

const ROUND_ORDER = [
  '16avos de Final',
  'Octavos de Final',
  'Cuartos de Final',
  'Semifinales',
  'La Gran Final'
]

type ViewMode = 'REAL' | 'QUINIELA' | 'MICASINO'

interface InteractiveBracketProps {
  initialMatches: any[]
  viewMode: ViewMode
  predictions: Record<string, string> // matchId -> winnerTeamName
  onSelectWinner?: (matchId: string, winnerName: string) => void
}

export default function InteractiveBracket({
  initialMatches,
  viewMode,
  predictions,
  onSelectWinner
}: InteractiveBracketProps) {

  // Resolve bracket based on predictions
  const resolvedBracket = useMemo(() => {
    // 1. Group initial matches
    const grouped = ROUND_ORDER.reduce((acc, phase) => {
      acc[phase] = initialMatches.filter(m => m.phase === phase).map(m => ({...m}))
      return acc
    }, {} as Record<string, any[]>)

    // 2. Cascade predictions ONLY if not in REAL mode (or if REAL mode but we want to show it anyway?
    // Actually, REAL mode just uses the DB exactly as is. We only override if predictions exist and viewMode != 'REAL'.
    if (viewMode !== 'REAL') {
      // Resolve first round placeholders natively against our dictionary
      grouped[ROUND_ORDER[0]] = grouped[ROUND_ORDER[0]].map(match => ({
        ...match,
        team1: predictions[match.team1] || match.team1,
        team2: predictions[match.team2] || match.team2
      }))

      for (let phaseIdx = 1; phaseIdx < ROUND_ORDER.length; phaseIdx++) {
        const currentPhaseName = ROUND_ORDER[phaseIdx];
        const prevPhaseName = ROUND_ORDER[phaseIdx - 1];
        
        grouped[currentPhaseName] = grouped[currentPhaseName].map((match, matchIdx) => {
          const prevMatch1 = grouped[prevPhaseName][matchIdx * 2];
          const prevMatch2 = grouped[prevPhaseName][matchIdx * 2 + 1];
          
          let team1 = match.team1;
          let team2 = match.team2;

          if (prevMatch1 && predictions[prevMatch1.id]) {
            team1 = predictions[prevMatch1.id]
          }
          if (prevMatch2 && predictions[prevMatch2.id]) {
            team2 = predictions[prevMatch2.id]
          }
          
          return { ...match, team1, team2 };
        });
      }
    }

    return grouped
  }, [initialMatches, predictions, viewMode])

  const halve = (arr: any[]) => {
    const half = Math.ceil((arr?.length || 0) / 2)
    return { left: arr.slice(0, half), right: arr.slice(half) }
  }

  const r32 = halve(resolvedBracket['16avos de Final'] || [])
  const r16 = halve(resolvedBracket['Octavos de Final'] || [])
  const r8 = halve(resolvedBracket['Cuartos de Final'] || [])
  const sf = halve(resolvedBracket['Semifinales'] || [])
  const final = resolvedBracket['La Gran Final'] || []

  const leftRounds = [
    { id: 'l-r32', title: '16avos', matches: r32.left },
    { id: 'l-r16', title: 'Octavos', matches: r16.left },
    { id: 'l-r8', title: 'Cuartos', matches: r8.left },
    { id: 'l-sf', title: 'Semis', matches: sf.left },
  ]

  const rightRounds = [
    { id: 'r-sf', title: 'Semis', matches: sf.right },
    { id: 'r-r8', title: 'Cuartos', matches: r8.right },
    { id: 'r-r16', title: 'Octavos', matches: r16.right },
    { id: 'r-r32', title: '16avos', matches: r32.right },
  ]

  const handleTeamClick = (matchId: string, teamName: string) => {
    const isUnresolvedPlaceholder = ['TBD', 'Ganador', 'Clasificado', 'Semifinalista', 'Finalista'].some(t => teamName.includes(t));
    if (viewMode === 'QUINIELA' && onSelectWinner && teamName && !isUnresolvedPlaceholder) {
      onSelectWinner(matchId, teamName)
    }
  }

  const InteractiveTeam = ({ matchId, teamName, isWinner }: { matchId: string, teamName: string, isWinner: boolean }) => {
    const isClickable = viewMode === 'QUINIELA' && teamName && !['TBD', 'Ganador', 'Clasificado', 'Semifinalista', 'Finalista'].some(t => teamName.includes(t));
    const selected = predictions[matchId] === teamName && isClickable;

    return (
      <div 
        onClick={() => isClickable && handleTeamClick(matchId, teamName)}
        className={`flex justify-between items-center text-xs md:text-sm px-2 py-1 rounded-md transition-all ${
          isClickable ? 'cursor-pointer hover:bg-white/10' : ''
        } ${selected ? 'bg-[var(--yellow)]/20 text-[var(--yellow)]' : ''}`}
      >
        <span className={`font-medium truncate pr-2 ${selected ? 'text-[var(--yellow)] font-bold' : 'text-gray-300 group-hover:text-white'}`} title={teamName}>
          {teamName}
        </span>
        <div className={`w-2 h-2 md:w-3 md:h-3 shrink-0 rounded-full border ${selected ? 'bg-[var(--yellow)] border-[var(--yellow)] shadow-[0_0_8px_var(--yellow)]' : 'bg-white/5 border-white/10'}`} />
      </div>
    )
  }

  const BracketColumn = ({ round, isRight }: { round: any, isRight?: boolean }) => (
    <div className="flex flex-col w-[240px] md:w-[260px] shrink-0 h-[800px] lg:h-auto">
      <div className="text-center pb-4 mb-2 lg:mb-6 border-b border-white/10 sticky top-0 bg-[var(--bg-base)] z-10">
        <h3 className="font-bold text-[var(--yellow)] uppercase tracking-wider text-[10px] md:text-xs">
          {round.title}
        </h3>
      </div>
      <div className="flex flex-col gap-4 lg:gap-6 flex-grow justify-around items-center h-full">
        {round.matches.map((match: any) => {
          const isFinished = !!predictions[match.id];
          return (
            <div 
              key={match.id} 
              className={`w-full glass-card bg-black/40 border rounded-xl py-1 px-1 md:py-2 md:px-2 flex flex-col relative group transition-colors ${isFinished ? 'border-[var(--yellow)]/50' : 'border-white/5 hover:border-[var(--yellow)]/30'}`}
            >
              <div className="flex flex-col gap-1">
                <InteractiveTeam matchId={match.id} teamName={match.team1} isWinner={predictions[match.id] === match.team1} />
                <div className="h-[1px] w-full bg-white/5 relative my-1">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-base)] px-1 text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest">VS</span>
                </div>
                <InteractiveTeam matchId={match.id} teamName={match.team2} isWinner={predictions[match.id] === match.team2} />
              </div>
              
              <div className="mt-1 md:mt-2 pt-1 border-t border-white/5 flex flex-col gap-[2px] text-[8px] md:text-[9px] text-gray-500 font-mono tracking-widest uppercase truncate px-2">
                 <span>📅 {match.date}</span>
                 <span className="truncate">📍 {match.location}</span>
              </div>

              {round.title !== 'Semis' && !isRight && (
                <div className={`hidden lg:block absolute top-1/2 -right-6 w-6 h-[2px] transition-colors ${isFinished ? 'bg-[var(--yellow)]' : 'bg-white/10 group-hover:bg-[var(--yellow)]/50'}`} />
              )}
              {round.title !== 'Semis' && isRight && (
                <div className={`hidden lg:block absolute top-1/2 -left-6 w-6 h-[2px] transition-colors ${isFinished ? 'bg-[var(--yellow)]' : 'bg-white/10 group-hover:bg-[var(--yellow)]/50'}`} />
              )}
              {round.title === 'Semis' && !isRight && (
                <div className={`hidden lg:block absolute top-1/2 -right-8 w-8 h-[2px] transition-colors ${isFinished ? 'bg-[var(--yellow)]' : 'bg-white/10 group-hover:bg-[var(--yellow)]/50'}`} />
              )}
              {round.title === 'Semis' && isRight && (
                <div className={`hidden lg:block absolute top-1/2 -left-8 w-8 h-[2px] transition-colors ${isFinished ? 'bg-[var(--yellow)]' : 'bg-white/10 group-hover:bg-[var(--yellow)]/50'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="w-full overflow-x-auto pb-16 custom-scrollbar px-4 lg:px-8">
      <div 
        id="esquema-mundial-canvas"
        className="flex flex-row items-stretch justify-start lg:justify-center gap-6 lg:gap-8 min-w-max mx-auto py-8 px-4"
      >
        <div className="flex flex-row gap-6 lg:gap-8 min-h-[600px] lg:min-h-[850px]">
          {leftRounds.map((round) => (
            <BracketColumn key={round.id} round={round} isRight={false} />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center shrink-0 w-[280px] md:w-[300px] gap-8 mt-12 lg:mt-0 relative px-4">
          <Trophy className={`w-24 h-24 md:w-32 md:h-32 text-[var(--yellow)] filter drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] ${viewMode !== 'REAL' && final[0] && predictions[final[0].id] ? 'animate-bounce drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]' : 'animate-pulse'}`} />
          
          <div className="w-full">
            <div className="text-center pb-4 mb-6 border-b border-[var(--yellow)]/30">
              <h3 className="font-bold text-[var(--yellow)] uppercase tracking-widest text-sm md:text-lg text-shadow-sm">
                La Gran Final
              </h3>
            </div>
            {final.map((match: any) => {
               const isFinished = !!predictions[match.id];
               return (
              <div 
                key={match.id} 
                className={`w-full glass-card bg-black/60 border rounded-xl p-2 md:p-3 flex flex-col relative group shadow-[0_0_20px_rgba(255,215,0,0.1)] ${isFinished ? 'border-[var(--yellow)]' : 'border-[var(--yellow)]/40'}`}
              >
                <div className="flex flex-col gap-2">
                  <InteractiveTeam matchId={match.id} teamName={match.team1} isWinner={predictions[match.id] === match.team1} />
                  <div className="h-[2px] w-full bg-[var(--yellow)]/20 relative my-2">
                     <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-base)] px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs text-[var(--yellow)] font-black uppercase tracking-widest border border-[var(--yellow)]/30">VS</span>
                  </div>
                  <InteractiveTeam matchId={match.id} teamName={match.team2} isWinner={predictions[match.id] === match.team2} />
                </div>
                
                <div className="mt-3 md:mt-4 pt-2 border-t border-[var(--yellow)]/20 flex flex-col gap-1 text-[9px] md:text-[11px] text-gray-400 font-mono tracking-widest uppercase text-center truncate">
                   <span>📅 {match.date}</span>
                   <span>📍 {match.location}</span>
                </div>
              </div>
            )})}
          </div>
        </div>

        <div className="flex flex-row gap-6 lg:gap-8 min-h-[600px] lg:min-h-[850px]">
          {rightRounds.map((round) => (
            <BracketColumn key={round.id} round={round} isRight={true} />
          ))}
        </div>
      </div>
    </div>
  )
}
