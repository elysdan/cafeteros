import { config } from 'dotenv'
config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { worldCupGroups, soccerTeams, worldCupMatches } from '../db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool)

const groupsData = [
  { id: 'A', name: 'Grupo A', teams: [
    { id: 'MEX', name: 'México', flag: '🇲🇽' },
    { id: 'RSA', name: 'Sudáfrica', flag: '🇿🇦' },
    { id: 'KOR', name: 'Corea del Sur', flag: '🇰🇷' },
    { id: 'CZE', name: 'Chequia', flag: '🇨🇿' }
  ]},
  { id: 'B', name: 'Grupo B', teams: [
    { id: 'CAN', name: 'Canadá', flag: '🇨🇦' },
    { id: 'BIH', name: 'Bosnia y Herzegovina', flag: '🇧🇦' },
    { id: 'QAT', name: 'Catar', flag: '🇶🇦' },
    { id: 'SUI', name: 'Suiza', flag: '🇨🇭' }
  ]},
  { id: 'C', name: 'Grupo C', teams: [
    { id: 'BRA', name: 'Brasil', flag: '🇧🇷' },
    { id: 'MAR', name: 'Marruecos', flag: '🇲🇦' },
    { id: 'HAI', name: 'Haití', flag: '🇭🇹' },
    { id: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }
  ]},
  { id: 'D', name: 'Grupo D', teams: [
    { id: 'USA', name: 'Estados Unidos', flag: '🇺🇸' },
    { id: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
    { id: 'AUS', name: 'Australia', flag: '🇦🇺' },
    { id: 'TUR', name: 'Turquía', flag: '🇹🇷' }
  ]},
  { id: 'E', name: 'Grupo E', teams: [
    { id: 'GER', name: 'Alemania', flag: '🇩🇪' },
    { id: 'CUW', name: 'Curazao', flag: '🇨🇼' },
    { id: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮' },
    { id: 'ECU', name: 'Ecuador', flag: '🇪🇨' }
  ]},
  { id: 'F', name: 'Grupo F', teams: [
    { id: 'NED', name: 'Países Bajos', flag: '🇳🇱' },
    { id: 'JPN', name: 'Japón', flag: '🇯🇵' },
    { id: 'SWE', name: 'Suecia', flag: '🇸🇪' },
    { id: 'TUN', name: 'Túnez', flag: '🇹🇳' }
  ]},
  { id: 'G', name: 'Grupo G', teams: [
    { id: 'BEL', name: 'Bélgica', flag: '🇧🇪' },
    { id: 'EGY', name: 'Egipto', flag: '🇪🇬' },
    { id: 'IRN', name: 'Irán', flag: '🇮🇷' },
    { id: 'NZL', name: 'Nueva Zelanda', flag: '🇳🇿' }
  ]},
  { id: 'H', name: 'Grupo H', teams: [
    { id: 'ESP', name: 'España', flag: '🇪🇸' },
    { id: 'CPV', name: 'Cabo Verde', flag: '🇨🇻' },
    { id: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦' },
    { id: 'URU', name: 'Uruguay', flag: '🇺🇾' }
  ]},
  { id: 'I', name: 'Grupo I', teams: [
    { id: 'FRA', name: 'Francia', flag: '🇫🇷' },
    { id: 'SEN', name: 'Senegal', flag: '🇸🇳' },
    { id: 'IRQ', name: 'Irak', flag: '🇮🇶' },
    { id: 'NOR', name: 'Noruega', flag: '🇳🇴' }
  ]},
  { id: 'J', name: 'Grupo J', teams: [
    { id: 'ARG', name: 'Argentina', flag: '🇦🇷' },
    { id: 'ALG', name: 'Argelia', flag: '🇩🇿' },
    { id: 'AUT', name: 'Austria', flag: '🇦🇹' },
    { id: 'JOR', name: 'Jordania', flag: '🇯🇴' }
  ]},
  { id: 'K', name: 'Grupo K', teams: [
    { id: 'POR', name: 'Portugal', flag: '🇵🇹' },
    { id: 'COD', name: 'RD Congo', flag: '🇨🇩' },
    { id: 'UZB', name: 'Uzbekistán', flag: '🇺🇿' },
    { id: 'COL', name: 'Colombia', flag: '🇨🇴' }
  ]},
  { id: 'L', name: 'Grupo L', teams: [
    { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'CRO', name: 'Croacia', flag: '🇭🇷' },
    { id: 'GHA', name: 'Ghana', flag: '🇬🇭' },
    { id: 'PAN', name: 'Panamá', flag: '🇵🇦' }
  ]},
]

const matchesData = [
  // Fecha 1 según imágenes proporcionadas (Horario UTC-4)

  // Grupo A
  { team1Id: 'MEX', team2Id: 'RSA', date: new Date('2026-06-11T15:00:00-04:00'), venue: 'Estadio Azteca', city: 'Ciudad de México', phase: 'Fase de Grupos · Grupo A' },
  { team1Id: 'KOR', team2Id: 'CZE', date: new Date('2026-06-11T22:00:00-04:00'), venue: 'Estadio Akron', city: 'Guadalajara', phase: 'Fase de Grupos · Grupo A' },

  // Grupo B
  { team1Id: 'CAN', team2Id: 'BIH', date: new Date('2026-06-12T15:00:00-04:00'), venue: 'BMO Field', city: 'Toronto', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'QAT', team2Id: 'SUI', date: new Date('2026-06-13T15:00:00-04:00'), venue: 'BC Place', city: 'Vancouver', phase: 'Fase de Grupos · Grupo B' },

  // Grupo C
  { team1Id: 'BRA', team2Id: 'MAR', date: new Date('2026-06-13T18:00:00-04:00'), venue: 'Mercedes-Benz Stadium', city: 'Atlanta', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'HAI', team2Id: 'SCO', date: new Date('2026-06-13T21:00:00-04:00'), venue: 'Gillette Stadium', city: 'Boston', phase: 'Fase de Grupos · Grupo C' },

  // Grupo D
  { team1Id: 'USA', team2Id: 'PAR', date: new Date('2026-06-12T21:00:00-04:00'), venue: 'SoFi Stadium', city: 'Los Angeles', phase: 'Fase de Grupos · Grupo D' },
  { team1Id: 'AUS', team2Id: 'TUR', date: new Date('2026-06-14T00:00:00-04:00'), venue: "Levi's Stadium", city: 'San Francisco', phase: 'Fase de Grupos · Grupo D' },

  // Grupo E
  { team1Id: 'GER', team2Id: 'CUW', date: new Date('2026-06-14T13:00:00-04:00'), venue: 'NRG Stadium', city: 'Houston', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'CIV', team2Id: 'ECU', date: new Date('2026-06-14T19:00:00-04:00'), venue: 'Lumen Field', city: 'Seattle', phase: 'Fase de Grupos · Grupo E' },

  // Grupo F
  { team1Id: 'NED', team2Id: 'JPN', date: new Date('2026-06-14T16:00:00-04:00'), venue: 'Lincoln Financial Field', city: 'Philadelphia', phase: 'Fase de Grupos · Grupo F' },
  { team1Id: 'SWE', team2Id: 'TUN', date: new Date('2026-06-14T22:00:00-04:00'), venue: 'MetLife Stadium', city: 'New York/NJ', phase: 'Fase de Grupos · Grupo F' },

  // Grupo G
  { team1Id: 'BEL', team2Id: 'EGY', date: new Date('2026-06-15T15:00:00-04:00'), venue: 'Hard Rock Stadium', city: 'Miami', phase: 'Fase de Grupos · Grupo G' },
  { team1Id: 'IRN', team2Id: 'NZL', date: new Date('2026-06-15T21:00:00-04:00'), venue: 'AT&T Stadium', city: 'Dallas', phase: 'Fase de Grupos · Grupo G' },

  // Grupo H
  { team1Id: 'ESP', team2Id: 'CPV', date: new Date('2026-06-15T12:00:00-04:00'), venue: 'Arrowhead Stadium', city: 'Kansas City', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'KSA', team2Id: 'URU', date: new Date('2026-06-15T18:00:00-04:00'), venue: 'Mercedes-Benz Stadium', city: 'Atlanta', phase: 'Fase de Grupos · Grupo H' },

  // Grupo I
  { team1Id: 'FRA', team2Id: 'SEN', date: new Date('2026-06-16T15:00:00-04:00'), venue: 'MetLife Stadium', city: 'New York/NJ', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'IRQ', team2Id: 'NOR', date: new Date('2026-06-16T18:00:00-04:00'), venue: 'Gillette Stadium', city: 'Boston', phase: 'Fase de Grupos · Grupo I' },

  // Grupo J
  { team1Id: 'ARG', team2Id: 'ALG', date: new Date('2026-06-16T21:00:00-04:00'), venue: 'SoFi Stadium', city: 'Los Angeles', phase: 'Fase de Grupos · Grupo J' },
  { team1Id: 'AUT', team2Id: 'JOR', date: new Date('2026-06-17T00:00:00-04:00'), venue: "Levi's Stadium", city: 'San Francisco', phase: 'Fase de Grupos · Grupo J' },

  // Grupo K
  { team1Id: 'POR', team2Id: 'COD', date: new Date('2026-06-17T13:00:00-04:00'), venue: 'Hard Rock Stadium', city: 'Miami', phase: 'Fase de Grupos · Grupo K' },
  { team1Id: 'UZB', team2Id: 'COL', date: new Date('2026-06-17T22:00:00-04:00'), venue: 'Estadio Monterrey', city: 'Monterrey', phase: 'Fase de Grupos · Grupo K' },

  // Grupo L
  { team1Id: 'ENG', team2Id: 'CRO', date: new Date('2026-06-17T16:00:00-04:00'), venue: 'Lincoln Financial Field', city: 'Philadelphia', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'GHA', team2Id: 'PAN', date: new Date('2026-06-17T19:00:00-04:00'), venue: 'NRG Stadium', city: 'Houston', phase: 'Fase de Grupos · Grupo L' },

  // --- MATCHDAY 2 & MATCHDAY 3 (Imágenes recibidas) ---
  
  // Grupo A, B, C, D (18/6 - 19/6)
  { team1Id: 'CZE', team2Id: 'RSA', date: new Date('2026-06-18T12:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo A' },
  { team1Id: 'SUI', team2Id: 'BIH', date: new Date('2026-06-18T15:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'CAN', team2Id: 'QAT', date: new Date('2026-06-18T18:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'MEX', team2Id: 'KOR', date: new Date('2026-06-18T21:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo A' },

  { team1Id: 'USA', team2Id: 'AUS', date: new Date('2026-06-19T15:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo D' },
  { team1Id: 'SCO', team2Id: 'MAR', date: new Date('2026-06-19T18:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'BRA', team2Id: 'HAI', date: new Date('2026-06-19T20:30:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'TUR', team2Id: 'PAR', date: new Date('2026-06-19T23:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo D' },

  // Grupo E, F, G, H (20/6 - 21/6)
  { team1Id: 'NED', team2Id: 'SWE', date: new Date('2026-06-20T13:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo F' },
  { team1Id: 'GER', team2Id: 'CIV', date: new Date('2026-06-20T16:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'ECU', team2Id: 'CUW', date: new Date('2026-06-20T20:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'TUN', team2Id: 'JPN', date: new Date('2026-06-21T00:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo F' },

  { team1Id: 'ESP', team2Id: 'KSA', date: new Date('2026-06-21T12:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'BEL', team2Id: 'IRN', date: new Date('2026-06-21T15:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo G' },
  { team1Id: 'URU', team2Id: 'CPV', date: new Date('2026-06-21T18:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'NZL', team2Id: 'EGY', date: new Date('2026-06-21T21:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo G' },

  // Grupo I, J, K, L (22/6 - 23/6)
  { team1Id: 'ARG', team2Id: 'AUT', date: new Date('2026-06-22T13:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo J' },
  { team1Id: 'FRA', team2Id: 'IRQ', date: new Date('2026-06-22T17:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'NOR', team2Id: 'SEN', date: new Date('2026-06-22T20:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'JOR', team2Id: 'ALG', date: new Date('2026-06-22T23:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo J' },

  { team1Id: 'POR', team2Id: 'UZB', date: new Date('2026-06-23T13:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo K' },
  { team1Id: 'ENG', team2Id: 'GHA', date: new Date('2026-06-23T16:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'PAN', team2Id: 'CRO', date: new Date('2026-06-23T19:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'COL', team2Id: 'COD', date: new Date('2026-06-23T22:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo K' },

  // Grupo B, C, A (24/6) - Simultáneos Matchday 3
  { team1Id: 'SUI', team2Id: 'CAN', date: new Date('2026-06-24T15:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'BIH', team2Id: 'QAT', date: new Date('2026-06-24T15:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo B' },
  
  { team1Id: 'MAR', team2Id: 'HAI', date: new Date('2026-06-24T18:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'SCO', team2Id: 'BRA', date: new Date('2026-06-24T18:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo C' },

  { team1Id: 'RSA', team2Id: 'KOR', date: new Date('2026-06-24T21:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo A' },
  { team1Id: 'CZE', team2Id: 'MEX', date: new Date('2026-06-24T21:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo A' },

  // Grupo E, F, D (25/6) - Simultáneos Matchday 3
  { team1Id: 'CUW', team2Id: 'CIV', date: new Date('2026-06-25T16:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'ECU', team2Id: 'GER', date: new Date('2026-06-25T16:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo E' },

  { team1Id: 'TUN', team2Id: 'NED', date: new Date('2026-06-25T19:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo F' },
  { team1Id: 'JPN', team2Id: 'SWE', date: new Date('2026-06-25T19:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo F' },

  { team1Id: 'TUR', team2Id: 'USA', date: new Date('2026-06-25T22:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo D' },
  { team1Id: 'PAR', team2Id: 'AUS', date: new Date('2026-06-25T22:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo D' },

  // Grupo I, H, G (26/6) - Simultáneos Matchday 3
  { team1Id: 'NOR', team2Id: 'FRA', date: new Date('2026-06-26T15:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'SEN', team2Id: 'IRQ', date: new Date('2026-06-26T15:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo I' },

  { team1Id: 'CPV', team2Id: 'KSA', date: new Date('2026-06-26T20:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'URU', team2Id: 'ESP', date: new Date('2026-06-26T20:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo H' },

  { team1Id: 'NZL', team2Id: 'BEL', date: new Date('2026-06-26T23:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo G' },
  { team1Id: 'EGY', team2Id: 'IRN', date: new Date('2026-06-26T23:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo G' },

  // Grupo L, K, J (27/6) - Simultáneos Matchday 3
  { team1Id: 'PAN', team2Id: 'ENG', date: new Date('2026-06-27T17:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'CRO', team2Id: 'GHA', date: new Date('2026-06-27T17:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo L' },

  { team1Id: 'COL', team2Id: 'POR', date: new Date('2026-06-27T19:30:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo K' },
  { team1Id: 'COD', team2Id: 'UZB', date: new Date('2026-06-27T19:30:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo K' },

  { team1Id: 'ALG', team2Id: 'AUT', date: new Date('2026-06-27T22:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo J' },
  { team1Id: 'JOR', team2Id: 'ARG', date: new Date('2026-06-27T22:00:00-04:00'), venue: 'Sede por confirmar', city: 'Sede', phase: 'Fase de Grupos · Grupo J' },
]

async function seed() {
  console.log('Clearing old tournament data...')
  await db.delete(worldCupMatches)
  await db.delete(soccerTeams)
  await db.delete(worldCupGroups)
  
  console.log('Seeding tournament groups and teams...')

  for (const group of groupsData) {
    await db.insert(worldCupGroups).values({ id: group.id, name: group.name })

    // Insert teams
    for (const team of group.teams) {
      await db.insert(soccerTeams).values({ id: team.id, name: team.name, flag: team.flag, groupId: group.id })
    }
  }

  console.log('Seeding tournament matches...')
  await db.insert(worldCupMatches).values(matchesData)

  console.log('Seed completed successfully.')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
