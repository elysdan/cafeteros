'use server'

import { db } from '@/db'
import { comments, commentReposts } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function toggleCommentRepost(commentId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const existing = await db
      .select()
      .from(commentReposts)
      .where(and(eq(commentReposts.userId, userId), eq(commentReposts.commentId, commentId)))
      .limit(1)

    if (existing.length > 0) {
      await db
        .delete(commentReposts)
        .where(and(eq(commentReposts.userId, userId), eq(commentReposts.commentId, commentId)))
      
      await db
        .update(comments)
        .set({ repostsCount: sql`${comments.repostsCount} - 1` })
        .where(eq(comments.id, commentId))
        
      return { success: true, action: 'removed' }
    } else {
      await db.insert(commentReposts).values({
        userId,
        commentId,
      })
      
      await db
        .update(comments)
        .set({ repostsCount: sql`${comments.repostsCount} + 1` })
        .where(eq(comments.id, commentId))
        
      return { success: true, action: 'added' }
    }
  } catch (error) {
    console.error('Error toggling comment repost:', error)
    return { success: false, error: 'Failed to toggle repost' }
  }
}
