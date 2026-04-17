import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import ProfileForm from './ProfileForm'
import { updateProfile } from './actions'

export const metadata = {
  title: 'Mi Perfil | Selección Colombia',
  description: 'Configura tu perfil para unirte a la hinchada',
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Obtenemos los datos frescos desde la base de datos
  const [userDb] = await db
    .select({
      name: users.name,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!userDb) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[url('/bg-pattern.svg')] text-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-lg" style={{ color: 'var(--yellow)' }}>
            MI PERFIL
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Sube de nivel tu presencia en la comunidad. Elige tu avatar y personaliza cómo te verán los demás hinchas.
          </p>
        </header>

        <ProfileForm 
          initialName={userDb.name}
          initialAvatar={userDb.avatarUrl}
          updateAction={updateProfile}
        />
        
      </div>
    </div>
  )
}
