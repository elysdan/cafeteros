'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { playerHypes, players } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'

export async function togglePlayerHype(playerId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    // Check if the hype already exists
    const existingHype = await db
      .select()
      .from(playerHypes)
      .where(and(eq(playerHypes.userId, userId), eq(playerHypes.playerId, playerId)))
      .limit(1)

    if (existingHype.length > 0) {
      // Remove Hype
      await db.delete(playerHypes)
        .where(and(eq(playerHypes.userId, userId), eq(playerHypes.playerId, playerId)))
      
      // Decrement hypeCount
      await db.update(players)
        .set({ hypeCount: sql`${players.hypeCount} - 1` })
        .where(eq(players.id, playerId))

      return { success: true, hasHyped: false }
    } else {
      // Add Hype
      await db.insert(playerHypes)
        .values({ userId, playerId })
      
      // Increment hypeCount
      await db.update(players)
        .set({ hypeCount: sql`${players.hypeCount} + 1` })
        .where(eq(players.id, playerId))

      return { success: true, hasHyped: true }
    }
  } catch (error) {
    console.error('Error toggling hype:', error)
    return { success: false, error: 'Internal Server Error' }
  }
}
