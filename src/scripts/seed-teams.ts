import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { worldCupGroups, soccerTeams, worldCupMatches } from '../db/schema'
import { eq } from 'drizzle-orm'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool)

const groupsData = [
  { id: 'A', name: 'Grupo A', teams: [{ id: 'MEX', name: 'México', flag: '🇲🇽' }, { id: 'USA', name: 'Estados Unidos', flag: '🇺🇸' }] },
  { id: 'B', name: 'Grupo B', teams: [{ id: 'ARG', name: 'Argentina', flag: '🇦🇷' }, { id: 'CAN', name: 'Canadá', flag: '🇨🇦' }] },
  { id: 'C', name: 'Grupo C', teams: [{ id: 'BRA', name: 'Brasil', flag: '🇧🇷' }, { id: 'ESP', name: 'España', flag: '🇪🇸' }] },
  { id: 'K', name: 'Grupo K', teams: [{ id: 'UZB', name: 'Uzbekistán', flag: '🇺🇿' }, { id: 'COL', name: 'Colombia', flag: '🇨🇴' }, { id: 'COD', name: 'RD Congo', flag: '🇨🇩' }, { id: 'POR', name: 'Portugal', flag: '🇵🇹' }] },
  { id: 'L', name: 'Grupo L', teams: [{ id: 'FRA', name: 'Francia', flag: '🇫🇷' }, { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { id: 'GER', name: 'Alemania', flag: '🇩🇪' }, { id: 'ITA', name: 'Italia', flag: '🇮🇹' }] },
]

async function seed() {
  console.log('Seeding tournament data...')

  for (const group of groupsData) {
    // Upsert logic basically: Check if group exists, if not insert
    const existingGroup = await db.select().from(worldCupGroups).where(eq(worldCupGroups.id, group.id)).limit(1)
    if (existingGroup.length === 0) {
      await db.insert(worldCupGroups).values({ id: group.id, name: group.name })
    }

    // Insert teams
    for (const team of group.teams) {
      const existingTeam = await db.select().from(soccerTeams).where(eq(soccerTeams.id, team.id)).limit(1)
      if (existingTeam.length === 0) {
        await db.insert(soccerTeams).values({ id: team.id, name: team.name, flag: team.flag, groupId: group.id })
      }
    }
  }

  // Insert mock matches for group K and L specifically
  console.log('Seeding mock matches...')
  const m1 = await db.select().from(worldCupMatches).where(eq(worldCupMatches.team1Id, 'COL')).limit(1)
  
  if (m1.length === 0) {
    // Colombia matches
    await db.insert(worldCupMatches).values([
      { team1Id: 'COL', team2Id: 'UZB', date: new Date('2026-06-17T22:00:00-05:00'), venue: 'Mexico City Stadium', city: 'Ciudad de México', phase: 'Fase de Grupos · Grupo K' },
      { team1Id: 'COL', team2Id: 'COD', date: new Date('2026-06-23T22:00:00-05:00'), venue: 'Guadalajara Stadium', city: 'Guadalajara', phase: 'Fase de Grupos · Grupo K' },
      { team1Id: 'COL', team2Id: 'POR', date: new Date('2026-06-27T19:30:00-05:00'), venue: 'Miami Stadium', city: 'Miami', phase: 'Fase de Grupos · Grupo K' },
      
      // France matches
      { team1Id: 'FRA', team2Id: 'ENG', date: new Date('2026-06-18T20:00:00-05:00'), venue: 'MetLife Stadium', city: 'New York/NJ', phase: 'Fase de Grupos · Grupo L' },
      { team1Id: 'FRA', team2Id: 'GER', date: new Date('2026-06-24T18:00:00-05:00'), venue: 'SoFi Stadium', city: 'Los Angeles', phase: 'Fase de Grupos · Grupo L' },
    ])
  }

  console.log('Seed completed.')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
