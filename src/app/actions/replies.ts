'use server'

import { db } from '@/db'
import { comments, users } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function addReplyToComment(parentId: string, content: string, playerId?: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Insert reply
    const [newReply] = await db.insert(comments).values({
      content,
      authorId: userId,
      parentId,
      playerId: playerId || null,
    }).returning()

    // Increment original comment repliesCount
    await db
      .update(comments)
      .set({ repliesCount: sql`${comments.repliesCount} + 1` })
      .where(eq(comments.id, parentId))

    return { success: true, data: newReply }
  } catch (error) {
    console.error('Error adding reply:', error)
    return { success: false, error: 'Failed to add reply' }
  }
}

export async function fetchCommentReplies(parentId: string, page: number = 1, limit: number = 5) {
  const session = await auth()
  const offset = (page - 1) * limit
  const currentUserId = session?.user?.id

  try {
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        likesCount: comments.likesCount,
        repostsCount: comments.repostsCount,
        repliesCount: comments.repliesCount,
        authorId: comments.authorId,
        hasLiked: currentUserId
          ? sql<boolean>`CASE WHEN (SELECT 1 FROM comment_likes cl WHERE cl.comment_id = ${comments.id} AND cl.user_id = ${currentUserId}) = 1 THEN true ELSE false END`.as('has_liked')
          : sql<boolean>`false`.as('has_liked'),
        hasReposted: currentUserId
          ? sql<boolean>`CASE WHEN (SELECT 1 FROM comment_reposts cr WHERE cr.comment_id = ${comments.id} AND cr.user_id = ${currentUserId}) = 1 THEN true ELSE false END`.as('has_reposted')
          : sql<boolean>`false`.as('has_reposted'),
        user: {
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.parentId, parentId))
      .orderBy(comments.createdAt)
      .limit(limit)
      .offset(offset)

    return { success: true, data: result, hasMore: result.length === limit }
  } catch (error) {
    console.error('Error fetching replies:', error)
    return { success: false, error: 'Failed to fetch replies' }
  }
}
