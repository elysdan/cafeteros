import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../src/db/schema.js'
import { COLOMBIA_PLAYERS } from '../src/lib/players-data.js'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

async function seed() {
  console.log('Iniciando seed de jugadores...')

  for (const player of COLOMBIA_PLAYERS) {
    await db
      .insert(schema.players)
      .values(player)
      .onConflictDoNothing()
    console.log(`  ✅ ${player.name}`)
  }

  console.log(`\n Seed completado: ${COLOMBIA_PLAYERS.length} jugadores insertados`)
  await pool.end()
}

seed().catch((err) => {
  console.error('Error en seed:', err)
  process.exit(1)
})
