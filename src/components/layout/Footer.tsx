import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--yellow), var(--blue), var(--red))' }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl tracking-widest" style={{ color: 'var(--text-primary)' }}>
                COLOMBIA <span style={{ color: 'var(--yellow)' }}>2026</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              La plataforma de la comunidad colombiana para el Mundial 2026.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Secciones
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/noticias', label: 'Noticias' },
                { href: '/jugadores', label: 'Jugadores' },
                { href: '/calendario', label: 'Calendario' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Colores de la Tri
            </h3>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full" style={{ background: 'var(--yellow)' }} title="Amarillo" />
              <div className="w-8 h-8 rounded-full" style={{ background: 'var(--blue)' }} title="Azul" />
              <div className="w-8 h-8 rounded-full" style={{ background: 'var(--red)' }} title="Rojo" />
            </div>
          </div>
        </div>

        <div
          className="mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 Colombia 2026. Proyecto de la comunidad.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Hecho con 💛💙❤️ por colombianos
          </p>
        </div>
      </div>
    </footer>
  )
}
