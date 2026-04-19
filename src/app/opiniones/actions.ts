'use server'

import { db } from '@/db'
import { comments, users, players, commentLikes } from '@/db/schema'
import { desc, isNotNull, eq, sql, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function fetchRecentOpinions(page: number = 1, limit: number = 3) {
  const session = await auth()
  const offset = (page - 1) * limit
  const currentUserId = session?.user?.id

  try {
    // Only fetch comments that are directed at a player (playerId is not null)
    // and join with users and players to get the names and avatars.
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        likesCount: comments.likesCount,
        authorId: comments.authorId,
        hasLiked: currentUserId
          ? sql<boolean>`CASE WHEN (SELECT 1 FROM comment_likes cl WHERE cl.comment_id = ${comments.id} AND cl.user_id = ${currentUserId}) = 1 THEN true ELSE false END`.as('has_liked')
          : sql<boolean>`false`.as('has_liked'),
        user: {
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
        player: {
          name: players.name,
          imageUrl: players.imageUrl,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .innerJoin(players, eq(comments.playerId, players.id))
      .where(isNotNull(comments.playerId))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset)

    // We also need the total count to know when to stop pagination
    // Since Drizzle in Postgres doesn't have a simple .count() without raw queries sometimes, 
    // we can do a simple count query:
    const totalCountQuery = await db
      .select({ id: comments.id })
      .from(comments)
      .where(isNotNull(comments.playerId))

    const totalCount = totalCountQuery.length

    return {
      success: true,
      data: result,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error('Error fetching recent opinions:', error)
    return { success: false, error: 'Failed to fetch opinions' }
  }
}
