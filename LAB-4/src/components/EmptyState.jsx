import { Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

export default function EmptyState({ icon: I, title, text = 'Поки що немає доданих об’єктів. Скористайтеся панеллю адміністратора або створіть перший запис!', action, onAction, demo = true, compact = false }) {
  const { seedAll } = useData()
  const { toast } = useUI()
  return (
    <div className={`card text-center ${compact ? 'p-6' : 'p-10'} border border-dashed border-slate-200 dark:border-slate-700`}>
      <div className={`mx-auto rounded-2xl bg-blue-50 dark:bg-blue-500/15 text-brand grid place-items-center ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}><I size={compact ? 22 : 30} /></div>
      {title && <h3 className="font-bold mt-4">{title}</h3>}
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-6">{text}</p>
      <div className="flex gap-2 justify-center flex-wrap mt-5">
        {action && <button onClick={onAction} className="btn-dark h-10 px-5 text-sm">{action}</button>}
        {demo && <button onClick={() => { seedAll(); toast('Демонстраційні дані завантажено') }} className="btn-ghost h-10 px-4 text-sm inline-flex items-center gap-1.5"><Sparkles size={14} />Демо-дані</button>}
      </div>
    </div>
  )
}
