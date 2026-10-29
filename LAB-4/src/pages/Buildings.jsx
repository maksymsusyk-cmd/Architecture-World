import { useSearchParams } from 'react-router-dom'
import { Building2, Plus } from 'lucide-react'
import BuildingCard from '../components/BuildingCard'
import EmptyState from '../components/EmptyState'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

export default function Buildings() {
  const { buildings } = useData()
  const { adminAdd, adminMode } = useUI()
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const list = buildings.filter(b => `${b.name} ${b.place} ${b.architect} ${b.style}`.toLowerCase().includes(q))
  return (
    <main className="max-w-[1232px] mx-auto px-6 py-7">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-[30px] font-extrabold">Будівлі{q && <span className="text-base font-medium text-slate-400"> — результати за «{params.get('q')}»</span>}</h1>
        {adminMode && <button onClick={() => adminAdd('building')} className="btn-dark h-10 px-5 text-sm flex items-center gap-2"><Plus size={14} />Додати будівлю</button>}</div>
      {buildings.length === 0 ? <EmptyState icon={Building2} title="Каталог порожній" action="Додати першу будівлю" onAction={() => adminAdd('building')} /> :
        list.length === 0 ? <div className="card p-10 text-center text-sm text-slate-400">Нічого не знайдено</div> :
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{list.map(b => <BuildingCard key={b.id} b={b} />)}</div>}
    </main>
  )
}
