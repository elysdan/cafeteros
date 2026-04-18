'use server'

import { db } from '@/db'
import { worldCupGroups, soccerTeams, worldCupMatches } from '@/db/schema'
import { eq, or } from 'drizzle-orm'

export async function fetchGroupsAndTeams() {
  const groups = await db.select().from(worldCupGroups)
  const teams = await db.select().from(soccerTeams)

  return {
    groups,
    teams
  }
}

export async function fetchSchedule(type: 'group' | 'team', id: string) {
  if (type === 'group') {
    // Escenario 1: Mostrar los equipos de un grupo y los partidos que involucren a esos equipos en ese grupo
    const group = await db.select().from(worldCupGroups).where(eq(worldCupGroups.id, id)).limit(1)
    if (!group[0]) return null
    
    const teams = await db.select().from(soccerTeams).where(eq(soccerTeams.groupId, id))
    const teamIds = teams.map(t => t.id)
    
    // Todos los partidos donde el team1 o el team2 forme parte de este grupo
    // En fase de grupos, ambos equipos suelen ser del mismo grupo.
    const matches = await db.select().from(worldCupMatches)
      .leftJoin(soccerTeams, eq(worldCupMatches.team2Id, soccerTeams.id)) // Join para traer info del rival
      .where(or(...teamIds.map(tId => eq(worldCupMatches.team1Id, tId)))) // Aquí podriamos reescribir con in() pero Drizzle es peculiar
      
    // Refinando la query para mejor lectura
    const allMatches = await db.query.worldCupMatches.findMany({
      with: {
        team1: true,
        team2: true
      }
    })

    const groupMatches = allMatches.filter(m => teamIds.includes(m.team1Id) && teamIds.includes(m.team2Id))

    return {
      type: 'group',
      entity: group[0],
      teams,
      matches: groupMatches
    }
  } else {
    // Escenario 2: Mostrar una selección en específico
    const team = await db.select().from(soccerTeams).where(eq(soccerTeams.id, id)).limit(1)
    if (!team[0]) return null
    
    const allMatches = await db.query.worldCupMatches.findMany({
      where: (matches, { eq, or }) => or(eq(matches.team1Id, id), eq(matches.team2Id, id)),
      with: {
        team1: true,
        team2: true
      }
    })

    return {
      type: 'team',
      entity: team[0],
      matches: allMatches
    }
  }
}
