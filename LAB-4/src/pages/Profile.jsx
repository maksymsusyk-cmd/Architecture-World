import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Calendar, Building2, MessageCircle, ArrowRight, Star, Bookmark } from 'lucide-react'
import { Img, Stars } from '../components/ui'
import { catStyleIndex, catStyles, coverChoices } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { agoOf, dateOf, fmtDate, replyCount } from '../utils'

const menu = [['Мій профіль', 0], ['Мої теми', 1], ['Мої коментарі', 2], ['Оцінені будівлі', 3], ['Збережені будівлі', 4], ['Налаштування', -2]]
const tabs = ['Активність', 'Мої теми', 'Мої коментарі', 'Оцінені будівлі', 'Збережені будівлі']
const labels = [['topics', 'Тем на форумі'], ['comments', 'Коментарі'], ['rated', 'Оцінені будівлі'], ['saved', 'Збережені будівлі']]
const Empty = ({ children }) => <p className="text-sm text-slate-400 py-6 text-center">{children}</p>

export default function Profile() {
  const { currentUser: u } = useAuth()
  const { topics, buildings, reviews, comments, categories, ratingOf } = useData()
  const { openModal } = useUI()
  const [tab, setTab] = useState(0)

  const mine = useMemo(() => {
    if (!u) return null
    const myTopics = topics.filter(t => t.authorId === u.id)
    const myReplies = topics.flatMap(t => t.replies.filter(r => r.authorId === u.id).map(r => ({ ...r, where: t.title, topicId: t.id })))
    const myCmts = buildings.flatMap(b => (comments[b.id] || []).filter(c => c.authorId === u.id).map(c => ({ ...c, where: b.name, to: `/buildings/${b.id}` })))
    const myRevs = buildings.flatMap(b => (reviews[b.id] || []).filter(r => r.authorId === u.id).map(r => ({ ...r, b })))
    return { myTopics, allComments: [...myReplies, ...myCmts].sort((a, b) => b.createdAt - a.createdAt), myRevs, savedB: buildings.filter(b => u.saved.includes(b.id)) }
  }, [u, topics, buildings, reviews, comments])

  if (!u) return (
    <main className="max-w-md mx-auto px-6 py-20"><div className="card p-8 text-center">
      <h1 className="text-xl font-bold">Потрібен вхід</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Увійдіть або створіть акаунт, щоб побачити свій профіль.</p>
      <div className="flex gap-3 mt-6"><button onClick={() => openModal('auth', { mode: 'login' })} className="btn-dark flex-1 h-10 text-sm">Увійти</button>
        <Link to="/register" className="flex-1 h-10 grid place-items-center text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-600">Реєстрація</Link></div></div></main>)

  const stats = { topics: mine.myTopics.length, comments: mine.allComments.length, rated: mine.myRevs.length, saved: mine.savedB.length }
  const popular = buildings.map(b => ({ ...b, ...ratingOf(b) })).sort((a, b) => b.rating - a.rating).slice(0, 3)
  const TopicRow = t => {
    const ci = catStyleIndex[t.cat] ?? 2
    return (
      <div key={t.id} onClick={() => openModal('topicView', { id: t.id })} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl px-3.5 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
        <div className={`w-9 h-9 rounded-full grid place-items-center text-sm ${catStyles[ci][0]}`}>{categories.find(c => c.name === t.cat)?.icon || '💬'}</div>
        <div className="flex-1"><div className="text-sm font-bold">{t.title}</div><span className={`text-[11px] rounded px-2 py-0.5 ${catStyles[ci][1]}`}>{t.cat}</span></div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1"><MessageCircle size={11} />{replyCount(t)} відповідей</span>
        <span className="text-[11px] text-slate-400 w-20 text-right">{agoOf(t)}</span></div>)
  }
  const topicList = (l, empty) => l.length ? <div className="space-y-3">{l.map(TopicRow)}</div> : <Empty>{empty}</Empty>
  const bTitle = ['Останні теми на форумі', 'Мої теми', 'Мої коментарі', 'Оцінені будівлі', 'Збережені будівлі'][tab]

  return (
    <main className="max-w-[1240px] mx-auto px-6 py-6 grid lg:grid-cols-[220px_1fr_280px] gap-5 items-start">
      <div className="space-y-5">
        <nav className="card p-2.5">{menu.map(([m, t]) => (
          <button key={m} onClick={() => (t === -2 ? openModal('settings') : setTab(t))} className={`w-full text-left text-sm rounded-lg px-3.5 py-2.5 ${t === tab ? 'bg-blue-50 dark:bg-blue-500/15 text-brand font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>{m}</button>))}</nav>
        <div className="card p-6 text-center"><Building2 className="mx-auto text-brand" size={20} />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-5">«Архітектура — це не просто будівлі, це спосіб бачити світ.»</p></div>
      </div>

      <div className="space-y-5">
        <div className="card overflow-hidden">
          <div className="relative h-[150px] bg-gradient-to-r from-slate-700 to-brand">
            <Img src={u.cover || coverChoices[0]} alt="Обкладинка профілю" className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /></div>
          <div className="p-6 pt-0">
          <div className="flex items-end justify-between"><img src={u.avatar} className="w-[92px] h-[92px] rounded-full object-cover -mt-12 ring-4 ring-white dark:ring-navy relative" alt="" />
            <button onClick={() => openModal('editProfile')} className="h-8 px-4 rounded-full border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 mt-3">Редагувати профіль</button></div>
          <h1 className="text-xl font-bold mt-3 flex items-center gap-2">{u.name}<BadgeCheck size={16} className="text-brand" /></h1>
          <div className="text-xs text-slate-400">{u.handle}</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{u.bio || 'Розкажіть про себе — натисніть «Редагувати профіль».'}</p>
          <div className="flex gap-5 text-xs text-slate-500 dark:text-slate-400 mt-3">{u.city && <span className="flex items-center gap-1"><MapPin size={12} className="text-red-500" />{u.city}</span>}<span className="flex items-center gap-1"><Calendar size={12} />Приєднався {fmtDate(u.joined)}</span></div>
          <div className="flex gap-9 border-t border-slate-100 dark:border-slate-700 mt-5 pt-4">{labels.map(([k, l]) => (<div key={k}><div className="font-bold">{stats[k]}</div><div className="text-[11px] text-slate-500 dark:text-slate-400">{l}</div></div>))}</div>
          </div>
        </div>
        <div className="card px-6 flex gap-7 text-sm overflow-x-auto">{tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`py-4 border-b-2 whitespace-nowrap ${tab === i ? 'text-brand font-semibold border-brand' : 'text-slate-600 dark:text-slate-300 border-transparent'}`}>{t}</button>))}</div>
        <div className="card p-6">
          <div className="flex justify-between mb-4"><h2 className="font-bold">{bTitle}</h2><Link to="/forum" className="link">Всі теми <ArrowRight size={12} /></Link></div>
          {tab === 0 && topicList(mine.myTopics.slice(0, 4), 'Ви ще не створили жодної теми. Почніть на форумі!')}
          {tab === 1 && topicList(mine.myTopics, 'У вас поки немає тем.')}
          {tab === 2 && (mine.allComments.length ? <div className="space-y-3">{mine.allComments.map(c => (
            <div key={c.id} onClick={() => c.topicId && openModal('topicView', { id: c.topicId })} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl px-4 py-3 cursor-pointer">
              <div className="text-sm text-slate-700 dark:text-slate-300">{c.text}</div><div className="text-[11px] text-slate-400 mt-1">{c.where} • {agoOf(c)} {c.to && <Link to={c.to} className="text-brand ml-2">Відкрити</Link>}</div></div>))}</div> : <Empty>Коментарів ще немає.</Empty>)}
          {tab === 3 && (mine.myRevs.length ? <div className="space-y-3">{mine.myRevs.map(r => (
            <Link key={r.id} to={`/buildings/${r.b.id}`} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3"><Img src={r.b.img} alt={r.b.name} className="w-14 h-12 rounded-lg" />
              <div className="flex-1"><div className="text-sm font-bold">{r.b.name}</div><div className="text-xs text-slate-400">{r.text || 'Без текстового відгуку'} • {dateOf(r)}</div></div><Stars n={r.rating} /></Link>))}</div> : <Empty>Ви ще не оцінили жодної будівлі.</Empty>)}
          {tab === 4 && (mine.savedB.length ? <div className="grid sm:grid-cols-2 gap-3">{mine.savedB.map(b => (
            <Link key={b.id} to={`/buildings/${b.id}`} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3"><Img src={b.img} alt={b.name} className="w-14 h-12 rounded-lg" /><div><div className="text-sm font-bold">{b.name}</div><div className="text-xs text-slate-400">{b.place}</div></div></Link>))}</div> : <Empty>Збережених будівель немає. Натисніть закладку на картці або сторінці будівлі.</Empty>)}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="card p-4"><div className="flex justify-between mb-3"><h2 className="font-bold text-sm">Статистика</h2><button onClick={() => setTab(0)} className="link">Детальніше <ArrowRight size={12} /></button></div>
          <div className="grid grid-cols-2 gap-2.5">{labels.map(([k, l]) => (<div key={k} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3"><div className="text-xl font-bold">{stats[k]}</div><div className="text-[11px] text-slate-500 dark:text-slate-400">{l}</div></div>))}</div></div>
        <div className="card p-4"><div className="flex justify-between mb-3"><h2 className="font-bold text-sm">Популярні будівлі</h2><Link to="/buildings" className="link">Всі <ArrowRight size={12} /></Link></div>
          {popular.length === 0 && <p className="text-[11px] text-slate-400">Будівель ще немає.</p>}
          {popular.map(b => (<Link key={b.id} to={`/buildings/${b.id}`} className="flex items-center gap-2.5 py-1.5"><Img src={b.img} alt={b.name} className="w-[50px] h-[40px] rounded-md" />
            <div className="flex-1"><div className="text-xs font-semibold">{b.name}</div><div className="text-[10px] text-slate-400">{b.place}</div></div>
            <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5"><Star size={10} className="fill-amber-500" />{b.rating || '—'}</span></Link>))}</div>
        <div className="card p-4"><div className="flex justify-between mb-3"><h2 className="font-bold text-sm">Збережені будівлі</h2><button onClick={() => setTab(4)} className="link">Всі <ArrowRight size={12} /></button></div>
          {mine.savedB.length === 0 && <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><Bookmark size={12} />Натисніть закладку на картці будівлі</p>}
          <div className="grid grid-cols-4 gap-1.5">{mine.savedB.slice(0, 4).map(b => <Link key={b.id} to={`/buildings/${b.id}`}><Img src={b.img} alt={b.name} className="w-full h-11 rounded-md" /></Link>)}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">У вас {stats.saved} збережених будівель</p></div>
      </aside>
    </main>
  )
}
