'use client'

import { useState, useTransition } from 'react'
import { saveUserBracket } from '@/app/actions/bracket'
import InteractiveBracket from './InteractiveBracket'
import GroupStagePredictor from './GroupStagePredictor'
import BracketExporter from './BracketExporter'
import { Loader2, Save, CheckCircle, BarChart3, Edit3, Diamond } from 'lucide-react'

export type ViewMode = 'REAL' | 'QUINIELA' | 'MICASINO'

interface BracketControllerProps {
  initialGroups?: any[] // We can type this strictly or use any[] for simplicity
  initialMatches: any[]
  initialUserPredictions: Record<string, string>
  micasinoPredictions: Record<string, string>
  isLoggedIn: boolean
}

export default function BracketController({
  initialGroups,
  initialMatches,
  initialUserPredictions,
  micasinoPredictions,
  isLoggedIn
}: BracketControllerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('REAL')
  const [activeTab, setActiveTab] = useState<'GROUPS' | 'BRACKET'>('BRACKET')
  const [userPredictions, setUserPredictions] = useState(initialUserPredictions)
  const [isPending, startTransition] = useTransition()
  const [isSaved, setIsSaved] = useState(false)

  const handleGroupOrderChange = (groupId: string, newOrderIds: string[], bestThirds: string[]) => {
    if (viewMode !== 'QUINIELA') return

    const newPredictions = { ...userPredictions }
    
    // Save group order internally
    newPredictions[`1${groupId}`] = newOrderIds[0]
    newPredictions[`2${groupId}`] = newOrderIds[1]
    newPredictions[`3${groupId}`] = newOrderIds[2]
    newPredictions[`4${groupId}`] = newOrderIds[3]
    
    // Also map to visual strings used in the bracket
    const groupName = `Grupo ${groupId}`
    const team1Name = initialGroups?.find((g: any) => g.id === groupId)?.teams.find((t: any) => t.id === newOrderIds[0])?.name
    const team2Name = initialGroups?.find((g: any) => g.id === groupId)?.teams.find((t: any) => t.id === newOrderIds[1])?.name
    
    if (team1Name) newPredictions[`1ro ${groupName}`] = team1Name
    if (team2Name) newPredictions[`2do ${groupName}`] = team2Name

    // We can also linearly map bestThirds to 3C1..3C8
    // Find all '3ro' placements across all groups
    const allThirds: {id: string, name: string}[] = []
    initialGroups?.forEach((g: any) => {
       const thirdId = newPredictions[`3${g.id}`]; 
       if (thirdId && bestThirds.includes(thirdId)) {
          const tName = g.teams.find((t: any) => t.id === thirdId)?.name
          if (tName) allThirds.push({id: thirdId, name: tName})
       }
    })
    
    // Linearly map the ones we have to the first N placeholders
    const placeholders = [
      '3ro C/E/F/H/I', '3ro C/D/G/H/I', '3ro A/B/D/E/F', '3ro A/B/F/G/H', 
      '3ro B/E/F/G/J', '3ro A/E/H/I/J', '3ro D/E/G/J/K', '3ro E/H/I/K/L',
      '3ro E/F/G/I/J', '3ro A/B/C/D/F', '3ro D/G/H/I/L', '3ro F/H/I/J/K'
    ]

    // Fill placeholders
    placeholders.forEach((placeholder, index) => {
       if (allThirds[index]) {
         newPredictions[placeholder] = allThirds[index].name
       }
    })

    // Save state
    newPredictions[`BEST_3`] = JSON.stringify(bestThirds)
    
    setUserPredictions(newPredictions)
    setIsSaved(false)
  }

  const handleSelectWinner = (matchId: string, winnerName: string) => {
    if (viewMode !== 'QUINIELA') return

    const newPredictions = { ...userPredictions, [matchId]: winnerName }
    setUserPredictions(newPredictions)
    setIsSaved(false)
  }

  const handleSave = () => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para guardar tu quiniela.')
      return
    }
    startTransition(async () => {
      const result = await saveUserBracket(userPredictions)
      if (result.success) {
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      } else {
        alert(result.error || 'Hubo un error guardando tu quiniela.')
      }
    })
  }

  const currentPredictions = 
    viewMode === 'REAL' ? {} :
    viewMode === 'MICASINO' ? micasinoPredictions : 
    userPredictions

  const bestThirdsState = currentPredictions['BEST_3'] ? JSON.parse(currentPredictions['BEST_3']) : []

  return (
    <section className="mt-20 pt-16 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[var(--yellow)] to-transparent opacity-50" />
      
      <div className="text-center mb-8 px-4">
        <h2 className="font-display text-4xl sm:text-5xl tracking-widest text-white mb-4 uppercase">
          Esquema del Mundial
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-8">
          El camino convergente hacia la máxima gloria. 48 equipos buscando llegar al centro de todo: La Gran Final.
        </p>

        {/* View Mode Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5 w-fit mx-auto shadow-xl backdrop-blur-sm mb-6">
          <button
            onClick={() => setViewMode('REAL')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
              viewMode === 'REAL' ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Real
          </button>
          
          <button
            onClick={() => setViewMode('QUINIELA')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
              viewMode === 'QUINIELA' ? 'bg-[var(--yellow)]/20 text-[var(--yellow)] border border-[var(--yellow)]/30' : 'text-gray-400 hover:text-[var(--yellow)] hover:bg-white/5'
            }`}
          >
            <Edit3 className="w-4 h-4" /> Mi Quiniela
          </button>
          
          <button
            onClick={() => setViewMode('MICASINO')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
              viewMode === 'MICASINO' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-blue-400 hover:bg-white/5'
            }`}
          >
            <Diamond className="w-4 h-4" /> Según Micasino.com
          </button>
        </div>

        {/* Navigation Tabs */}
        {(viewMode === 'QUINIELA' || viewMode === 'MICASINO') && (
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('GROUPS')}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'GROUPS' ? 'bg-[var(--yellow)] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Fase de Grupos
              </button>
              <button
                onClick={() => setActiveTab('BRACKET')}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'BRACKET' ? 'bg-[var(--yellow)] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Fase Final
              </button>
            </div>
          </div>
        )}

        {viewMode === 'QUINIELA' && (
          <div className="flex justify-center items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={handleSave}
              disabled={isPending || isSaved}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                isSaved ? 'bg-green-500/20 text-green-400 border border-green-500' : 
                'bg-[var(--yellow)] text-black hover:bg-[var(--yellow)]/90 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
              }`}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 
               isSaved ? <CheckCircle className="w-4 h-4" /> : 
               <Save className="w-4 h-4" />}
              {isSaved ? '¡Guardado!' : 'Guardar Progreso'}
            </button>
            <button 
              onClick={() => {
                 if (confirm('¿Seguro quieres borrar tu quiniela?')) setUserPredictions({})
              }}
               className="text-xs text-gray-500 hover:text-red-400 underline decoration-dotted transition-colors"
            >
              Reiniciar
            </button>
          </div>
        )}

        {viewMode === 'REAL' && (
           <BracketExporter targetId="esquema-mundial-canvas" />
        )}
      </div>

      {activeTab === 'GROUPS' && initialGroups ? (
        <GroupStagePredictor 
          groups={initialGroups} 
          predictions={currentPredictions} 
          viewMode={viewMode}
          onGroupOrderChange={handleGroupOrderChange}
        />
      ) : (
        <InteractiveBracket 
          initialMatches={initialMatches} 
          viewMode={viewMode}
          predictions={currentPredictions}
          onSelectWinner={handleSelectWinner}
        />
      )}

      <div className="text-center text-xs text-gray-500 mt-2 pb-8 lg:hidden animate-pulse">
        ⟵ Desliza para ver todo el esquema ⟶
      </div>
    </section>
  )
}
