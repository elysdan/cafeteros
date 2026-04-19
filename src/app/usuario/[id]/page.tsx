import { notFound } from 'next/navigation'
import { db } from '@/db'
import { users, comments, players } from '@/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, MessageSquareText, Heart, Flame } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import CommentCard from '@/components/shared/CommentCard'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [user] = await db.select({ name: users.name }).from(users).where(eq(users.id, id)).limit(1)
  return { title: `${user?.name || 'Usuario'} | Colombia 2026` }
}

export default async function UserWallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const currentUserId = session?.user?.id

  // Fetch user profile
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!user) notFound()

  // Fetch stats
  const [stats] = await db
    .select({
      totalComments: sql<number>`count(*)`.as('total_comments'),
      totalLikes: sql<number>`coalesce(sum(${comments.likesCount}), 0)`.as('total_likes'),
    })
    .from(comments)
    .where(eq(comments.authorId, id))

  // Fetch all comments by user, with context (player name if applicable)
  const userComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      likesCount: comments.likesCount,
      playerId: comments.playerId,
      newsId: comments.newsId,
      playerName: players.name,
      hasLiked: currentUserId
        ? sql<boolean>`CASE WHEN (SELECT 1 FROM comment_likes cl WHERE cl.comment_id = ${comments.id} AND cl.user_id = ${currentUserId}) = 1 THEN true ELSE false END`.as('has_liked')
        : sql<boolean>`false`.as('has_liked')
    })
    .from(comments)
    .leftJoin(players, eq(comments.playerId, players.id))
    .where(eq(comments.authorId, id))
    .orderBy(desc(comments.createdAt))

  // Build context labels
  const commentsWithContext = userComments.map(c => {
    let contextLabel: string | null = null
    if (c.playerName) {
      contextLabel = `Perfil de ${c.playerName}`
    } else if (c.newsId) {
      contextLabel = 'Noticias'
    } else {
      contextLabel = 'Comunidad'
    }
    return { ...c, contextLabel }
  })

  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
    : 'Desconocido'

  return (
    <>
      <Navbar userName={session?.user?.name} />

      <main className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 10%, var(--yellow) 0%, transparent 50%)' }}
        />

        <div className="max-w-2xl mx-auto relative z-10">

          <Link
            href="/comunidad"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Comunidad
          </Link>

          {/* Profile Header */}
          <div className="glass-card rounded-3xl p-8 mb-8 flex flex-col sm:flex-row items-center gap-6 border border-white/5">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-[var(--yellow)]/30 overflow-hidden relative shrink-0 shadow-[0_0_30px_rgba(245,197,24,0.15)]">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[var(--yellow)]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-display text-3xl sm:text-4xl tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>
                {user.name}
              </h1>
              <p className="text-sm text-gray-500">
                Miembro desde {joinDate}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="glass-card rounded-2xl p-6 text-center border border-white/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquareText className="w-5 h-5 text-[var(--yellow)]" />
              </div>
              <span className="font-mono text-3xl font-bold text-white block mb-1">{stats?.totalComments ?? 0}</span>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Publicaciones</span>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center border border-white/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-mono text-3xl font-bold text-white block mb-1">{stats?.totalLikes ?? 0}</span>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Likes recibidos</span>
            </div>
          </div>

          {/* Wall / Timeline */}
          <h2 className="font-display text-2xl tracking-wider mb-6 border-b border-white/10 pb-4" style={{ color: 'var(--text-primary)' }}>
            MURO DE PUBLICACIONES
          </h2>

          <div className="flex flex-col gap-4">
            {commentsWithContext.length > 0 ? (
              commentsWithContext.map(c => (
                <CommentCard
                  key={c.id}
                  id={c.id}
                  content={c.content}
                  formattedTime={formatRelativeTime(c.createdAt)}
                  authorId={user.id}
                  authorName={user.name}
                  authorAvatar={user.avatarUrl}
                  initialLikesCount={c.likesCount}
                  initialHasLiked={c.hasLiked}
                  contextLabel={c.contextLabel}
                />
              ))
            ) : (
              <div className="glass-card rounded-3xl p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10 opacity-70">
                <MessageSquareText className="w-12 h-12 mb-4 text-gray-500" />
                <p className="text-base font-medium text-gray-200">Sin publicaciones todavía</p>
                <p className="text-sm mt-1 text-gray-400">{user.name} aún no ha compartido nada en la plataforma.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
