'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleCommentLike } from '@/app/actions/likes'

interface CommentCardProps {
  id: string
  content: string
  formattedTime: string
  authorId?: string | null
  authorName: string | null
  authorAvatar: string | null
  initialLikesCount: number
  initialHasLiked: boolean
  contextLabel?: string | null
}

export default function CommentCard({
  id,
  content,
  formattedTime,
  authorId,
  authorName,
  authorAvatar,
  initialLikesCount,
  initialHasLiked,
  contextLabel,
}: CommentCardProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0)
  const [hasLiked, setHasLiked] = useState(initialHasLiked)
  const [isPending, setIsPending] = useState(false)

  const handleLike = async () => {
    // Optimistic UI updates
    const prevHasLiked = hasLiked
    const prevLikesCount = likesCount

    setHasLiked(!prevHasLiked)
    setLikesCount(prevLikesCount + (prevHasLiked ? -1 : 1))
    setIsPending(true)

    const result = await toggleCommentLike(id)
    
    setIsPending(false)

    if (!result.success) {
      // Revert if failed
      setHasLiked(prevHasLiked)
      setLikesCount(prevLikesCount)
      if (result.error === 'Unauthorized') {
        alert('Debes iniciar sesión para dar Me gusta.')
      }
    }
  }

  const displayName = authorName || 'Fan de la Tri'

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start transition-all hover:bg-white/[0.02] border border-white/5 shadow-lg relative group">
      {authorId ? (
        <Link href={`/usuario/${authorId}`} className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 overflow-hidden relative hover:border-[var(--yellow)] transition-colors">
            {authorAvatar ? (
              <Image src={authorAvatar} alt={displayName} fill className="object-cover" />
            ) : (
              <span className="text-gray-400 text-sm font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700 overflow-hidden relative">
          {authorAvatar ? (
            <Image src={authorAvatar} alt={displayName} fill className="object-cover" />
          ) : (
            <span className="text-gray-400 text-sm font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}
      
      <div className="flex-grow min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              {authorId ? (
                <Link href={`/usuario/${authorId}`} className="font-bold text-white text-sm hover:text-[var(--yellow)] transition-colors">
                  {displayName}
                </Link>
              ) : (
                <span className="font-bold text-white text-sm">{displayName}</span>
              )}
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">· {formattedTime}</span>
            </div>
            {contextLabel && (
              <span className="text-[11px] text-gray-500 font-medium">
                📍 {contextLabel}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleLike}
            disabled={isPending}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all sm:absolute sm:top-5 sm:right-5 cursor-pointer shadow-sm",
              hasLiked 
                ? "bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
            )}
            title={hasLiked ? "Quitar Me gusta" : "Dar Me gusta"}
          >
            <Heart 
              className={cn("w-4 h-4 transition-transform", hasLiked && "fill-current scale-110")} 
            />
            {likesCount > 0 && <span className="font-mono">{likesCount}</span>}
          </button>
        </div>
        
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words pr-2">
          {content}
        </p>
      </div>
    </div>
  )
}
