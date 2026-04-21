'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { userBrackets } from '@/db/schema'

export async function saveUserBracket(predictions: Record<string, string>) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    await db.insert(userBrackets)
      .values({ 
        userId, 
        predictions,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: userBrackets.userId,
        set: { predictions, updatedAt: new Date() }
      })

    return { success: true }
  } catch (error) {
    console.error('Error saving bracket:', error)
    return { success: false, error: 'Internal Server Error' }
  }
}
