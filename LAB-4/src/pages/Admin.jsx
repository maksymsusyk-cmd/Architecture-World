import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Newspaper, Trophy, Database, Plus, Shield, MessagesSquare, ShieldAlert, Search, Eye, MessageCircle, Star } from 'lucide-react'
import { Img } from '../components/ui'
import AdminActions, { DeleteIcon } from '../components/AdminActions'
import DataTools from '../components/DataTools'
import useAdminActions from '../hooks/useAdminActions'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { useAuth } from '../context/AuthContext'
import { agoOf, dateOf, replyCount, shortName } from '../utils'

const tabs = [['forum', 'Форум', MessagesSquare], ['news', 'Новини', Newspaper], ['buildings', 'Будівлі', Building2], ['moderation', 'Модерація коментарів', ShieldAlert], ['ratings', 'Рейтинги', Trophy], ['data', 'Дані', Database]]
const MOD_PAGE = 30

const SearchField = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1 min-w-[180px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input className="field pl-9" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></div>
)

const Row = ({ img, icon, title, sub, to, onClick, children }) => (
  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
    {img ? <Img src={img} alt={title} className="w-14 h-11 rounded-lg shrink-0" /> : <div className="w-14 h-11 rounded-lg bg-slate-200 dark:bg-slate-600 grid place-items-center text-xl shrink-0">{icon}</div>}
    <div className="flex-1 min-w-0">
      {to ? <Link to={to} className="text-sm font-bold truncate block hover:underline">{title}</Link>
        : onClick ? <button onClick={onClick} className="text-sm font-bold truncate block max-w-full text-left hover:underline">{title}</button>
        : <div className="text-sm font-bold truncate">{title}</div>}
      <div className="text-xs text-slate-400 truncate">{sub}</div></div>
    <div className="shrink-0 flex items-center gap-1">{children}</div>
  </div>
)

const Section = ({ title, addLabel, onAdd, toolbar, children, empty, emptyText }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-4 gap-3 flex-wrap"><h2 className="font-bold">{title}</h2>
      {onAdd && <button onClick={onAdd} className="btn-dark h-9 px-4 text-xs flex items-center gap-1.5"><Plus size={13} />{addLabel}</button>}</div>
    {toolbar}
    {empty ? <p className="text-sm text-slate-400 py-6 text-center">{emptyText || 'Поки що немає доданих об’єктів. Створіть перший запис!'}</p> : <div className="space-y-2.5">{children}</div>}
  </div>
)

