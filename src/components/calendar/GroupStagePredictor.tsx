'use client'

import { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { Check } from 'lucide-react'

interface Team {
  id: string
  name: string
  flag: string
  groupId: string
}

interface Group {
  id: string
  name: string
  teams: Team[]
}

interface GroupStagePredictorProps {
  groups: Group[]
  predictions: Record<string, string>
  viewMode: 'REAL' | 'QUINIELA' | 'MICASINO'
  onGroupOrderChange?: (groupId: string, orderedTeamIds: string[], bestThirds: string[]) => void
}

export default function GroupStagePredictor({
  groups,
  predictions,
  viewMode,
  onGroupOrderChange
}: GroupStagePredictorProps) {
  
  // Local state to keep track of ordering and third places.
  // Mapped as groupId -> array of team objects
  const [groupOrders, setGroupOrders] = useState<Record<string, Team[]>>({})
  const [bestThirds, setBestThirds] = useState<string[]>([]) // Array of teamIds

  useEffect(() => {
    const orders: Record<string, Team[]> = {}
    const thirds: string[] = []

    groups.forEach(group => {
      // First, see if we have predictions for this group in the dictionary
      // Keys would be like '1A', '2A', '3A', '4A' mapped to 'MEX', 'RSA', etc.
      const p1 = predictions[`1${group.id}`]
      const p2 = predictions[`2${group.id}`]
      const p3 = predictions[`3${group.id}`]
      const p4 = predictions[`4${group.id}`]

      if (p1 && p2 && p3 && p4) {
        orders[group.id] = [p1, p2, p3, p4].map(id => group.teams.find(t => t.id === id) as Team).filter(Boolean)
      } else {
        orders[group.id] = [...group.teams] 
      }
      
      if (orders[group.id].length !== 4) {
         orders[group.id] = [...group.teams]
      }
    })
    
    let parsedThirds = []
    if (predictions['BEST_3']) {
      try { parsedThirds = JSON.parse(predictions['BEST_3']) } catch {}
    }
    
    setGroupOrders(orders)
    setBestThirds(parsedThirds)
  }, [groups, predictions])

  const handleReorder = (groupId: string, newOrder: Team[]) => {
    if (viewMode !== 'QUINIELA') return

    const newOrders = { ...groupOrders, [groupId]: newOrder }
    setGroupOrders(newOrders)

    if (onGroupOrderChange) {
      onGroupOrderChange(groupId, newOrder.map(t => t.id), bestThirds)
    }
  }

  const toggleBestThird = (groupId: string, teamId: string) => {
    if (viewMode !== 'QUINIELA') return

    let newThirds = [...bestThirds]
    if (newThirds.includes(teamId)) {
      newThirds = newThirds.filter(id => id !== teamId)
    } else {
      if (newThirds.length >= 8) {
        alert('Solo pueden clasificar 8 equipos como mejores terceros.')
        return
      }
      newThirds.push(teamId)
    }
    
    setBestThirds(newThirds)
    if (onGroupOrderChange && groupOrders[groupId]) {
      onGroupOrderChange(groupId, groupOrders[groupId].map(t => t.id), newThirds)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 px-4 py-8">
      {groups.map(group => {
        const order = groupOrders[group.id] || group.teams
        const isInteractive = viewMode === 'QUINIELA'
        
        return (
          <div key={group.id} className="glass-card rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex flex-col">
            <div className="bg-white/5 py-3 px-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-[var(--yellow)] tracking-widest text-sm">
                GRUPO {group.id}
              </h3>
              {isInteractive && (
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Acomodar</span>
              )}
            </div>

            <div className="p-3 flex-grow animate-in fade-in">
              <div className="grid grid-cols-[24px_1fr_40px] px-2 pb-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold border-b border-white/5 mb-2">
                <span>Pos</span>
                <span className="pl-2">País</span>
                <span className="text-center" title="Clasificado">Clas</span>
              </div>
              
              <Reorder.Group 
                axis="y" 
                values={order} 
                onReorder={(newOrder) => handleReorder(group.id, newOrder)}
                className="flex flex-col gap-2"
              >
                {order.map((team, index) => {
                  const place = index + 1;
                  const isQualified = place <= 2;
                  const isThird = place === 3;
                  const isBestThird = isThird && bestThirds.includes(team.id);
                  let statusColor = 'text-gray-500';
                  
                  if (isQualified || isBestThird) {
                    statusColor = 'text-green-500';
                  }

                  return (
                    <Reorder.Item 
                      key={team.id} 
                      value={team}
                      dragListener={isInteractive}
                      className={`relative flex items-center p-2 rounded-xl border transition-all ${
                        isInteractive ? 'cursor-grab active:cursor-grabbing hover:bg-white/5' : ''
                      } ${place <= 2 ? 'border-white/10 bg-white/5' : place === 3 ? 'border-white/5 border-dashed' : 'border-transparent opacity-60'}`}
                    >
                      <div className="w-[24px] font-mono text-xs font-bold text-gray-400 text-center shrink-0">
                        {place}
                      </div>
                      <div className="flex-grow pl-2 flex items-center gap-3">
                        <span className="text-2xl">{team.flag}</span>
                        <span className="font-semibold text-sm truncate text-white">{team.name}</span>
                      </div>
                      
                      <div className="w-[40px] flex justify-center shrink-0">
                        {place <= 2 ? (
                           <Check className={`w-4 h-4 ${statusColor}`} />
                        ) : place === 3 && isInteractive ? (
                           <button 
                             onClick={(e) => { e.stopPropagation(); toggleBestThird(group.id, team.id); }}
                             title="Marcar como Mejor Tercero"
                             className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isBestThird ? 'bg-green-500/20 border-green-500 text-green-500' : 'border-white/20 text-transparent hover:border-green-500/50 hover:bg-green-500/10'}`}
                           >
                             <Check className="w-3 h-3" />
                           </button>
                        ) : place === 3 && !isInteractive ? (
                          isBestThird && <Check className={`w-4 h-4 ${statusColor}`} />
                        ) : null}
                      </div>

                    </Reorder.Item>
                  )
                })}
              </Reorder.Group>
            </div>
          </div>
        )
      })}
    </div>
  )
}
