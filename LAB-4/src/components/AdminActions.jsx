import { Pencil, Trash2 } from 'lucide-react'

// Кнопки ✏️ «Редагувати» та 🗑️ «Видалити». Клік не «проходить» до батьківської картки.
export default function AdminActions({ onEdit, onDelete, compact = false, className = '' }) {
  const stop = fn => e => { e.preventDefault(); e.stopPropagation(); fn?.() }
  const size = compact ? 'h-7 px-2 text-[11px]' : 'h-8 px-3 text-xs'
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} onClick={e => e.stopPropagation()}>
      {onEdit && <button type="button" onClick={stop(onEdit)} className={`${size} rounded-lg inline-flex items-center gap-1.5 font-semibold bg-white/95 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700`}><Pencil size={12} />Редагувати</button>}
      {onDelete && <button type="button" onClick={stop(onDelete)} className={`${size} rounded-lg inline-flex items-center gap-1.5 font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20`}><Trash2 size={12} />Видалити</button>}
    </div>
  )
}

// Компактна іконка видалення (для відповідей, відгуків і коментарів)
export function DeleteIcon({ onClick, label = 'Видалити' }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={e => { e.preventDefault(); e.stopPropagation(); onClick?.() }}
      className="w-7 h-7 shrink-0 grid place-items-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"><Trash2 size={14} /></button>
  )
}
