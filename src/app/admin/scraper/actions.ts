'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { runScraper, ScraperOptions } from '@/lib/scraper/scraper'
import { revalidatePath } from 'next/cache'

export async function executeScraperAction(options: ScraperOptions) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'No autorizado' }
    }

    // Verify role ADMIN
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (user?.role !== 'ADMIN') {
      return { success: false, error: 'No tienes permisos para ejecutar esta acción' }
    }

    // Run scraper with the options provided from the client
    const savedCount = await runScraper(options)

    // Revalidate the news page
    revalidatePath('/noticias')

    return { 
      success: true, 
      message: `Scraper ejecutado con éxito. Noticias procesadas/actualizadas: ${savedCount}`,
      count: savedCount 
    }
  } catch (error: any) {
    console.error('Error executing scraper action:', error)
    return { success: false, error: error.message || 'Error interno al ejecutar el scraper' }
  }
}
