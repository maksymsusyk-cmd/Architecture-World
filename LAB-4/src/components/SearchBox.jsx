import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Building2, Newspaper, MessageSquare } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { useOutside } from '../utils'

export default function SearchBox() {
  const { buildings, news, topics } = useData()
  const { openModal } = useUI()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  const inForum = pathname.startsWith('/forum')

  const res = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return null
    const m = (...f) => f.join(' ').toLowerCase().includes(s)
    return [
      { key: 'b', title: 'Будівлі', icon: Building2, items: buildings.filter(x => m(x.name, x.place, x.architect, x.style)).slice(0, 4).map(x => ({ id: x.id, label: x.name, sub: x.place, go: () => navigate(`/buildings/${x.id}`) })) },
      { key: 'n', title: 'Новини', icon: Newspaper, items: news.filter(x => m(x.title, x.text, x.cat)).slice(0, 4).map(x => ({ id: x.id, label: x.title, sub: x.cat, go: () => openModal('newsView', { id: x.id }) })) },
      { key: 't', title: 'Теми форуму', icon: MessageSquare, items: topics.filter(x => m(x.title, x.text, x.cat)).slice(0, 4).map(x => ({ id: x.id, label: x.title, sub: x.cat, go: () => openModal('topicView', { id: x.id }) })) }
    ]
  }, [q, buildings, news, topics, navigate, openModal])
  const total = res ? res.reduce((n, g) => n + g.items.length, 0) : 0
  const pick = it => { setOpen(false); setQ(''); it.go() }
  const submit = e => { e.preventDefault(); setOpen(false); navigate(`${inForum ? '/forum' : '/buildings'}?q=${encodeURIComponent(q.trim())}`) }

  return (
    <div ref={ref} className="relative hidden sm:block">
      <form onSubmit={submit} role="search"><Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} onKeyDown={e => e.key === 'Escape' && setOpen(false)}
          placeholder="Пошук будівель, новин, тем..." aria-label="Пошук"
          className="w-64 h-9 rounded-full bg-slate-100 dark:bg-slate-700 pl-9 pr-4 text-xs outline-none focus:ring-2 ring-blue-200" /></form>
      {open && res && (
        <div className="absolute right-0 mt-2 w-[360px] card shadow-xl border border-slate-100 dark:border-slate-700 p-2 max-h-[70vh] overflow-y-auto z-40">
          {total === 0 && <p className="text-xs text-slate-400 text-center py-6">Нічого не знайдено за «{q.trim()}»</p>}
          {res.filter(g => g.items.length).map(g => (
            <div key={g.key} className="mb-1">
              <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400"><g.icon size={12} />{g.title}</div>
              {g.items.map(it => (
                <button key={it.id} onClick={() => pick(it)} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm">
                  <span className="block font-semibold truncate">{it.label}</span><span className="block text-[11px] text-slate-400 truncate">{it.sub}</span></button>))}
            </div>))}
        </div>)}
    </div>
  )
}
