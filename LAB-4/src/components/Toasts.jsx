import { CheckCircle2, Info } from 'lucide-react'
import { useUI } from '../context/UIContext'

export default function Toasts() {
  const { toasts } = useUI()
  return (
    <div className="fixed top-20 right-5 z-[60] space-y-2" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className="toast flex items-center gap-2.5 bg-ink dark:bg-brand text-white text-sm rounded-xl px-4 py-3 shadow-lg max-w-sm">
          {t.type === 'info' ? <Info size={16} className="text-sky-400 shrink-0" /> : <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}{t.message}
        </div>))}
    </div>
  )
}
