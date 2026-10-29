import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapPin, User, Calendar, Building2, Star, ChevronLeft, ChevronRight, ThumbsUp, MessageCircle, ArrowRight } from 'lucide-react'
import { Img, Rating, Stars } from '../components/ui'
import EmptyState from '../components/EmptyState'
import SaveButton from '../components/SaveButton'
import AdminActions, { DeleteIcon } from '../components/AdminActions'
import useAdminActions from '../hooks/useAdminActions'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { agoOf, dateOf, shortName } from '../utils'

export default function Building() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { buildings, reviews, comments, ratingOf, addComment } = useData()
  const { currentUser, resolveAuthor } = useAuth()
  const { openModal, requireAuth, toast } = useUI()
  const adm = useAdminActions()
  const b = buildings.find(x => x.id === id)
  const [tab, setTab] = useState('Опис')
  const [idx, setIdx] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [text, setText] = useState('')
  useEffect(() => { setIdx(0); setTab('Опис'); setShowAll(false) }, [b?.id])
  if (!b) return (
    <main className="max-w-[1232px] mx-auto px-6 py-7"><EmptyState icon={Building2} title="Будівлю не знайдено" text="Можливо, її видалили або каталог ще порожній." action="До каталогу" onAction={() => navigate('/buildings')} /></main>)

  const { rating, votes } = ratingOf(b)
  const revs = reviews[b.id] || []
  const cmts = comments[b.id] || []
  const gallery = b.gallery?.length ? b.gallery : [b.img]
  const n = gallery.length
  const go = d => setIdx((idx + d + n) % n)
  const facts = [[MapPin, 'Місцезнаходження', b.place], [User, 'Архітектор', b.architect], [Calendar, 'Рік побудови', b.year], [Building2, 'Стиль', b.style]]
  const [lat, lon] = b.coords || []
  const sendComment = e => {
    e.preventDefault()
    if (!text.trim()) return
    requireAuth(u => { addComment(b.id, text.trim(), u); setText(''); toast('Коментар додано') }, 'Увійдіть, щоб залишити коментар')
  }
  const similar = buildings.filter(x => x.id !== b.id).slice(0, 4)
  return (
    <main className="max-w-[1232px] mx-auto px-6 py-7">
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"><Link to="/">Головна</Link>›<Link to="/buildings">Будівлі</Link>›<span className="text-ink dark:text-slate-100">{b.name}</span></div>
      <div className="flex items-start justify-between gap-4 mt-5 flex-wrap"><h1 className="text-[34px] font-extrabold">{b.name}</h1><SaveButton building={b} variant="pill" /></div>
      {adm.isAdmin && <AdminActions className="mt-3" onEdit={() => adm.editBuilding(b)} onDelete={() => adm.removeBuilding(b, () => navigate('/buildings'))} />}
      <p className="text-slate-500 dark:text-slate-400 mt-1">{b.subtitle}</p>
      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600 dark:text-slate-300 mt-4">
        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-red-500" />{b.place}</span>
        <span className="flex items-center gap-1.5"><User size={14} />Архітектор: {b.architect}</span>
        <span className="flex items-center gap-1.5"><Calendar size={14} />Рік побудови: {b.year}</span>
        <span className="flex items-center gap-1.5"><Building2 size={14} />Стиль: {b.style}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-6 items-start">
        <div className="space-y-6">
          <div className={`card p-3 grid gap-3 ${n > 1 ? 'md:grid-cols-[1.55fr_1fr]' : ''}`}>
            <div className="relative rounded-xl overflow-hidden h-[408px]">
              <Img src={gallery[idx]} alt={`${b.name} ${idx}`} className="w-full h-full" />
              <span className="absolute top-3 right-3 bg-black/60 text-white text-xs rounded-full px-2.5 py-1">{idx + 1}/{n}</span>
              {[[-1, ChevronLeft, 'left-3'], [1, ChevronRight, 'right-3']].map(([d, I, pos]) => (
                <button key={d} onClick={() => go(d)} aria-label={d < 0 ? 'Попереднє фото' : 'Наступне фото'} className={`absolute ${pos} top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 grid place-items-center`}><I size={16} /></button>))}
            </div>
            {n > 1 && <div className="grid grid-cols-2 gap-3 h-[408px]">
              {Array.from({ length: Math.min(4, n - 1) }, (_, k) => k + 1).map(k => { const i = (idx + k) % n; return (
                <button key={k} onClick={() => setIdx(i)} className="rounded-xl overflow-hidden"><Img src={gallery[i]} alt={`thumb ${i}`} className="w-full h-full" /></button>) })}
            </div>}
          </div>

          <div className="card p-6">
            <div className="flex gap-7 border-b border-slate-200 dark:border-slate-700 text-sm">
              {['Опис', 'Особливості', 'Відгуки'].map(t => (
                <button key={t} onClick={() => setTab(t)} className={`pb-3 -mb-px border-b-2 ${tab === t ? 'font-semibold border-ink dark:border-white' : 'text-brand border-transparent'}`}>{t}</button>))}
            </div>
            <h2 className="font-bold mt-6 mb-3">{tab}</h2>
            {tab === 'Опис' && (b.description || []).map(p => <p key={p} className="text-sm text-slate-600 dark:text-slate-300 leading-7 mb-3">{p}</p>)}
            {tab === 'Особливості' && <ul className="text-sm text-slate-600 dark:text-slate-300 leading-7 list-disc pl-5">{(b.features || []).map(f => <li key={f}>{f}</li>)}</ul>}
            {tab === 'Відгуки' && (revs.length ? revs.map(r => <div key={r.id} className="flex items-start gap-2 mb-2"><p className="flex-1 text-sm text-slate-600 dark:text-slate-300 leading-6"><b className="text-ink dark:text-slate-100">{shortName(resolveAuthor(r).name)}:</b> {r.text || '—'}</p>{adm.isAdmin && <DeleteIcon label="Видалити відгук" onClick={() => adm.removeReview(b, r)} />}</div>) : <p className="text-sm text-slate-400">Відгуків ще немає — оцініть першим.</p>)}
            <div className="flex flex-wrap gap-2 mt-4">{(b.tags || []).map(t => <span key={t} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg px-3 py-1.5">{t}</span>)}</div>
          </div>

          {similar.length > 0 && <section><div className="flex justify-between mb-3"><h2 className="font-bold text-lg">Схожі будівлі</h2><Link to="/buildings" className="link">Всі <ArrowRight size={12} /></Link></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map(s => (
                <Link key={s.id} to={`/buildings/${s.id}`} className="card overflow-hidden"><Img src={s.img} alt={s.name} className="w-full h-[100px]" />
                  <div className="p-3"><div className="text-xs font-bold truncate">{s.name}</div>
                    <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-slate-400 truncate">{s.place}</span><Rating v={ratingOf(s).rating} className="!text-[10px]" /></div></div></Link>))}
            </div></section>}

          <section className="card p-6">
            <h2 className="font-bold text-lg mb-4">Коментарі ({cmts.length})</h2>
            <form onSubmit={sendComment} className="flex gap-3">
              {currentUser ? <img src={currentUser.avatar} className="w-10 h-10 rounded-full object-cover" alt="" /> : <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600" />}
              <input className="field flex-1" value={text} onChange={e => setText(e.target.value)} placeholder="Напишіть коментар..." />
              <button className="btn-dark px-5 text-sm">Відправити</button></form>
            <div className="mt-5 space-y-4">
              {cmts.length === 0 && <p className="text-sm text-slate-400">Коментарів ще немає.</p>}
              {cmts.map(c => { const a = resolveAuthor(c); return (
                <div key={c.id} className="flex gap-3"><img src={a.avatar} className="w-9 h-9 rounded-full object-cover" alt="" />
                  <div className="flex-1 min-w-0"><div className="text-xs"><b>{a.name}</b> <span className="text-slate-400">{agoOf(c)}</span></div><p className="text-sm text-slate-600 dark:text-slate-300 mt-1 break-words">{c.text}</p></div>
                  {adm.isAdmin && <DeleteIcon label="Видалити коментар" onClick={() => adm.removeComment(b, c)} />}</div>) })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1"><Star size={11} />Рейтинг</span>
              <SaveButton building={b} variant="pill" /></div>
            <div className="flex items-end justify-between mt-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div><div className="flex items-baseline gap-2"><span className="text-4xl font-extrabold">{rating || '—'}</span><span className="text-xs text-slate-400">({votes} оцінок)</span></div><Stars /></div>
              <button onClick={() => requireAuth(() => openModal('rate', { building: b }), 'Увійдіть, щоб оцінити будівлю')} className="btn-dark h-8 px-4 text-xs">Оцінити</button></div>
            <dl className="mt-4 space-y-3">{facts.map(([I, l, v]) => (
              <div key={l} className="flex gap-2"><I size={13} className="mt-0.5 text-slate-500 dark:text-slate-400" /><div><dt className="text-xs text-slate-500 dark:text-slate-400">{l}</dt><dd className="text-xs font-bold">{v}</dd></div></div>))}</dl>
            {b.coords && (<div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <iframe title="map" className="w-full h-[120px] border-0" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.015}%2C${lat - 0.01}%2C${lon + 0.015}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`} />
              <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`} target="_blank" rel="noreferrer" className="link w-full justify-end p-2">Відкрити на карті <ArrowRight size={12} /></a></div>)}
          </div>

          <div className="card p-5">
            <div className="flex justify-between mb-4"><h2 className="font-bold text-sm">Відгуки користувачів</h2>
              {revs.length > 3 && <button onClick={() => setShowAll(!showAll)} className="link">{showAll ? 'Менше' : 'Всі відгуки'} <ArrowRight size={12} /></button>}</div>
            {revs.length === 0 && <p className="text-xs text-slate-400">Відгуків ще немає.</p>}
            {(showAll ? revs : revs.slice(0, 3)).map((r, i) => { const a = resolveAuthor(r); return (
              <div key={r.id} className={`py-4 ${i ? 'border-t border-slate-100 dark:border-slate-700' : 'pt-0'}`}>
                <div className="flex items-center gap-2"><img src={a.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                  <div className="flex-1"><div className="text-xs font-bold">{shortName(a.name)}</div><div className="text-[10px] text-slate-400">{dateOf(r)}</div></div><Stars n={r.rating} size={9} />{adm.isAdmin && <DeleteIcon label="Видалити відгук" onClick={() => adm.removeReview(b, r)} />}</div>
                {r.text && <p className="text-xs text-slate-600 dark:text-slate-300 leading-5 mt-2">{r.text}</p>}
                <div className="flex gap-3 text-[11px] text-slate-400 mt-2"><span className="flex items-center gap-1"><ThumbsUp size={11} className="text-amber-500" />{r.likes || 0}</span><span className="flex items-center gap-1"><MessageCircle size={11} />{r.comments || 0}</span></div>
              </div>) })}
          </div>
        </aside>
      </div>
    </main>
  )
}
