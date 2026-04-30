'use client'

import { useState } from 'react'
import { executeScraperAction } from './actions'
import { CalendarIcon, Link as LinkIcon, Save, Settings, RefreshCw, AlertCircle } from 'lucide-react'
import { ScraperOptions } from '@/lib/scraper/scraper'
import { SCRAPING_SOURCES } from '@/lib/scraper/config'

export default function ScraperAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
  
  // Form State
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customFormat, setCustomFormat] = useState('')
  const [customUrls, setCustomUrls] = useState('')
  
  // Sources state (all selected by default)
  const [selectedSources, setSelectedSources] = useState<string[]>(
    SCRAPING_SOURCES.map((s) => s.name)
  )

  const handleSourceToggle = (sourceName: string) => {
    setSelectedSources((prev) => 
      prev.includes(sourceName) 
        ? prev.filter((s) => s !== sourceName) 
        : [...prev, sourceName]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const urlsArray = customUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    const options: ScraperOptions = {
      selectedSources,
      customUrls: urlsArray,
    }

    if (startDate) options.startDate = new Date(startDate)
    if (endDate) options.endDate = new Date(endDate)
    if (customFormat) options.customDateFormat = customFormat

    try {
      const res = await executeScraperAction(options)
      setResult(res)
    } catch (error: any) {
      setResult({ success: false, error: error.message || 'Error desconocido' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Panel del Scraper</h1>
          <p className="text-gray-400">Configura y ejecuta la recolección automática de noticias</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rango de Fechas */}
          <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-white font-medium">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
              <h3>Filtros de Fecha</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Fecha de Inicio</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Fecha de Fin</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <label className="text-sm text-gray-400">Formato de Fecha Personalizado (Opcional)</label>
              </div>
              <input 
                type="text"
                placeholder="Ej. dd/MM/yyyy, MM/dd/yy"
                value={customFormat}
                onChange={(e) => setCustomFormat(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">
                Útil si la página usa formatos muy específicos. Si lo dejas vacío, se detectará automáticamente.
              </p>
            </div>
          </div>

          {/* Fuentes y URLs */}
          <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-white font-medium">
              <LinkIcon className="w-5 h-5 text-emerald-400" />
              <h3>Fuentes a Procesar</h3>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-400">Sitios Pre-configurados</label>
              <div className="flex flex-wrap gap-3">
                {SCRAPING_SOURCES.map((source) => (
                  <label key={source.name} className="flex items-center gap-2 cursor-pointer bg-black/30 hover:bg-black/50 px-3 py-2 rounded-lg border border-white/5 transition-colors">
                    <input 
                      type="checkbox"
                      checked={selectedSources.includes(source.name)}
                      onChange={() => handleSourceToggle(source.name)}
                      className="rounded bg-black border-white/20 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-white font-medium">{source.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-sm text-gray-400">URLs Específicas (Una por línea)</label>
              <textarea 
                placeholder="https://fcf.com.co/category/noticias/page/2&#10;https://fcf.com.co/2026/03/17/noticia-especifica"
                rows={4}
                value={customUrls}
                onChange={(e) => setCustomUrls(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all resize-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            {loading ? 'Procesando...' : 'Ejecutar Scraper'}
          </button>

          {/* Feedback Messages */}
          {result && (
            <div className={`flex items-start gap-3 p-4 rounded-xl w-full max-w-2xl animate-in slide-in-from-bottom-2 ${
              result.success 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {result.success ? (
                <RefreshCw className="w-5 h-5 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              )}
              <p className="font-medium">{result.success ? result.message : result.error}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
