import { Bookmark } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export default function SaveButton({ building, variant = 'icon' }) {
  const { currentUser, toggleSaved } = useAuth()
  const { requireAuth, toast } = useUI()
  const saved = !!currentUser?.saved.includes(building.id)
  const click = e => {
    e.preventDefault(); e.stopPropagation()
    requireAuth(u => { const on = toggleSaved(building.id, u); toast(on ? 'Додано до збережених' : 'Видалено зі збережених', on ? 'success' : 'info') }, 'Увійдіть, щоб зберігати будівлі')
  }
  const icon = <Bookmark size={variant === 'icon' ? 15 : 14} className={saved ? 'fill-brand text-brand' : ''} />
  if (variant === 'pill') return (
    <button onClick={click} aria-pressed={saved} className={`h-9 px-4 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border ${saved ? 'border-brand text-brand bg-blue-50 dark:bg-blue-500/15' : 'border-slate-300 dark:border-slate-600'}`}>{icon}{saved ? 'Збережено' : 'Зберегти'}</button>)
  return (
    <button onClick={click} aria-pressed={saved} aria-label={saved ? 'Видалити зі збережених' : 'Зберегти'}
      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 grid place-items-center shadow hover:scale-105 transition-transform">{icon}</button>
  )
}
