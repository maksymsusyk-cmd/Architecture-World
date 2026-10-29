import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, width = 'max-w-lg', children }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className={`fixed inset-0 z-50 grid place-items-center p-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={`relative w-full ${width} max-h-[90vh] overflow-y-auto bg-white dark:bg-navy rounded-2xl shadow-2xl p-6 transition-all duration-200 ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'}`}>
        <button onClick={onClose} aria-label="Закрити" className="absolute right-4 top-4 w-8 h-8 rounded-full grid place-items-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={16} /></button>
        {title && <h2 className="text-lg font-bold pr-8 mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
