'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'No autorizado' }
  }

  const name = formData.get('name') as string
  const avatarUrl = formData.get('avatarUrl') as string

  if (!name || name.trim().length === 0) {
    return { error: 'El nombre es obligatorio' }
  }

  try {
    await db
      .update(users)
      .set({
        name: name.trim(),
        avatarUrl: avatarUrl ? avatarUrl : null,
      })
      .where(eq(users.id, session.user.id))

    revalidatePath('/perfil')
    return { success: 'Perfil actualizado exitosamente' }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { error: 'Hubo un error al actualizar tu perfil' }
  }
}
