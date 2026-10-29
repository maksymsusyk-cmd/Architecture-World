import { Sparkles, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

export default function DataTools() {
  const { buildings, news, ratings, topics, seedAll, clearAll } = useData()
  const { toast } = useUI()
  const stats = [['Будівлі', buildings.length], ['Новини', news.length], ['Рейтинги', ratings.length], ['Теми', topics.length]]
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4">{stats.map(([l, n]) => (
        <div key={l} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 text-center"><div className="text-lg font-bold">{n}</div><div className="text-[11px] text-slate-500 dark:text-slate-400">{l}</div></div>))}</div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { if (!window.confirm('Поточний контент буде замінено демонстраційними даними. Продовжити?')) return; seedAll(); toast('Демонстраційні дані завантажено') }}
          className="btn-dark h-10 px-4 text-sm inline-flex items-center gap-2"><Sparkles size={14} />Завантажити демонстраційні дані</button>
        <button onClick={() => { if (!window.confirm('Видалити всі будівлі, новини, рейтинги, теми, відгуки та сповіщення? Акаунти збережуться.')) return; clearAll(); toast('Усі дані очищено', 'info') }}
          className="h-10 px-4 text-sm rounded-xl border border-rose-300 text-rose-600 font-semibold inline-flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-500/10"><Trash2 size={14} />Очистити всі дані</button>
      </div>
    </div>
  )
}
