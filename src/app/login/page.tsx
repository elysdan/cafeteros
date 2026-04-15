'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const justRegistered = searchParams.get('registered') === 'true'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o contraseña incorrectos')
      return
    }

    router.push('/')
    router.refresh()
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
            BIENVENIDO DE VUELTA
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Success alert from registration */}
        {justRegistered && (
          <div
            className="flex items-center gap-2 p-4 rounded-lg mb-4"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">¡Cuenta creada! Ahora puedes iniciar sesión.</span>
          </div>
        )}

        {/* Form card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  id="login-email"
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  id="login-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Tu contraseña"
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
              id="login-submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--yellow)', color: '#000' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--yellow)' }}>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg-base)' }} />}>
      <LoginForm />
    </Suspense>
  )
}
