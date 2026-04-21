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
  // Jueves, 11 de junio 2026
  { team1Id: 'MEX', team2Id: 'RSA', date: new Date('2026-06-11T15:00:00-04:00'), venue: 'Estadio Ciudad de México', city: 'Ciudad de México', phase: 'Fase de Grupos · Grupo A' },
  { team1Id: 'KOR', team2Id: 'CZE', date: new Date('2026-06-11T22:00:00-04:00'), venue: 'Estadio Guadalajara', city: 'Guadalajara', phase: 'Fase de Grupos · Grupo A' },

  // Viernes, 12 de junio 2026
  { team1Id: 'CAN', team2Id: 'BIH', date: new Date('2026-06-12T15:00:00-04:00'), venue: 'Estadio Toronto', city: 'Toronto', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'USA', team2Id: 'PAR', date: new Date('2026-06-12T21:00:00-04:00'), venue: 'Estadio Los Ángeles', city: 'Los Ángeles', phase: 'Fase de Grupos · Grupo D' },

  // Sábado, 13 de junio 2026
  { team1Id: 'QAT', team2Id: 'SUI', date: new Date('2026-06-13T15:00:00-04:00'), venue: 'Estadio Bahía de San Francisco', city: 'San Francisco', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'BRA', team2Id: 'MAR', date: new Date('2026-06-13T18:00:00-04:00'), venue: 'Estadio Nueva York Nueva Jersey', city: 'Nueva York/NJ', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'HAI', team2Id: 'SCO', date: new Date('2026-06-13T21:00:00-04:00'), venue: 'Estadio Boston', city: 'Boston', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'AUS', team2Id: 'TUR', date: new Date('2026-06-14T00:00:00-04:00'), venue: 'Estadio BC Place', city: 'Vancouver', phase: 'Fase de Grupos · Grupo D' },

  // Domingo, 14 de junio 2026
  { team1Id: 'GER', team2Id: 'CUW', date: new Date('2026-06-14T13:00:00-04:00'), venue: 'Estadio Houston', city: 'Houston', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'NED', team2Id: 'JPN', date: new Date('2026-06-14T16:00:00-04:00'), venue: 'Estadio Dallas', city: 'Dallas', phase: 'Fase de Grupos · Grupo F' },
  { team1Id: 'CIV', team2Id: 'ECU', date: new Date('2026-06-14T19:00:00-04:00'), venue: 'Estadio Filadelfia', city: 'Filadelfia', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'SWE', team2Id: 'TUN', date: new Date('2026-06-14T22:00:00-04:00'), venue: 'Estadio Monterrey', city: 'Monterrey', phase: 'Fase de Grupos · Grupo F' },

  // Lunes, 15 de junio 2026
  { team1Id: 'ESP', team2Id: 'CPV', date: new Date('2026-06-15T12:00:00-04:00'), venue: 'Estadio Atlanta', city: 'Atlanta', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'BEL', team2Id: 'EGY', date: new Date('2026-06-15T15:00:00-04:00'), venue: 'Estadio Seattle', city: 'Seattle', phase: 'Fase de Grupos · Grupo G' },
  { team1Id: 'KSA', team2Id: 'URU', date: new Date('2026-06-15T18:00:00-04:00'), venue: 'Estadio Miami', city: 'Miami', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'IRN', team2Id: 'NZL', date: new Date('2026-06-15T21:00:00-04:00'), venue: 'Estadio Los Ángeles', city: 'Los Ángeles', phase: 'Fase de Grupos · Grupo G' },

  // Martes, 16 de junio 2026
  { team1Id: 'FRA', team2Id: 'SEN', date: new Date('2026-06-16T15:00:00-04:00'), venue: 'Estadio Nueva York Nueva Jersey', city: 'Nueva York/NJ', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'IRQ', team2Id: 'NOR', date: new Date('2026-06-16T18:00:00-04:00'), venue: 'Estadio Boston', city: 'Boston', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'ARG', team2Id: 'ALG', date: new Date('2026-06-16T21:00:00-04:00'), venue: 'Estadio Kansas City', city: 'Kansas City', phase: 'Fase de Grupos · Grupo J' },
  { team1Id: 'AUT', team2Id: 'JOR', date: new Date('2026-06-17T00:00:00-04:00'), venue: 'Estadio Bahía de San Francisco', city: 'San Francisco', phase: 'Fase de Grupos · Grupo J' },

  // Miércoles, 17 de junio 2026
  { team1Id: 'POR', team2Id: 'COD', date: new Date('2026-06-17T13:00:00-04:00'), venue: 'Estadio Houston', city: 'Houston', phase: 'Fase de Grupos · Grupo K' },
  { team1Id: 'ENG', team2Id: 'CRO', date: new Date('2026-06-17T16:00:00-04:00'), venue: 'Estadio Dallas', city: 'Dallas', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'GHA', team2Id: 'PAN', date: new Date('2026-06-17T19:00:00-04:00'), venue: 'Estadio Toronto', city: 'Toronto', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'UZB', team2Id: 'COL', date: new Date('2026-06-17T22:00:00-04:00'), venue: 'Estadio Ciudad de México', city: 'Ciudad de México', phase: 'Fase de Grupos · Grupo K' },

  // Jueves, 18 de junio 2026
  { team1Id: 'CZE', team2Id: 'RSA', date: new Date('2026-06-18T12:00:00-04:00'), venue: 'Estadio Atlanta', city: 'Atlanta', phase: 'Fase de Grupos · Grupo A' },
  { team1Id: 'SUI', team2Id: 'BIH', date: new Date('2026-06-18T15:00:00-04:00'), venue: 'Estadio Los Ángeles', city: 'Los Ángeles', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'CAN', team2Id: 'QAT', date: new Date('2026-06-18T18:00:00-04:00'), venue: 'Estadio BC Place', city: 'Vancouver', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'MEX', team2Id: 'KOR', date: new Date('2026-06-18T21:00:00-04:00'), venue: 'Estadio Guadalajara', city: 'Guadalajara', phase: 'Fase de Grupos · Grupo A' },

  // Viernes, 19 de junio 2026
  { team1Id: 'USA', team2Id: 'AUS', date: new Date('2026-06-19T15:00:00-04:00'), venue: 'Estadio Seattle', city: 'Seattle', phase: 'Fase de Grupos · Grupo D' },
  { team1Id: 'SCO', team2Id: 'MAR', date: new Date('2026-06-19T18:00:00-04:00'), venue: 'Estadio Boston', city: 'Boston', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'BRA', team2Id: 'HAI', date: new Date('2026-06-19T21:00:00-04:00'), venue: 'Estadio Filadelfia', city: 'Filadelfia', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'TUR', team2Id: 'PAR', date: new Date('2026-06-20T00:00:00-04:00'), venue: 'Estadio Bahía de San Francisco', city: 'San Francisco', phase: 'Fase de Grupos · Grupo D' },

  // Sábado, 20 de junio 2026
  { team1Id: 'NED', team2Id: 'SWE', date: new Date('2026-06-20T13:00:00-04:00'), venue: 'Estadio Houston', city: 'Houston', phase: 'Fase de Grupos · Grupo F' },
  { team1Id: 'GER', team2Id: 'CIV', date: new Date('2026-06-20T16:00:00-04:00'), venue: 'Estadio Toronto', city: 'Toronto', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'ECU', team2Id: 'CUW', date: new Date('2026-06-20T22:00:00-04:00'), venue: 'Estadio Kansas City', city: 'Kansas City', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'TUN', team2Id: 'JPN', date: new Date('2026-06-21T00:00:00-04:00'), venue: 'Estadio Monterrey', city: 'Monterrey', phase: 'Fase de Grupos · Grupo F' },

  // Domingo, 21 de junio 2026
  { team1Id: 'ESP', team2Id: 'KSA', date: new Date('2026-06-21T12:00:00-04:00'), venue: 'Estadio Atlanta', city: 'Atlanta', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'BEL', team2Id: 'IRN', date: new Date('2026-06-21T15:00:00-04:00'), venue: 'Estadio Los Ángeles', city: 'Los Ángeles', phase: 'Fase de Grupos · Grupo G' },
  { team1Id: 'URU', team2Id: 'CPV', date: new Date('2026-06-21T18:00:00-04:00'), venue: 'Estadio Miami', city: 'Miami', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'NZL', team2Id: 'EGY', date: new Date('2026-06-21T21:00:00-04:00'), venue: 'Estadio BC Place', city: 'Vancouver', phase: 'Fase de Grupos · Grupo G' },

  // Lunes, 22 de junio 2026
  { team1Id: 'ARG', team2Id: 'AUT', date: new Date('2026-06-22T13:00:00-04:00'), venue: 'Estadio Dallas', city: 'Dallas', phase: 'Fase de Grupos · Grupo J' },
  { team1Id: 'FRA', team2Id: 'IRQ', date: new Date('2026-06-22T17:00:00-04:00'), venue: 'Estadio Filadelfia', city: 'Filadelfia', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'NOR', team2Id: 'SEN', date: new Date('2026-06-22T20:00:00-04:00'), venue: 'Estadio Nueva York Nueva Jersey', city: 'Nueva York/NJ', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'JOR', team2Id: 'ALG', date: new Date('2026-06-22T23:00:00-04:00'), venue: 'Estadio Bahía de San Francisco', city: 'San Francisco', phase: 'Fase de Grupos · Grupo J' },

  // Martes, 23 de junio 2026
  { team1Id: 'POR', team2Id: 'UZB', date: new Date('2026-06-23T13:00:00-04:00'), venue: 'Estadio Houston', city: 'Houston', phase: 'Fase de Grupos · Grupo K' },
  { team1Id: 'ENG', team2Id: 'GHA', date: new Date('2026-06-23T16:00:00-04:00'), venue: 'Estadio Boston', city: 'Boston', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'PAN', team2Id: 'CRO', date: new Date('2026-06-23T19:00:00-04:00'), venue: 'Estadio Toronto', city: 'Toronto', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'COL', team2Id: 'COD', date: new Date('2026-06-23T22:00:00-04:00'), venue: 'Estadio Guadalajara', city: 'Guadalajara', phase: 'Fase de Grupos · Grupo K' },

  // Miércoles, 24 de junio 2026
  { team1Id: 'SUI', team2Id: 'CAN', date: new Date('2026-06-24T15:00:00-04:00'), venue: 'Estadio BC Place', city: 'Vancouver', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'BIH', team2Id: 'QAT', date: new Date('2026-06-24T15:00:00-04:00'), venue: 'Estadio Seattle', city: 'Seattle', phase: 'Fase de Grupos · Grupo B' },
  { team1Id: 'SCO', team2Id: 'BRA', date: new Date('2026-06-24T18:00:00-04:00'), venue: 'Estadio Miami', city: 'Miami', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'MAR', team2Id: 'HAI', date: new Date('2026-06-24T18:00:00-04:00'), venue: 'Estadio Atlanta', city: 'Atlanta', phase: 'Fase de Grupos · Grupo C' },
  { team1Id: 'CZE', team2Id: 'MEX', date: new Date('2026-06-24T21:00:00-04:00'), venue: 'Estadio Ciudad de México', city: 'Ciudad de México', phase: 'Fase de Grupos · Grupo A' },
  { team1Id: 'RSA', team2Id: 'KOR', date: new Date('2026-06-24T21:00:00-04:00'), venue: 'Estadio Monterrey', city: 'Monterrey', phase: 'Fase de Grupos · Grupo A' },

  // Jueves, 25 de junio 2026
  { team1Id: 'CUW', team2Id: 'CIV', date: new Date('2026-06-25T16:00:00-04:00'), venue: 'Estadio Filadelfia', city: 'Filadelfia', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'ECU', team2Id: 'GER', date: new Date('2026-06-25T16:00:00-04:00'), venue: 'Estadio Nueva York Nueva Jersey', city: 'Nueva York/NJ', phase: 'Fase de Grupos · Grupo E' },
  { team1Id: 'JPN', team2Id: 'SWE', date: new Date('2026-06-25T19:00:00-04:00'), venue: 'Estadio Dallas', city: 'Dallas', phase: 'Fase de Grupos · Grupo F' },
  { team1Id: 'TUN', team2Id: 'NED', date: new Date('2026-06-25T19:00:00-04:00'), venue: 'Estadio Kansas City', city: 'Kansas City', phase: 'Fase de Grupos · Grupo F' },
  { team1Id: 'TUR', team2Id: 'USA', date: new Date('2026-06-25T22:00:00-04:00'), venue: 'Estadio Los Ángeles', city: 'Los Ángeles', phase: 'Fase de Grupos · Grupo D' },
  { team1Id: 'PAR', team2Id: 'AUS', date: new Date('2026-06-25T22:00:00-04:00'), venue: 'Estadio Bahía de San Francisco', city: 'San Francisco', phase: 'Fase de Grupos · Grupo D' },

  // Viernes, 26 de junio 2026
  { team1Id: 'NOR', team2Id: 'FRA', date: new Date('2026-06-26T15:00:00-04:00'), venue: 'Estadio Boston', city: 'Boston', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'SEN', team2Id: 'IRQ', date: new Date('2026-06-26T15:00:00-04:00'), venue: 'Estadio Toronto', city: 'Toronto', phase: 'Fase de Grupos · Grupo I' },
  { team1Id: 'CPV', team2Id: 'KSA', date: new Date('2026-06-26T20:00:00-04:00'), venue: 'Estadio Houston', city: 'Houston', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'URU', team2Id: 'ESP', date: new Date('2026-06-26T20:00:00-04:00'), venue: 'Estadio Guadalajara', city: 'Guadalajara', phase: 'Fase de Grupos · Grupo H' },
  { team1Id: 'EGY', team2Id: 'IRN', date: new Date('2026-06-26T23:00:00-04:00'), venue: 'Estadio Seattle', city: 'Seattle', phase: 'Fase de Grupos · Grupo G' },
  { team1Id: 'NZL', team2Id: 'BEL', date: new Date('2026-06-26T23:00:00-04:00'), venue: 'Estadio BC Place', city: 'Vancouver', phase: 'Fase de Grupos · Grupo G' },

  // Sábado, 27 de junio 2026
  { team1Id: 'PAN', team2Id: 'ENG', date: new Date('2026-06-27T17:00:00-04:00'), venue: 'Estadio Nueva York Nueva Jersey', city: 'Nueva York/NJ', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'CRO', team2Id: 'GHA', date: new Date('2026-06-27T17:00:00-04:00'), venue: 'Estadio Filadelfia', city: 'Filadelfia', phase: 'Fase de Grupos · Grupo L' },
  { team1Id: 'COL', team2Id: 'POR', date: new Date('2026-06-27T19:30:00-04:00'), venue: 'Estadio Miami', city: 'Miami', phase: 'Fase de Grupos · Grupo K' },
  { team1Id: 'COD', team2Id: 'UZB', date: new Date('2026-06-27T19:30:00-04:00'), venue: 'Estadio Atlanta', city: 'Atlanta', phase: 'Fase de Grupos · Grupo K' },
  { team1Id: 'ALG', team2Id: 'AUT', date: new Date('2026-06-27T22:00:00-04:00'), venue: 'Estadio Kansas City', city: 'Kansas City', phase: 'Fase de Grupos · Grupo J' },
  { team1Id: 'JOR', team2Id: 'ARG', date: new Date('2026-06-27T22:00:00-04:00'), venue: 'Estadio Dallas', city: 'Dallas', phase: 'Fase de Grupos · Grupo J' },
]

