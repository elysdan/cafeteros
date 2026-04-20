'use client'

import { useState } from 'react'
import { Flame } from 'lucide-react'
import { togglePlayerHype } from '@/app/actions/hypes'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/ToastProvider'

interface HypeButtonProps {
  playerId: string
  initialHypeCount: number
  initialHasHyped: boolean
}

export default function HypeButton({ playerId, initialHypeCount, initialHasHyped }: HypeButtonProps) {
  const [hypeCount, setHypeCount] = useState(initialHypeCount || 0)
  const [hasHyped, setHasHyped] = useState(initialHasHyped)
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const handleHype = async () => {
    // Optimistic UI update
    const prevHasHyped = hasHyped
    const prevHypeCount = hypeCount

    setHasHyped(!prevHasHyped)
    setHypeCount(prevHypeCount + (prevHasHyped ? -1 : 1))
    setIsPending(true)

    const result = await togglePlayerHype(playerId)
    setIsPending(false)

    if (!result.success) {
      // Revert on failure
      setHasHyped(prevHasHyped)
      setHypeCount(prevHypeCount)
      if (result.error === 'Unauthorized') {
        toast('Debes iniciar sesión para dar Hype a este jugador.', 'error')
      } else {
        toast('Ha ocurrido un error al enviar el Hype.', 'error')
      }
    }
  }

  return (
    <button 
      onClick={handleHype}
      disabled={isPending}
      className={cn(
        "glass-card p-6 sm:p-8 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-transform relative overflow-hidden group cursor-pointer",
        hasHyped ? "border-[var(--yellow)]/60 bg-[var(--yellow)]/10" : "border-white/10 hover:border-[var(--yellow)]/30 hover:bg-white/5",
        "active:scale-95"
      )}
      style={{ minWidth: '220px' }}
    >
      <div className={cn("absolute inset-0 transition-opacity bg-[radial-gradient(ellipse_at_center,var(--yellow)_0%,transparent_70%)]", hasHyped ? "opacity-20" : "opacity-0 group-hover:opacity-10")} />
      
      <Flame 
        className={cn(
          "w-12 h-12 transition-all duration-300 relative z-10",
          hasHyped ? "text-[var(--yellow)] drop-shadow-[0_0_15px_rgba(255,204,0,0.6)]" : "text-gray-400 group-hover:text-yellow-500/70"
        )} 
      />
      
      <div className="text-center relative z-10">
        <span className={cn("block font-display text-5xl mb-1 transition-colors", hasHyped ? "text-[var(--yellow)]" : "text-white")}>
          {hypeCount.toLocaleString()}
        </span>
        <span className="text-sm font-bold uppercase tracking-widest text-[var(--yellow)] opacity-80">
          Hypes
        </span>
      </div>
    </button>
  )
}
