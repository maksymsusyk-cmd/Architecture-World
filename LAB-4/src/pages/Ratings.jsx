import { Link, useSearchParams } from 'react-router-dom'
import { Trophy, Plus } from 'lucide-react'
import { Img, Rating } from '../components/ui'
import EmptyState from '../components/EmptyState'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

export default function Ratings() {
  const { ratings, buildings, ratingOf } = useData()
  const { adminAdd, adminMode } = useUI()
  const [params, setParams] = useSearchParams()
  const sel = ratings.find(r => r.id === params.get('r'))
  const items = sel ? sel.buildingIds.map(id => buildings.find(b => b.id === id)).filter(Boolean).map(b => ({ ...b, ...ratingOf(b) })).sort((a, b) => b.rating - a.rating) : []
  return (
    <main className="max-w-[1232px] mx-auto px-6 py-7">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6"><h1 className="text-[30px] font-extrabold">Рейтинги</h1>
        {adminMode && <button onClick={() => adminAdd('ratingForm')} className="btn-dark h-10 px-5 text-sm flex items-center gap-2"><Plus size={14} />Створити рейтинг</button>}</div>
      {ratings.length === 0 ? <EmptyState icon={Trophy} title="Рейтингів ще немає" action="Створити перший рейтинг" onAction={() => adminAdd('ratingForm')} /> : <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...ratings].sort((a, b) => b.createdAt - a.createdAt).map(r => (
            <button key={r.id} onClick={() => setParams(sel?.id === r.id ? {} : { r: r.id })} className={`card p-5 text-left hover:shadow-md transition-shadow ${sel?.id === r.id ? 'ring-2 ring-brand' : ''}`}>
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 grid place-items-center text-xl">{r.icon}</div>
              <div className="text-sm font-bold mt-4">{r.title}</div>
              {r.desc && <p className="text-xs text-slate-400 mt-1.5 leading-5">{r.desc}</p>}
              <div className="text-[11px] text-slate-400 mt-3">{r.buildingIds.length} об’єктів</div></button>))}
        </div>
        {sel && (
          <section className="card p-6 mt-8">
            <h2 className="font-bold text-lg flex items-center gap-2"><span>{sel.icon}</span>{sel.title}</h2>
            {items.length === 0 ? <p className="text-sm text-slate-400 mt-4">До цього рейтингу ще не прив’язано жодної будівлі.</p> :
              <ol className="mt-4 space-y-2">{items.map((b, i) => (
                <li key={b.id}><Link to={`/buildings/${b.id}`} className="flex items-center gap-4 rounded-xl p-3 bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <span className="w-7 text-center font-extrabold text-slate-400">{i + 1}</span>
                  <Img src={b.img} alt={b.name} className="w-16 h-12 rounded-lg" />
                  <div className="flex-1 min-w-0"><div className="text-sm font-bold truncate">{b.name}</div><div className="text-xs text-slate-400 truncate">{b.place}</div></div>
                  <Rating v={b.rating} /></Link></li>))}</ol>}
          </section>)}
      </>}
    </main>
  )
}
