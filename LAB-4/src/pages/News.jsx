import { useState } from 'react'
import { Plus, Newspaper } from 'lucide-react'
import { Img } from '../components/ui'
import EmptyState from '../components/EmptyState'
import { newsCategories } from '../data/mockData'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import AdminActions from '../components/AdminActions'
import useAdminActions from '../hooks/useAdminActions'
import { dateOf } from '../utils'

export default function News() {
  const { news } = useData()
  const { openModal, adminAdd, adminMode } = useUI()
  const [cat, setCat] = useState('Всі')
  const adm = useAdminActions()
  const sorted = [...news].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) // повний архів
  const list = cat === 'Всі' ? sorted : sorted.filter(n => n.cat === cat)
  return (
    <main className="max-w-[1232px] mx-auto px-6 py-7">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6"><h1 className="text-[30px] font-extrabold">Новини</h1>
        {adminMode && <button onClick={() => adminAdd('news')} className="btn-dark h-10 px-5 text-sm flex items-center gap-2"><Plus size={14} />Додати новину</button>}</div>
      {news.length === 0 ? <EmptyState icon={Newspaper} title="Новин поки немає" action="Створити першу новину" onAction={() => adminAdd('news')} /> : <>
        <div className="flex gap-2 flex-wrap mb-6">{['Всі', ...newsCategories].map(c => (
          <button key={c} onClick={() => setCat(c)} className={`h-9 px-4 rounded-full text-sm ${cat === c ? 'bg-ink dark:bg-brand text-white font-semibold' : 'bg-white text-slate-600 dark:text-slate-300'}`}>{c}</button>))}</div>
        {list.length === 0 && <div className="card p-10 text-center text-sm text-slate-400">У цій категорії ще немає новин</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map(n => (
            <article key={n.id} onClick={() => openModal('newsView', { id: n.id })} className="card overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <Img src={n.img} alt={n.title} className="w-full h-[150px]" />
              <div className="p-4"><div className="text-[11px] text-slate-400"><span className="font-semibold text-brand">{dateOf(n)}</span> • {n.cat}</div>
                <h3 className="text-sm font-bold mt-1.5 leading-5">{n.title}</h3><p className="text-xs text-slate-400 mt-1.5 leading-[18px]">{n.text}</p>
                {adm.isAdmin && <AdminActions compact className="mt-3" onEdit={() => adm.editNews(n)} onDelete={() => adm.removeNews(n)} />}</div>
            </article>))}
        </div></>}
    </main>
  )
}
