import Link from 'next/link'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Hasta Pronto | Selección Colombia',
}

export default function VuelveProntoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[url('/bg-pattern.svg')] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden pt-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--yellow)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-lg mx-auto bg-black/40 border border-white/10 rounded-3xl p-10 backdrop-blur-md shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(255,204,0,0.4)]" style={{ background: 'linear-gradient(135deg, var(--yellow), var(--blue), var(--red))' }}>
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter" style={{ color: 'var(--yellow)' }}>
          ¡HASTA PRONTO!
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Has cerrado sesión correctamente. La tribuna siempre tendrá un lugar para ti en el próximo partido.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto"
          style={{ background: 'var(--yellow)', color: '#000' }}
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
