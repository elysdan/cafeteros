import { NextResponse } from 'next/server'
import { syncRSSFeeds } from '@/lib/rss'

// Esta ruta puede ser llamada por un cron job externo (ej. cron-job.org)
// o manualmente. Protegida con un secreto básico.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'dev-cron-secret'

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await syncRSSFeeds()
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('RSS sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