export default function Admin() {
  const { currentUser, resolveAuthor } = useAuth()
  const { adminMode, setAdminMode, openModal, isAdmin } = useUI()
  const { buildings, news, ratings, topics, reviews, comments, categories } = useData()
  const adm = useAdminActions()
  const [tab, setTab] = useState('forum')
  const [fq, setFq] = useState(''); const [fcat, setFcat] = useState('')
  const [nq, setNq] = useState(''); const [ncat, setNcat] = useState('')
  const [bq, setBq] = useState('')
  const [mq, setMq] = useState(''); const [mkind, setMkind] = useState('all'); const [mshown, setMshown] = useState(MOD_PAGE)

  const forumList = useMemo(() => topics
    .filter(t => (!fcat || t.cat === fcat) && (!fq || `${t.title} ${t.text} ${t.author}`.toLowerCase().includes(fq.toLowerCase())))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [topics, fq, fcat])
  const newsCats = useMemo(() => [...new Set(news.map(n => n.cat).filter(Boolean))], [news])
  const newsList = useMemo(() => news
    .filter(n => (!ncat || n.cat === ncat) && (!nq || `${n.title} ${n.text}`.toLowerCase().includes(nq.toLowerCase())))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [news, nq, ncat])
  const buildList = useMemo(() => buildings.filter(b => !bq || `${b.name} ${b.place} ${b.architect}`.toLowerCase().includes(bq.toLowerCase())), [buildings, bq])
  // Єдина стрічка відгуків і коментарів, найновіші — першими
  const feed = useMemo(() => {
    const byId = Object.fromEntries(buildings.map(b => [b.id, b]))
    const items = []
    Object.entries(reviews).forEach(([bid, l]) => byId[bid] && l.forEach(r => items.push({ kind: 'review', b: byId[bid], item: r })))
    Object.entries(comments).forEach(([bid, l]) => byId[bid] && l.forEach(c => items.push({ kind: 'comment', b: byId[bid], item: c })))
    const q = mq.toLowerCase()
    return items
      .filter(x => (mkind === 'all' || x.kind === mkind) && (!q || `${x.item.text || ''} ${x.item.author} ${x.b.name}`.toLowerCase().includes(q)))
      .sort((a, b) => (b.item.createdAt || 0) - (a.item.createdAt || 0))
  }, [reviews, comments, buildings, mq, mkind])

  if (!currentUser) return (
    <main className="max-w-md mx-auto px-6 py-20"><div className="card p-8 text-center"><Shield className="mx-auto text-brand" />
      <h1 className="text-xl font-bold mt-3">Потрібен вхід</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Увійдіть, щоб відкрити панель адміністратора.</p>
      <button onClick={() => openModal('auth', { mode: 'login' })} className="btn-dark w-full h-10 text-sm mt-6">Увійти</button></div></main>)
  if (!isAdmin) return (
    <main className="max-w-md mx-auto px-6 py-20"><div className="card p-8 text-center"><Shield className="mx-auto text-brand" />
      <h1 className="text-xl font-bold mt-3">Режим адміністратора вимкнено</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Увімкніть його, щоб керувати форумом, новинами, будівлями та коментарями.</p>
      <button onClick={() => setAdminMode(true)} className="btn-dark w-full h-10 text-sm mt-6">Увімкнути режим адміністратора</button></div></main>)

  const sel = (value, set, opts, all) => (
    <select className="field sm:max-w-[220px]" value={value} onChange={e => set(e.target.value)} aria-label="Категорія"><option value="">{all}</option>{opts.map(o => <option key={o}>{o}</option>)}</select>)
  const toolbar = (...c) => <div className="flex gap-3 flex-wrap mb-4">{c}</div>
  const count = (n, total) => (n === total ? `${total}` : `${n} з ${total}`)

  return (
    <main className="max-w-[1000px] mx-auto px-6 py-7">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-[30px] font-extrabold flex items-center gap-3"><Shield className="text-brand" />Адмін-панель</h1>
        {adminMode && <button onClick={() => setAdminMode(false)} className="btn-ghost h-9 px-4 text-xs">Вимкнути режим адміністратора</button>}</div>
      <div className="flex gap-2 flex-wrap mb-6">{tabs.map(([k, l, I]) => (
        <button key={k} onClick={() => setTab(k)} className={`h-10 px-4 rounded-full text-sm inline-flex items-center gap-2 ${tab === k ? 'bg-ink dark:bg-brand text-white font-semibold' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><I size={14} />{l}</button>))}</div>

      {tab === 'forum' && <Section title={`Теми форуму (${count(forumList.length, topics.length)})`} addLabel="Створити тему" onAdd={() => openModal('topic')} empty={!forumList.length}
        emptyText={topics.length ? 'Нічого не знайдено за вашим запитом' : undefined}
        toolbar={toolbar(<SearchField key="s" value={fq} onChange={setFq} placeholder="Пошук за назвою, текстом або автором" />, <span key="c">{sel(fcat, setFcat, categories.map(c => c.name), 'Усі категорії')}</span>)}>
        {forumList.map(t => (
          <Row key={t.id} icon="💬" title={t.title} onClick={() => openModal('topicView', { id: t.id })}
            sub={<span className="inline-flex items-center gap-2 flex-wrap"><span className="text-brand font-semibold">{t.cat}</span>•<span>{shortName(resolveAuthor(t).name)}</span>•<span>{agoOf(t)}</span>•<Eye size={11} />{t.views}•<MessageCircle size={11} />{replyCount(t)}</span>}>
            <AdminActions compact onEdit={() => adm.editTopic(t)} onDelete={() => adm.removeTopic(t)} /></Row>))}
        <p className="text-[11px] text-slate-400 pt-1">Клік на назву відкриває тему — там біля кожної відповіді є іконка видалення.</p>
      </Section>}

      {tab === 'news' && <Section title={`Новини (${count(newsList.length, news.length)})`} addLabel="Створити новину" onAdd={() => openModal('news')} empty={!newsList.length}
        emptyText={news.length ? 'Нічого не знайдено за вашим запитом' : undefined}
        toolbar={toolbar(<SearchField key="s" value={nq} onChange={setNq} placeholder="Пошук новин" />, <span key="c">{sel(ncat, setNcat, newsCats, 'Усі категорії')}</span>)}>
        {newsList.map(n => (
          <Row key={n.id} img={n.img} title={n.title} onClick={() => openModal('newsView', { id: n.id })} sub={`${dateOf(n)} • ${n.cat}`}>
            <AdminActions compact onEdit={() => adm.editNews(n)} onDelete={() => adm.removeNews(n)} /></Row>))}
      </Section>}

      {tab === 'buildings' && <Section title={`Будівлі (${count(buildList.length, buildings.length)})`} addLabel="Додати будівлю" onAdd={() => openModal('building')} empty={!buildList.length}
        emptyText={buildings.length ? 'Нічого не знайдено за вашим запитом' : undefined}
        toolbar={toolbar(<SearchField key="s" value={bq} onChange={setBq} placeholder="Пошук за назвою, містом або архітектором" />)}>
        {buildList.map(b => (
          <Row key={b.id} img={b.img} title={b.name} to={`/buildings/${b.id}`} sub={`${b.place} • ${b.architect}, ${b.year}`}>
            <AdminActions compact onEdit={() => adm.editBuilding(b)} onDelete={() => adm.removeBuilding(b)} /></Row>))}
      </Section>}

      {tab === 'moderation' && <Section title={`Відгуки та коментарі (${count(feed.length, Object.values(reviews).flat().length + Object.values(comments).flat().length)})`} empty={!feed.length}
        emptyText="Відгуків і коментарів не знайдено"
        toolbar={toolbar(<SearchField key="s" value={mq} onChange={v => { setMq(v); setMshown(MOD_PAGE) }} placeholder="Пошук за текстом, автором або будівлею" />,
          <div key="k" className="flex gap-2">{[['all', 'Усі'], ['review', 'Відгуки'], ['comment', 'Коментарі']].map(([k, l]) => (
            <button key={k} onClick={() => { setMkind(k); setMshown(MOD_PAGE) }} className={`h-[42px] px-4 rounded-xl text-sm ${mkind === k ? 'bg-ink dark:bg-brand text-white font-semibold' : 'bg-slate-50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300'}`}>{l}</button>))}</div>)}>
        {feed.slice(0, mshown).map(({ kind, b, item }) => { const a = resolveAuthor(item); return (
          <div key={`${kind}-${item.id}`} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
            <img src={a.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs flex items-center gap-2 flex-wrap"><b>{shortName(a.name)}</b>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${kind === 'review' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 dark:bg-blue-500/15 text-blue-600'}`}>{kind === 'review' ? 'Відгук' : 'Коментар'}</span>
                {kind === 'review' && <span className="inline-flex items-center gap-0.5 text-amber-600 font-bold"><Star size={11} className="fill-amber-500 text-amber-500" />{item.rating}</span>}
                <span className="text-slate-400">{agoOf(item) || dateOf(item)}</span></div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 break-words">{item.text || '—'}</p>
              <Link to={`/buildings/${b.id}`} className="link mt-1.5">{b.name}</Link></div>
            <DeleteIcon label={kind === 'review' ? 'Видалити відгук' : 'Видалити коментар'} onClick={() => (kind === 'review' ? adm.removeReview(b, item) : adm.removeComment(b, item))} />
          </div>) })}
        {feed.length > mshown && <button onClick={() => setMshown(n => n + MOD_PAGE)} className="btn-ghost h-9 px-4 text-xs w-full">Показати ще ({feed.length - mshown})</button>}
      </Section>}

      {tab === 'ratings' && <Section title={`Рейтинги (${ratings.length})`} addLabel="Створити рейтинг" onAdd={() => openModal('ratingForm')} empty={!ratings.length}>
        {ratings.map(r => (
          <Row key={r.id} icon={r.icon} title={r.title} to={`/ratings?r=${r.id}`} sub={`${r.buildingIds.length} об’єктів`}>
            <DeleteIcon onClick={() => adm.removeRating(r)} /></Row>))}
      </Section>}
      {tab === 'data' && <div className="card p-6"><h2 className="font-bold mb-1">Керування даними</h2><p className="text-xs text-slate-400 mb-4">Усі дані зберігаються в localStorage вашого браузера.</p><DataTools /></div>}
    </main>
  )
}
