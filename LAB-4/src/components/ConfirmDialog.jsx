import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useUI } from '../context/UIContext'

// Модальне вікно підтвердження. Відкривається поверх інших модалок (z-[55]) і не закриває їх.
export default function ConfirmDialog() {
  const { confirmState: c, closeConfirm } = useUI()
  useEffect(() => {
    if (!c) return
    // capture + stopImmediatePropagation: Esc закриває лише підтвердження, а не модалку під ним
    const onKey = e => { if (e.key === 'Escape') { e.stopImmediatePropagation(); closeConfirm() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [c, closeConfirm])
  if (!c) return null
  const ok = () => { closeConfirm(); c.onConfirm?.() }
  return (
    <div className="fixed inset-0 z-[55] grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={closeConfirm} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="relative w-full max-w-sm bg-white dark:bg-navy rounded-2xl shadow-2xl p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 grid place-items-center"><AlertTriangle size={22} /></div>
        <h2 id="confirm-title" className="text-lg font-bold mt-4">{c.title || 'Ви впевнені, що хочете видалити цей елемент?'}</h2>
        {c.text && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 break-words">{c.text}</p>}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button autoFocus onClick={closeConfirm} className="btn-ghost h-10 text-sm">Скасувати</button>
          <button onClick={ok} className="h-10 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors">{c.confirmLabel || 'Видалити'}</button>
        </div>
      </div>
    </div>
  )
}
