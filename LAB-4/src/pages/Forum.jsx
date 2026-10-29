import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Pencil, MessageCircle, Eye, ArrowRight, Flame, ChevronDown, Gem, MessagesSquare } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import AdminActions from '../components/AdminActions'
import useAdminActions from '../hooks/useAdminActions'
import { activityTs, agoOf, lastActivity, replyCount, shortName, timeAgo } from '../utils'

export default function Forum() {
  const { topics, categories } = useData()
  const { currentUser, resolveAuthor } = useAuth()
  const { openModal, requireAuth } = useUI()
  const adm = useAdminActions()
  const [params] = useSearchParams()
  const [cat, setCat] = useState(null)
  const [filter, setFilter] = useState('Всі теми')
  const q = (params.get('q') || '').toLowerCase()

  const list = useMemo(() => {
    let l = topics.filter(t => (!cat || t.cat === cat) && (!q || `${t.title} ${t.text}`.toLowerCase().includes(q)))
    if (filter === 'Мої теми') l = l.filter(t => currentUser && t.authorId === currentUser.id)
    const by = { 'Популярні': (a, b) => b.views - a.views, 'Нові': (a, b) => (b.createdAt || 0) - (a.createdAt || 0) }[filter] || ((a, b) => activityTs(b) - activityTs(a))
    return [...l].sort(by)
  }, [topics, cat, filter, q, currentUser])
  const popular = [...topics].sort((a, b) => b.views - a.views).slice(0, 5)
  const recent = useMemo(() => {
    const ev = []
    topics.forEach(t => {
      if (t.createdAt) ev.push({ who: t.author, verb: 'створив(ла) тему', topic: t.title, ts: t.createdAt, img: t.avatar, id: t.id, authorId: t.authorId })
      t.replies.filter(r => r.createdAt).forEach(r => ev.push({ who: r.author, verb: 'відповів(ла) у темі', topic: t.title, ts: r.createdAt, img: r.avatar, id: t.id, authorId: r.authorId }))
    })
    ev.sort((a, b) => b.ts - a.ts)
    return ev.map(e => ({ ...e, time: timeAgo(e.ts) })).slice(0, 3)
  }, [topics])
  const c = categories.find(x => x.name === cat)
  const count = k => topics.filter(t => t.cat === k.name).length
  const create = () => requireAuth(() => openModal('topic', { category: cat || undefined }), 'Увійдіть, щоб створити тему')

  return (
    <main className="max-w-[1272px] mx-auto px-6 py-6">
      <div className="rounded-3xl bg-gradient-to-r from-[#D9EDE5] to-[#A6C0B9] dark:from-slate-800 dark:to-slate-700 px-10 py-9 flex items-center justify-between gap-6 flex-wrap">
        <div><h1 className="text-[32px] font-extrabold">Форум Architecture World</h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 max-w-xl">Обговорюйте, ставте запитання, діліться досвідом та отримуйте допомогу від спільноти архітекторів, студентів і професіоналів.</p></div>
        <button onClick={create} className="btn-dark h-11 px-6 text-sm flex items-center gap-2 shadow-md"><Pencil size={14} className="text-amber-400" />Створити тему</button>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr_320px] gap-6 mt-7 items-start">
        <aside className="card p-5">
          <h2 className="font-bold mb-4">Категорії форуму</h2>
          <div className="space-y-1">{categories.map(k => (
            <button key={k.name} onClick={() => setCat(cat === k.name ? null : k.name)} className={`w-full text-left rounded-xl p-3 flex gap-2 ${cat === k.name ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <span className="text-sm">{k.icon}</span>
              <span className="flex-1"><span className="block text-sm font-bold leading-4">{k.name}</span><span className="block text-[11px] text-slate-400 mt-1">{k.sub}</span></span>
              <span className="text-xs text-slate-400">{count(k)}</span></button>))}</div>
        </aside>

        <section className="space-y-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 grid place-items-center text-xl">{c ? c.icon : '💬'}</div>
            <div className="flex-1"><div className="font-bold">{c ? c.name : 'Усі категорії'}</div><div className="text-xs text-slate-400">{c ? c.sub : 'Питання, поради, обговорення'}</div></div>
            {cat && <button onClick={() => setCat(null)} className="link">Перейти до всіх тем <ArrowRight size={12} /></button>}</div>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {['Всі теми', 'Популярні', 'Нові', 'Мої теми'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`h-9 px-4 rounded-full ${filter === f ? 'bg-ink dark:bg-brand text-white font-semibold' : 'text-slate-600 dark:text-slate-300'}`}>{f}</button>))}
            <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">{filter === 'Популярні' ? 'За переглядами' : filter === 'Нові' ? 'За датою' : 'Останні відповіді'} <ChevronDown size={12} /></span></div>
          {topics.length === 0 && <EmptyState icon={MessagesSquare} title="Тем ще немає" text="Поки що немає жодної теми. Створіть перший запис і розпочніть обговорення!" action="Створити тему" onAction={create} />}
          {topics.length > 0 && list.length === 0 && <div className="card p-8 text-center text-sm text-slate-400">{filter === 'Мої теми' && !currentUser ? 'Увійдіть, щоб побачити свої теми' : 'Тем не знайдено'}</div>}
          {list.map(t => { const last = resolveAuthor(lastActivity(t)); const starter = resolveAuthor(t); return (
            <article key={t.id} onClick={() => openModal('topicView', { id: t.id })} className="card p-5 flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
              <img src={t.authorId ? starter.avatar : t.img} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div className="flex-1">
                <div className="flex justify-between gap-3"><h3 className="font-bold text-[15px]">{t.title}</h3>
                  <div className="flex items-center gap-2 shrink-0"><img src={last.avatar} className="w-6 h-6 rounded-full object-cover" alt="" /><div className="text-right"><div className="text-[11px] font-bold">{shortName(last.name)}</div><div className="text-[10px] text-slate-400">{agoOf(lastActivity(t))}</div></div></div></div>
                <div className="text-xs font-semibold text-brand mt-1">{t.cat}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-5 mt-2 max-w-[480px]">{t.text}</p>
                <div className="flex gap-4 text-[11px] text-slate-400 mt-3"><span className="flex items-center gap-1"><MessageCircle size={11} />{replyCount(t)} відповідей</span><span className="flex items-center gap-1"><Eye size={11} />{t.views} переглядів</span>
                  {adm.isAdmin && <AdminActions compact className="ml-auto -mt-1.5" onEdit={() => adm.editTopic(t)} onDelete={() => adm.removeTopic(t)} />}</div>
              </div></article>) })}
        </section>

        <aside className="space-y-6">
          <div className="card p-5">
            <div className="flex justify-between mb-3"><h2 className="font-bold text-sm flex items-center gap-1.5"><Flame size={14} className="text-orange-500" />Популярні теми</h2><button onClick={() => setFilter('Популярні')} className="link">Всі теми <ArrowRight size={12} /></button></div>
            {popular.length === 0 && <p className="text-xs text-slate-400 py-3">Популярних тем ще немає.</p>}
            {popular.map((t, i) => (
              <div key={t.id} onClick={() => openModal('topicView', { id: t.id })} className={`flex gap-3 py-3 cursor-pointer ${i ? 'border-t border-slate-100 dark:border-slate-700' : ''}`}>
                <span className="text-xs text-slate-400 font-bold w-3">{i + 1}</span>
                <div><div className="text-xs font-bold leading-5">{t.title}</div><div className="text-[10px] text-slate-400 mt-1">{t.views} переглядів • {replyCount(t)} відповідей</div></div></div>))}
          </div>
          <div className="rounded-2xl bg-navy text-white p-6 text-center shadow-md">
            <Gem className="mx-auto text-sky-400" size={30} />
            <h3 className="font-bold mt-3 leading-5">{currentUser ? <>Поділіться своїм<br />питанням зі спільнотою</> : <>Приєднуйся до спільноти<br />Architecture World</>}</h3>
            <p className="text-[11px] text-slate-300 mt-3">Обмінюйтеся досвідом, знаходьте однодумців та розвивайтеся разом!</p>
            {currentUser ? <button onClick={create} className="mt-4 w-full h-10 rounded-lg bg-ink dark:bg-brand text-sm font-semibold border border-white/10">Створити тему</button>
              : <Link to="/register" className="mt-4 block h-10 leading-10 rounded-lg bg-ink dark:bg-brand text-sm font-semibold border border-white/10">Зареєструватись</Link>}
          </div>
          <div className="card p-5">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-1.5"><MessageCircle size={14} />Останні повідомлення</h2>
            {recent.length === 0 && <p className="text-xs text-slate-400 py-1">Повідомлень ще немає.</p>}
            {recent.map((m, i) => { const who = m.authorId ? resolveAuthor({ authorId: m.authorId, author: m.who, avatar: m.img }) : { name: m.who, avatar: m.img }; return (
              <div key={i} className="flex gap-3 py-3"><img src={who.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-4"><b className="text-ink dark:text-slate-100">{shortName(who.name)}</b> {m.verb} <button onClick={() => openModal('topicView', { id: m.id })} className="text-brand text-left">{m.topic}</button><div className="text-slate-400 mt-1">{m.time}</div></div></div>) })}
          </div>
        </aside>
      </div>
    </main>
  )
}
