'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[320px] max-w-[400px] relative overflow-hidden",
                t.type === 'error' && "bg-red-500/15 border-red-500/30 text-rose-200",
                t.type === 'success' && "bg-green-500/15 border-green-500/30 text-emerald-200",
                t.type === 'info' && "bg-[#0a0a0a]/80 border-white/10 text-white"
              )}
            >
              {/* Optional dynamic glows based on type */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none rounded-2xl blur-[20px]",
                t.type === 'error' && "bg-red-500",
                t.type === 'success' && "bg-green-500",
                t.type === 'info' && "bg-[var(--yellow)]"
              )} />

              <div className="relative z-10 shrink-0">
                {t.type === 'error' && <AlertCircle className="w-6 h-6 text-red-400" />}
                {t.type === 'success' && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                {t.type === 'info' && <Info className="w-6 h-6 text-[var(--yellow)]" />}
              </div>
              
              <span className="text-sm font-semibold leading-tight pr-6 relative z-10">{t.message}</span>
              
              <button 
                onClick={() => removeToast(t.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors z-10 cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
