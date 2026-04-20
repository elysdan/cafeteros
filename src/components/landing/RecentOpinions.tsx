'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react'
import { fetchRecentOpinions } from '@/app/opiniones/actions'
import CommentCard from '@/components/shared/CommentCard'

interface OpinionData {
  id: string
  content: string
  createdAt: Date
  likesCount: number
  repostsCount: number
  repliesCount: number
  hasLiked: boolean
  hasReposted: boolean
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
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {opinions.map((op) => (
                <CommentCard 
                  key={op.id}
                  id={op.id}
                  content={op.content}
                  formattedTime={new Date(op.createdAt).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                  authorId={op.authorId}
                  authorName={op.user.name}
                  authorAvatar={op.user.avatarUrl}
                  initialLikesCount={op.likesCount}
                  initialRepostsCount={op.repostsCount}
                  initialRepliesCount={op.repliesCount}
                  initialHasLiked={op.hasLiked}
                  initialHasReposted={op.hasReposted}
                  contextLabel={
                    <span className="text-gray-400 text-[11px] font-medium">
                      sobre <span className="text-[var(--yellow)] uppercase tracking-wider font-bold">{op.player.name}</span>
                    </span>
                  }
                />
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
