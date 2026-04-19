'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, MessageSquareQuote, Heart } from 'lucide-react'
import Link from 'next/link'
import { fetchRecentOpinions } from '@/app/opiniones/actions'
import { toggleCommentLike } from '@/app/actions/likes'
import { cn } from '@/lib/utils'

interface OpinionData {
  id: string
  content: string
  createdAt: Date
  likesCount: number
  hasLiked: boolean
  authorId: string
  user: {
    name: string
    avatarUrl: string | null
  }
  player: {
    name: string
    imageUrl: string | null
  }
}

function RecentOpinionCard({ op }: { op: OpinionData }) {
  const [likesCount, setLikesCount] = useState(op.likesCount || 0)
  const [hasLiked, setHasLiked] = useState(op.hasLiked || false)
  const [isPending, setIsPending] = useState(false)

  const handleLike = async () => {
    const prevHasLiked = hasLiked
    const prevLikesCount = likesCount

    setHasLiked(!prevHasLiked)
    setLikesCount(prevLikesCount + (prevHasLiked ? -1 : 1))
    setIsPending(true)

    const result = await toggleCommentLike(op.id)
    setIsPending(false)

    if (!result.success) {
      setHasLiked(prevHasLiked)
      setLikesCount(prevLikesCount)
      if (result.error === 'Unauthorized') {
        alert('Debes iniciar sesión para dar Me gusta.')
      }
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col relative overflow-hidden group hover:border-[var(--yellow)]/30 hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--yellow)]/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-[var(--yellow)]/10 transition-colors" />

      <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10 relative z-10">
        <div className="flex flex-col items-center gap-2">
           <div className="w-14 h-14 rounded-full bg-gray-800 overflow-hidden relative border border-white/20">
              {op.user.avatarUrl ? (
                <Image src={op.user.avatarUrl} alt={op.user.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase text-lg">{op.user.name[0]}</div>
              )}
           </div>
           <Link href={`/usuario/${op.authorId}`} className="text-xs font-bold text-gray-300 text-center truncate w-20 hover:text-[var(--yellow)] transition-colors" title={op.user.name}>{op.user.name.split(' ')[0]}</Link>
        </div>

        <div className="flex flex-col items-center px-2">
            <span className="text-[10px] font-mono text-gray-500 tracking-widest mb-1 italic">sobre</span>
            <ArrowRight className="w-5 h-5 text-[var(--yellow)]/70" />
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="w-14 h-14 rounded-full bg-gray-800 overflow-hidden relative border-2 border-[var(--yellow)] shadow-[0_0_15px_rgba(255,204,0,0.2)]">
              {op.player.imageUrl && (
                <Image src={op.player.imageUrl} alt={op.player.name} fill className="object-cover" />
              )}
           </div>
           <span className="text-xs font-bold text-[var(--yellow)] text-center truncate w-24" title={op.player.name}>{op.player.name.split(' ').slice(-1)[0]}</span>
        </div>
      </div>

      <p className="text-gray-300 text-sm italic leading-relaxed line-clamp-4 relative z-10 flex-grow pr-8">
        "{op.content}"
      </p>

      <button 
        onClick={handleLike}
        disabled={isPending}
        className={cn(
          "absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm z-20",
          hasLiked 
            ? "bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
            : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
        )}
        title={hasLiked ? "Quitar Me gusta" : "Dar Me gusta"}
      >
        <Heart className={cn("w-4 h-4 transition-transform", hasLiked && "fill-current scale-110")} />
        {likesCount > 0 && <span className="font-mono">{likesCount}</span>}
      </button>
    </div>
  )
}

export default function RecentOpinions() {
  const [opinions, setOpinions] = useState<OpinionData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOpinions(currentPage)
  }, [currentPage])

  const loadOpinions = async (page: number) => {
    setLoading(true)
    const result = await fetchRecentOpinions(page, 3)
    if (result.success && result.data) {
      setOpinions(result.data as OpinionData[])
      setTotalPages(result.totalPages || 1)
    }
    setLoading(false)
  }

  // Helper for pagination limits
  const getPageNumbers = () => {
    const pages = []
    let p = 1
    // Simplistic pagination logic for up to 5 pages shown
    while (p <= totalPages && p <= 5) {
        pages.push(p)
        p++
    }
    return pages
  }

  return (
    <section className="py-20 relative bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <MessageSquareQuote className="w-8 h-8 text-[var(--yellow)]" />
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">
            Opiniones Recientes
          </h2>
        </div>

        <div className="relative min-h-[300px]">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-white/20 border-t-[var(--yellow)] rounded-full animate-spin" />
            </div>
          ) : opinions.length === 0 ? (
            <p className="text-gray-400 text-center py-20">Aún no hay opiniones registradas a jugadores.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opinions.map((op) => (
                <RecentOpinionCard key={op.id} op={op} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 bg-white/5 py-3 px-6 rounded-full w-max mx-auto border border-white/10 backdrop-blur-md">
             <button 
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1 || loading}
               className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1 cursor-pointer"
             >
               <ChevronLeft className="w-5 h-5" />
               <span className="hidden sm:inline text-sm font-semibold pr-2">Anterior</span>
             </button>

             <div className="flex items-center gap-1 mx-2">
               {getPageNumbers().map(num => (
                 <button
                   key={num}
                   onClick={() => setCurrentPage(num)}
                   disabled={loading}
                   className={`w-10 h-10 rounded-full font-bold text-sm transition-all cursor-pointer ${currentPage === num ? 'bg-[var(--yellow)] text-black shadow-[0_0_15px_rgba(255,204,0,0.4)]' : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'}`}
                 >
                   {num}
                 </button>
               ))}
               {totalPages > 5 && <span className="text-gray-500 tracking-widest px-2">...</span>}
             </div>

             <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages || loading}
               className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1 cursor-pointer"
             >
               <span className="hidden sm:inline text-sm font-semibold pl-2">Próximo</span>
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>
    </section>
  )
}
