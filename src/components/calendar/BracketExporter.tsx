'use client'

import { useState } from 'react'
import { FileImage, FileText, Loader2 } from 'lucide-react'
import { toPng, toJpeg, toCanvas } from 'html-to-image'
import jsPDF from 'jspdf'

export default function BracketExporter({ targetId }: { targetId: string }) {
  const [loadingType, setLoadingType] = useState<string | null>(null)

  const getElement = () => document.getElementById(targetId)

  const downloadImage = async (format: 'png' | 'jpeg') => {
    setLoadingType(format)
    try {
      const element = getElement()
      if (!element) return
      
      const config = {
        backgroundColor: '#0b1121', // Dark blue specific to the background
        pixelRatio: 2,
        skipFonts: true, // Bypass cross-origin 'cssRules' read attempts for Google Fonts
      }

      const dataUrl = await (format === 'png' ? toPng(element, config) : toJpeg(element, { ...config, quality: 0.9 }))
        
      const link = document.createElement('a')
      link.download = `esquema-mundial-2026.${format}`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error generando esquema: ', err)
    } finally {
      setLoadingType(null)
    }
  }

  const downloadPDF = async () => {
    setLoadingType('pdf')
    try {
      const element = getElement()
      if (!element) return
      
      const canvas = await toCanvas(element, { 
        backgroundColor: '#0b1121',
        pixelRatio: 2,
        skipFonts: true,
      })
      
      const imgData = canvas.toDataURL('image/png')
      // jsPDF format assumes 72 DPI, so dividing by pixel ratio ensures it fits standard page views visually nicely
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save('esquema-mundial-2026.pdf')
    } catch (err) {
      console.error('Error exportando PDF: ', err)
    } finally {
      setLoadingType(null)
    }
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold w-full text-center mb-1">
        Descargar Esquema
      </p>

      <button 
        onClick={() => downloadImage('png')}
        disabled={loadingType !== null}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-xs font-medium hover:border-[var(--yellow)] transition-colors disabled:opacity-50"
      >
        {loadingType === 'png' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4 text-blue-400" />}
        PNG
      </button>

      <button 
        onClick={() => downloadImage('jpeg')}
        disabled={loadingType !== null}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-xs font-medium hover:border-[var(--yellow)] transition-colors disabled:opacity-50"
      >
        {loadingType === 'jpeg' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4 text-green-400" />}
        JPEG
      </button>

      <button 
        onClick={downloadPDF}
        disabled={loadingType !== null}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-xs font-medium hover:border-[var(--yellow)] transition-colors disabled:opacity-50"
      >
        {loadingType === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-red-400" />}
        PDF
      </button>
    </div>
  )
}