export const ROUND_32_MATCHUPS = [
  { team1Id: '2A', team1Name: '2do Grupo A', team2Id: '2B', team2Name: '2do Grupo B', date: new Date('2026-06-28T15:00:00-04:00'), venue: 'SoFi Stadium', city: 'Los Ángeles' },
  { team1Id: '1A', team1Name: '1ro Grupo A', team2Id: '3C1', team2Name: '3ro C/E/F/H/I', date: new Date('2026-06-29T15:00:00-04:00'), venue: 'Gillette Stadium', city: 'Boston' },
  { team1Id: '1F', team1Name: '1ro Grupo F', team2Id: '3C2', team2Name: '3ro C/D/G/H/I', date: new Date('2026-06-29T18:00:00-04:00'), venue: 'Estadio BBVA', city: 'Monterrey' },
  { team1Id: '1C', team1Name: '1ro Grupo C', team2Id: '3C3', team2Name: '3ro A/B/D/E/F', date: new Date('2026-06-29T21:00:00-04:00'), venue: 'NRG Stadium', city: 'Houston' },
  { team1Id: '1I', team1Name: '1ro Grupo I', team2Id: '3C4', team2Name: '3ro A/B/F/G/H', date: new Date('2026-06-30T15:00:00-04:00'), venue: 'MetLife Stadium', city: 'Nueva York/NJ' },
  { team1Id: '2E', team1Name: '2do Grupo E', team2Id: '2I', team2Name: '2do Grupo I', date: new Date('2026-06-30T18:00:00-04:00'), venue: 'Estadio Azteca', city: 'Ciudad de México' },
  { team1Id: '1D', team1Name: '1ro Grupo D', team2Id: '3C5', team2Name: '3ro B/E/F/G/J', date: new Date('2026-06-30T21:00:00-04:00'), venue: 'AT&T Stadium', city: 'Dallas' },
  { team1Id: '1G', team1Name: '1ro Grupo G', team2Id: '3C6', team2Name: '3ro A/E/H/I/J', date: new Date('2026-07-01T15:00:00-04:00'), venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { team1Id: '1H', team1Name: '1ro Grupo H', team2Id: '3C7', team2Name: '3ro D/E/G/J/K', date: new Date('2026-07-01T18:00:00-04:00'), venue: "Levi's Stadium", city: 'San Francisco' },
  { team1Id: '1J', team1Name: '1ro Grupo J', team2Id: '3C8', team2Name: '3ro E/H/I/K/L', date: new Date('2026-07-01T21:00:00-04:00'), venue: 'Lumen Field', city: 'Seattle' },
  { team1Id: '2D', team1Name: '2do Grupo D', team2Id: '2G', team2Name: '2do Grupo G', date: new Date('2026-07-02T15:00:00-04:00'), venue: 'BMO Field', city: 'Toronto' },
  { team1Id: '1B', team1Name: '1ro Grupo B', team2Id: '3C9', team2Name: '3ro E/F/G/I/J', date: new Date('2026-07-02T18:00:00-04:00'), venue: 'SoFi Stadium', city: 'Los Ángeles' },
  { team1Id: '1E', team1Name: '1ro Grupo E', team2Id: '3C10', team2Name: '3ro A/B/C/D/F', date: new Date('2026-07-02T21:00:00-04:00'), venue: 'Hard Rock Stadium', city: 'Miami' },
  { team1Id: '1K', team1Name: '1ro Grupo K', team2Id: '3C11', team2Name: '3ro D/G/H/I/L', date: new Date('2026-07-03T15:00:00-04:00'), venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { team1Id: '2H', team1Name: '2do Grupo H', team2Id: '2J', team2Name: '2do Grupo J', date: new Date('2026-07-03T18:00:00-04:00'), venue: 'AT&T Stadium', city: 'Dallas' },
  { team1Id: '1L', team1Name: '1ro Grupo L', team2Id: '3C12', team2Name: '3ro F/H/I/J/K', date: new Date('2026-07-03T21:00:00-04:00'), venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
]

export const ROUND_16_MATCHUPS = [
  { team1Id: 'W1', team1Name: 'Ganador Llave 1', team2Id: 'W2', team2Name: 'Ganador Llave 2', date: new Date('2026-07-04T15:00:00-04:00'), venue: 'Lincoln Financial Field', city: 'Filadelfia' },
  { team1Id: 'W3', team1Name: 'Ganador Llave 3', team2Id: 'W4', team2Name: 'Ganador Llave 4', date: new Date('2026-07-04T18:00:00-04:00'), venue: 'NRG Stadium', city: 'Houston' },
  { team1Id: 'W5', team1Name: 'Ganador Llave 5', team2Id: 'W6', team2Name: 'Ganador Llave 6', date: new Date('2026-07-05T15:00:00-04:00'), venue: 'Estadio Azteca', city: 'Ciudad de México' },
  { team1Id: 'W7', team1Name: 'Ganador Llave 7', team2Id: 'W8', team2Name: 'Ganador Llave 8', date: new Date('2026-07-05T18:00:00-04:00'), venue: 'MetLife Stadium', city: 'Nueva York/NJ' },
  { team1Id: 'W9', team1Name: 'Ganador Llave 9', team2Id: 'W10', team2Name: 'Ganador Llave 10', date: new Date('2026-07-06T15:00:00-04:00'), venue: 'Lumen Field', city: 'Seattle' },
  { team1Id: 'W11', team1Name: 'Ganador Llave 11', team2Id: 'W12', team2Name: 'Ganador Llave 12', date: new Date('2026-07-06T18:00:00-04:00'), venue: 'AT&T Stadium', city: 'Dallas' },
  { team1Id: 'W13', team1Name: 'Ganador Llave 13', team2Id: 'W14', team2Name: 'Ganador Llave 14', date: new Date('2026-07-07T15:00:00-04:00'), venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { team1Id: 'W15', team1Name: 'Ganador Llave 15', team2Id: 'W16', team2Name: 'Ganador Llave 16', date: new Date('2026-07-07T18:00:00-04:00'), venue: 'BC Place', city: 'Vancouver' },
]

export const QUARTERS_MATCHUPS = [
  { team1Id: 'Q1', team1Name: 'Clasificado 1', team2Id: 'Q2', team2Name: 'Clasificado 2', date: new Date('2026-07-09T15:00:00-04:00'), venue: 'Gillette Stadium', city: 'Boston' },
  { team1Id: 'Q3', team1Name: 'Clasificado 3', team2Id: 'Q4', team2Name: 'Clasificado 4', date: new Date('2026-07-10T15:00:00-04:00'), venue: 'SoFi Stadium', city: 'Los Ángeles' },
  { team1Id: 'Q5', team1Name: 'Clasificado 5', team2Id: 'Q6', team2Name: 'Clasificado 6', date: new Date('2026-07-11T15:00:00-04:00'), venue: 'Hard Rock Stadium', city: 'Miami' },
  { team1Id: 'Q7', team1Name: 'Clasificado 7', team2Id: 'Q8', team2Name: 'Clasificado 8', date: new Date('2026-07-11T18:00:00-04:00'), venue: 'Arrowhead Stadium', city: 'Kansas City' },
]

export const SEMIS_MATCHUPS = [
  { team1Id: 'S1', team1Name: 'Semifinalista 1', team2Id: 'S2', team2Name: 'Semifinalista 2', date: new Date('2026-07-14T15:00:00-04:00'), venue: 'AT&T Stadium', city: 'Dallas' },
  { team1Id: 'S3', team1Name: 'Semifinalista 3', team2Id: 'S4', team2Name: 'Semifinalista 4', date: new Date('2026-07-15T15:00:00-04:00'), venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
]

export const FINAL_MATCHUPS = [
  { team1Id: 'F1', team1Name: 'Finalista 1', team2Id: 'F2', team2Name: 'Finalista 2', date: new Date('2026-07-19T15:00:00-04:00'), venue: 'MetLife Stadium', city: 'Nueva York/NJ' }
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

  console.log('Seeding knockout placeholder teams and matches...')
  
  const placeholders = new Map<string, { id: string, name: string, flag: string }>()
  
  const addPlaceholders = (matchups: any[], phase: string) => {
    const formattedMatches = []
    for (const m of matchups) {
      if (!placeholders.has(m.team1Id)) {
        placeholders.set(m.team1Id, { id: m.team1Id, name: m.team1Name, flag: '❓' })
      }
      if (!placeholders.has(m.team2Id)) {
        placeholders.set(m.team2Id, { id: m.team2Id, name: m.team2Name, flag: '❓' })
      }
      formattedMatches.push({
        team1Id: m.team1Id,
        team2Id: m.team2Id,
        date: m.date,
        venue: m.venue,
        city: m.city,
        phase: phase
      })
    }
    return formattedMatches
  }

  const allKnockoutMatches = [
    ...addPlaceholders(ROUND_32_MATCHUPS, '16avos de Final'),
    ...addPlaceholders(ROUND_16_MATCHUPS, 'Octavos de Final'),
    ...addPlaceholders(QUARTERS_MATCHUPS, 'Cuartos de Final'),
    ...addPlaceholders(SEMIS_MATCHUPS, 'Semifinales'),
    ...addPlaceholders(FINAL_MATCHUPS, 'La Gran Final')
  ]

  for (const [id, team] of placeholders) {
    // Avoid re-inserting if it already exists or handle potential unique constraints
    // For simplicity, we just insert all placeholders since we just cleared the db
    await db.insert(soccerTeams).values({ id: team.id, name: team.name, flag: team.flag })
  }

  await db.insert(worldCupMatches).values(allKnockoutMatches)

  console.log('Seed completed successfully.')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
