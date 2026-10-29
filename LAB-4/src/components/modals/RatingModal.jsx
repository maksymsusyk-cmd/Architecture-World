import { useState } from 'react'
import { Building2 } from 'lucide-react'
import Modal from '../Modal'
import { Img } from '../ui'
import { useData } from '../../context/DataContext'
import { useUI } from '../../context/UIContext'
import { ratingIcons } from '../../data/mockData'

export default function RatingModal({ open, onClose }) {
  const { buildings, addRating } = useData()
  const { toast, closeModal } = useUI()
  const [f, setF] = useState({ title: '', icon: ratingIcons[0], desc: '' })
  const [ids, setIds] = useState([])
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const toggle = id => setIds(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  const submit = e => {
    e.preventDefault()
    addRating({ title: f.title.trim(), icon: f.icon.trim() || ratingIcons[0], desc: f.desc.trim(), buildingIds: ids })
    toast('Рейтинг створено'); closeModal()
  }
  return (
    <Modal open={open} onClose={onClose} title="Створити рейтинг" width="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Назва категорії</label><input required maxLength={80} className="field" value={f.title} onChange={set('title')} placeholder="ТОП 10 сучасних будівель" /></div>
        <div><label className="label">Іконка</label>
          <div className="flex gap-1.5 flex-wrap items-center">{ratingIcons.map(i => (
            <button type="button" key={i} onClick={() => setF(s => ({ ...s, icon: i }))} className={`w-10 h-10 rounded-xl text-lg border-2 ${f.icon === i ? 'border-brand' : 'border-transparent bg-slate-100 dark:bg-slate-700'}`}>{i}</button>))}
            <input className="field !w-20 text-center" maxLength={4} value={f.icon} onChange={set('icon')} aria-label="Власна іконка" /></div></div>
        <div><label className="label">Опис</label><textarea rows={2} className="field resize-none" value={f.desc} onChange={set('desc')} /></div>
        <div><label className="label">Будівлі в рейтингу ({ids.length})</label>
          {buildings.length === 0 ? <p className="text-xs text-slate-400 flex items-center gap-2"><Building2 size={14} />Спочатку додайте будівлі до каталогу.</p> : (
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">{buildings.map(b => (
              <label key={b.id} className={`flex items-center gap-3 rounded-xl p-2 cursor-pointer border ${ids.includes(b.id) ? 'border-brand bg-blue-50 dark:bg-blue-500/15' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="checkbox" checked={ids.includes(b.id)} onChange={() => toggle(b.id)} className="accent-[#2563EB]" />
                <Img src={b.img} alt={b.name} className="w-12 h-9 rounded-md" /><span className="text-sm font-semibold flex-1 truncate">{b.name}</span><span className="text-[11px] text-slate-400">{b.place}</span></label>))}</div>)}</div>
        <button className="btn-dark w-full h-11 text-sm">Створити рейтинг</button>
      </form>
    </Modal>
  )
}
