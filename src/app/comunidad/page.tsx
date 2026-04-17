import { db } from '@/db'
import { comments, users } from '@/db/schema'
import { eq, desc, isNull, and } from 'drizzle-orm'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { MessageSquareText } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import CommunityForm from './CommunityForm'

export async function generateMetadata() {
  return { title: 'Comunidad de los Cafeteros | Colombia 2026' }
}

export default async function ComunidadPage() {
  const session = await auth()

  const feed = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      authorName: users.name,
      authorAvatar: users.avatarUrl
    })
    .from(comments)
    .leftJoin(users, eq(users.id, comments.authorId))
    .where(and(isNull(comments.playerId), isNull(comments.newsId)))
    .orderBy(desc(comments.createdAt))

  return (
    <>
      <Navbar userName={session?.user?.name} />
      
      <main className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-b from-[var(--bg-base)] to-black relative">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, var(--yellow) 0%, transparent 50%)' }} />
        
        <div className="max-w-2xl mx-auto relative z-10">
          
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-yellow-500 mb-4 tracking-wider" style={{ textShadow: '0 0 40px rgba(234, 179, 8, 0.3)' }}>
              COMUNIDAD DE LOS CAFETEROS
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
              El espacio libre para alentar a la tricolor, discutir las tácticas y compartir la pasión. Conecta con otros hinchas de la Selección Colombia.
            </p>
          </div>

          {session?.user ? (
            <CommunityForm />
          ) : (
            <div className="glass-card p-6 rounded-3xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border border-white/5">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Únete a la conversación</h3>
                <p className="text-xs text-gray-400">Inicia sesión para compartir tu pasión por la Selección.</p>
              </div>
              <Link href="/login" className="px-6 py-2.5 rounded-full font-bold text-sm bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shrink-0">
                Iniciar Sesión
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {feed.length > 0 ? (
              feed.map(post => (
                <div key={post.id} className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row gap-4 transition-all hover:bg-white/[0.02] border border-white/5 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700 overflow-hidden">
                    {post.authorAvatar ? (
                      <img src={post.authorAvatar} alt={post.authorName || 'Usuario'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm font-bold">
                        {(post.authorName || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-white text-sm">{post.authorName || 'Fan de la Tri'}</span>
                      <span className="text-xs text-gray-500 font-medium">· {formatRelativeTime(post.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card rounded-3xl p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10 opacity-70">
                <MessageSquareText className="w-12 h-12 mb-4 text-gray-500" />
                <p className="text-base font-medium text-gray-200">El muro está vacío</p>
                <p className="text-sm mt-1 text-gray-400">Sé el primero en alentar a la Selección en la Comunidad de los Cafeteros.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      
      <Footer />
    </>
  )
}
