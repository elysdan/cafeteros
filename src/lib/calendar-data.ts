// Datos estáticos de la Selección Colombia para el Mundial 2026

export const COLOMBIA_GROUP = {
  group: 'K',
  teams: [
    { name: 'Uzbekistán', flag: '🇺🇿', qualified: true },
    { name: 'Colombia', flag: '🇨🇴', qualified: true },
    { name: 'RD Congo', flag: '🇨🇩', qualified: true },
    { name: 'Portugal', flag: '🇵🇹', qualified: true },
  ],
}

export interface WorldCupMatch {
  id: string
  opponent: string
  opponentFlag: string
  date: Date
  venue: string
  city: string
  country: string
  phase: string
  result?: { colombia: number; opponent: number }
  isNext?: boolean
}

export const COLOMBIA_MATCHES: WorldCupMatch[] = [
  {
    id: 'uzb-col-1',
    opponent: 'Uzbekistán',
    opponentFlag: '🇺🇿',
    date: new Date('2026-06-17T22:00:00-05:00'),
    venue: 'Mexico City Stadium',
    city: 'Ciudad de México',
    country: 'MEX',
    phase: 'First Stage · Group K',
  },
  {
    id: 'col-cod-2',
    opponent: 'RD Congo',
    opponentFlag: '🇨🇩',
    date: new Date('2026-06-23T22:00:00-05:00'),
    venue: 'Guadalajara Stadium',
    city: 'Guadalajara',
    country: 'MEX',
    phase: 'First Stage · Group K',
  },
  {
    id: 'col-por-3',
    opponent: 'Portugal',
    opponentFlag: '🇵🇹',
    date: new Date('2026-06-27T19:30:00-05:00'),
    venue: 'Miami Stadium',
    city: 'Miami',
    country: 'USA',
    phase: 'First Stage · Group K',
  },
]

// Primer partido de Colombia en el Mundial
export const FIRST_MATCH_DATE = COLOMBIA_MATCHES[0].date

// Inicio oficial
export const WORLD_CUP_START = new Date('2026-06-11T17:00:00-05:00')
