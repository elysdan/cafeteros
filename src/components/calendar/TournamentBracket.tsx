import { auth } from '@/lib/auth'
import { db } from '@/db'
import { worldCupMatches, userBrackets, users } from '@/db/schema'
import { eq, inArray } from 'drizzle-orm'
import BracketController from './BracketController'

const ROUND_ORDER = [
  '16avos de Final',
  'Octavos de Final',
  'Cuartos de Final',
  'Semifinales',
  'La Gran Final'
]

export default async function TournamentBracket() {
  const session = await auth()

  const groups = await db.query.worldCupGroups.findMany({
    with: { teams: true },
    orderBy: (groups, { asc }) => [asc(groups.id)]
  })

  const matches = await db.query.worldCupMatches.findMany({
    where: inArray(worldCupMatches.phase, ROUND_ORDER),
    with: {
      team1: true,
      team2: true,
    },
    orderBy: (matches, { asc }) => [asc(matches.date)],
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/New_York'
    }).format(date)
  }

  const formattedMatches = matches.map(m => ({
    id: m.id,
    team1: m.team1?.name || 'TBD',
    team2: m.team2?.name || 'TBD',
    date: formatDate(new Date(m.date)),
    location: `${m.venue}, ${m.city}`,
    phase: m.phase
  }))

  let userPredictions: Record<string, string> = {}
  if (session?.user?.id) {
    const bracket = await db.query.userBrackets.findFirst({
      where: eq(userBrackets.userId, session.user.id)
    })
    if (bracket && bracket.predictions) {
      userPredictions = bracket.predictions as Record<string, string>
    }
  }

  let micasinoPredictions: Record<string, string> = {}
  const micasinoUser = await db.query.users.findFirst({
    where: eq(users.role, 'MICASINO')
  })
  
  if (micasinoUser) {
    const micasinoBracket = await db.query.userBrackets.findFirst({
      where: eq(userBrackets.userId, micasinoUser.id)
    })
    if (micasinoBracket && micasinoBracket.predictions) {
      micasinoPredictions = micasinoBracket.predictions as Record<string, string>
    }
  }

  return (
    <BracketController 
      initialGroups={groups}
      initialMatches={formattedMatches}
      initialUserPredictions={userPredictions}
      micasinoPredictions={micasinoPredictions}
      isLoggedIn={!!session?.user?.id}
    />
  )
}
