'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { commentLikes, comments } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'

export async function toggleCommentLike(commentId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    // Check if the like already exists
    const existingLike = await db
      .select()
      .from(commentLikes)
      .where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)))
      .limit(1)

    if (existingLike.length > 0) {
      // Remove Like
      await db.delete(commentLikes)
        .where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)))
      
      // Decrement likesCount
      await db.update(comments)
        .set({ likesCount: sql`${comments.likesCount} - 1` })
        .where(eq(comments.id, commentId))

      return { success: true, hasLiked: false }
    } else {
      // Add Like
      await db.insert(commentLikes)
        .values({ userId, commentId })
      
      // Increment likesCount
      await db.update(comments)
        .set({ likesCount: sql`${comments.likesCount} + 1` })
        .where(eq(comments.id, commentId))

      return { success: true, hasLiked: true }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return { success: false, error: 'Internal Server Error' }
  }
}
