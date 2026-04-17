'use client'

import { useState } from 'react'
import Image from 'next/image'
import { User, CheckCircle2 } from 'lucide-react'

export default function ProfileForm({
  initialName,
  initialAvatar,
  updateAction,
}: {
  initialName: string
  initialAvatar: string | null
  updateAction: (formData: FormData) => Promise<{ error?: string; success?: string }>
}) {
  const [name, setName] = useState(initialName)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const avatars = [
    '/cartoons/cartoon_james_rodriguez_1.webp',
    '/cartoons/cartoon_james_rodriguez_gol.png',
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('avatarUrl', avatarUrl)

    try {
      const result = await updateAction(formData)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else if (result.success) {
        setMessage({ type: 'success', text: result.success })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error inesperado al actualizar el perfil' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md">
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--yellow)]/10 rounded-full blur-[80px] pointer-events-none" />

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
          {message.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Name section */}
      <div className="space-y-3">
        <label htmlFor="name" className="block text-sm font-bold text-white/80">
          Tu Nombre
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--yellow)] focus:ring-1 focus:ring-[var(--yellow)] transition-colors"
            placeholder="Escribe tu nombre visible"
            required
          />
        </div>
      </div>

      {/* Avatars section */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-white/80">
          Elige tu Avatar de la Selección
        </label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {avatars.map((url, i) => {
            const isSelected = avatarUrl === url
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAvatarUrl(url)}
                className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-200 border-2 ${isSelected ? 'border-[var(--yellow)] scale-105 shadow-[0_0_20px_rgba(255,204,0,0.3)]' : 'border-white/10 hover:border-white/30 hover:scale-105'}`}
              >
                <Image
                  src={url}
                  alt={`Avatar ${i + 1}`}
                  fill
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-[var(--yellow)]/20 flex items-center justify-center">
                     <div className="bg-[var(--yellow)] text-black rounded-full p-1 shadow-lg">
                       <CheckCircle2 className="w-5 h-5" />
                     </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-400">
           Puedes seleccionar uno de nuestros avatares exclusivos o dejarlo vacío.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        style={{ background: 'var(--yellow)', color: '#000' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Guardando...
          </>
        ) : (
          'Guardar Cambios'
        )}
      </button>

    </form>
  )
}
