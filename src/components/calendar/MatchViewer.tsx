'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { fetchGroupsAndTeams, fetchSchedule } from '@/app/calendario/actions'
import { formatDate } from '@/lib/utils'

type Mode = 'group' | 'team'

export default function MatchViewer() {
  const [mode, setMode] = useState<Mode>('group')
  const [selectedValue, setSelectedValue] = useState<string>('K') // Default to Group K
  const [data, setData] = useState<{ groups: any[], teams: any[] }>({ groups: [], teams: [] })
  const [scheduleData, setScheduleData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. Fetch initial metadata (Groups & Teams list)
  useEffect(() => {
    fetchGroupsAndTeams().then(res => {
      setData(res)
    })
  }, [])

  // 2. Fetch specific schedule when selection changes
  useEffect(() => {
    if (!selectedValue) return
    setLoading(true)
    fetchSchedule(mode, selectedValue).then(res => {
      setScheduleData(res)
      setLoading(false)
    })
  }, [mode, selectedValue])

  // Handlers for Navigation Arrows (Only navigate through Groups)
  const handlePreviousGroup = () => {
    if (data.groups.length === 0) return
    setMode('group')
    let currentIndex = data.groups.findIndex(g => g.id === selectedValue)
    if (currentIndex <= 0) currentIndex = data.groups.length // loop to end
    setSelectedValue(data.groups[currentIndex - 1].id)
  }

  const handleNextGroup = () => {
    if (data.groups.length === 0) return
    setMode('group')
    let currentIndex = data.groups.findIndex(g => g.id === selectedValue)
    // If we were on 'team', currentIndex is -1. Next of -1 is 0 (Group A).
    if (currentIndex >= data.groups.length - 1 || currentIndex === -1) {
      setSelectedValue(data.groups[0].id)
    } else {
      setSelectedValue(data.groups[currentIndex + 1].id)
    }
  }

  return (
    <div>
      {/* Buscador Inteligente */}
      <div className="glass-card rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-4 border border-white/5 bg-black/20">
        <div className="w-full md:w-1/3">
          <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2 block">Buscar por</label>
          <select 
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--yellow)] transition-colors"
            value={mode}
            onChange={(e) => {
              const newMode = e.target.value as Mode
              setMode(newMode)
              // Auto-select first item of the new list
              if (newMode === 'group' && data.groups.length > 0) setSelectedValue(data.groups[0].id)
              if (newMode === 'team' && data.teams.length > 0) setSelectedValue(data.teams[0].id)
            }}
          >
            <option value="group">Fase de Grupos</option>
            <option value="team">Selección Nacional</option>
          </select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2 block">Selecciona</label>
          <select 
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--yellow)] transition-colors"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {mode === 'group' 
              ? data.groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))
              : data.teams.map(t => (
                  <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                ))
            }
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-[var(--yellow)]" />
        </div>
      ) : scheduleData ? (
        <div className="relative">
          
          {/* Navegación por flechas */}
          <div className="absolute top-1/2 -left-12 -translate-y-1/2 hidden lg:flex items-center justify-center">
            <button onClick={handlePreviousGroup} className="p-3 bg-[var(--bg-elevated)] rounded-full border border-[var(--border)] hover:border-[var(--yellow)] text-white transition-all hover:-translate-x-1 group">
               <ArrowLeft className="w-6 h-6 group-hover:text-[var(--yellow)] transition-colors" />
            </button>
          </div>
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 hidden lg:flex items-center justify-center">
            <button onClick={handleNextGroup} className="p-3 bg-[var(--bg-elevated)] rounded-full border border-[var(--border)] hover:border-[var(--yellow)] text-white transition-all hover:translate-x-1 group">
               <ArrowRight className="w-6 h-6 group-hover:text-[var(--yellow)] transition-colors" />
            </button>
          </div>

          {/* Grupo o Selección Seleccionada */}
          <div className="glass-card rounded-2xl p-8 mb-12">
            <h2 className="font-display text-3xl tracking-wider mb-6 flex justify-between items-center" style={{ color: 'var(--yellow)' }}>
              {mode === 'group' ? `GRUPO ${scheduleData.entity.id}` : `${scheduleData.entity.flag} ${scheduleData.entity.name}`}
            </h2>
            
            {mode === 'group' && scheduleData.teams && (
              <div className="grid grid-cols-2 gap-4">
                {scheduleData.teams.map((team: any) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-elevated)]"
                  >
                    <span className="text-2xl">{team.flag}</span>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                        {team.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {mode === 'team' && (
              <p className="text-gray-400 text-sm">Resumen de partidos programados para la selección en fase regular.</p>
            )}
          </div>

          {/* Partidos */}
          <div>
            <h2 className="font-display text-3xl tracking-wider mb-8" style={{ color: 'var(--text-primary)' }}>
              PARTIDOS
            </h2>
            <div className="space-y-4">
              {scheduleData.matches.length === 0 && (
                <div className="text-center p-12 glass-card rounded-2xl border-dashed opacity-70">
                  Aún no hay partidos programados.
                </div>
              )}
              {scheduleData.matches.map((match: any) => {
                const now = new Date()
                const matchDate = new Date(match.date)
                const isPast = matchDate < now

                // Formateamos para saber quien es el contrario o si se debe mostrar completo
                const isTeam1Target = mode === 'team' && match.team1.id === selectedValue
                const isTeam2Target = mode === 'team' && match.team2.id === selectedValue

                return (
                  <div
                    key={match.id}
                    className={`glass-card rounded-2xl p-6 transition-all`}
                    style={{
                      opacity: isPast ? 0.7 : 1,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Equipos */}
                      <div className="flex items-center gap-4 flex-1 justify-center sm:justify-start">
                        <div className={`text-center ${isTeam1Target ? '' : 'opacity-80'}`}>
                          <div className="text-4xl mb-1">{match.team1.flag}</div>
                          <p className={`text-sm font-bold transition-colors ${isTeam1Target ? 'text-[var(--yellow)]' : 'text-[var(--text-primary)]'}`}>
                            {match.team1.name}
                          </p>
                        </div>
                        
                        <div className="font-display text-3xl tracking-widest px-4" style={{ color: 'var(--text-muted)' }}>
                          {isPast && typeof match.resultTeam1 === 'number' && typeof match.resultTeam2 === 'number' 
                            ? <span className="text-[var(--yellow)]">{match.resultTeam1} - {match.resultTeam2}</span>
                            : 'VS'
                          }
                        </div>
                        
                        <div className={`text-center ${isTeam2Target ? '' : 'opacity-80'}`}>
                          <div className="text-4xl mb-1">{match.team2.flag}</div>
                          <p className={`text-sm font-bold transition-colors ${isTeam2Target ? 'text-[var(--yellow)]' : 'text-[var(--text-primary)]'}`}>
                            {match.team2.name}
                          </p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-2 text-sm sm:items-end" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span>{formatDate(matchDate)}</span>
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
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Controles para móvil */}
      <div className="flex justify-between items-center mt-12 lg:hidden">
         <button onClick={handlePreviousGroup} className="px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl flex items-center gap-2 text-sm">
           <ArrowLeft className="w-4 h-4" /> Anterior
         </button>
         <button onClick={handleNextGroup} className="px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl flex items-center gap-2 text-sm">
           Siguiente <ArrowRight className="w-4 h-4" />
         </button>
      </div>

    </div>
  )
}
