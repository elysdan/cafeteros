'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Error al registrarse')
      return
    }

    router.push('/login?registered=true')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, var(--yellow), var(--blue), var(--red))' }}
          >
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--text-primary)' }}>
            ÚNETE A LA COMUNIDAD
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Crea tu cuenta para comentar y votar
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Nombre
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tucorreo@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-sm p-3 rounded-lg"
                style={{ background: 'var(--red-glow)', color: 'var(--red-light)', border: '1px solid var(--red)' }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--yellow)', color: '#000' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium transition-colors hover:opacity-80" style={{ color: 'var(--yellow)' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
