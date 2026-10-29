import { Link } from 'react-router-dom'
import { ArrowRight, User, Plus, Building2, Newspaper, Trophy, MessageSquare } from 'lucide-react'
import { Img, Rating } from '../components/ui'
import EmptyState from '../components/EmptyState'
import BuildingCard from '../components/BuildingCard'
import { photos } from '../data/mockData'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { agoOf, dateOf, replyCount, shortName } from '../utils'
import { useAuth } from '../context/AuthContext'

const Head = ({ title, to, label, children }) => (
  <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold">{title}</h2>
    <div className="flex items-center gap-4">{children}<Link to={to} className="link">{label} <ArrowRight size={12} /></Link></div></div>
)

export default function Home() {
  const { news, topics, buildings, ratings, ratingOf } = useData()
  const { openModal, adminAdd, adminMode, requireAuth } = useUI()
  const { resolveAuthor } = useAuth()
  const byNew = (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  const popular = buildings.map(b => ({ ...b, ...ratingOf(b) })).sort((a, b) => b.rating - a.rating || byNew(a, b)).slice(0, 3)
  const latestNews = [...news].sort(byNew).slice(0, 4) // лише 4 найсвіжіші; решта — в архіві /news
  const latestBuildings = [...buildings].sort(byNew).slice(0, 4)
  const latestRatings = [...ratings].sort(byNew).slice(0, 5)
  return (
    <main className="max-w-[1232px] mx-auto px-6 py-7 space-y-10">
      <section className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="card overflow-hidden grid md:grid-cols-[1.2fr_1fr] min-h-[340px]">
          <div className="p-9 flex flex-col justify-center">
            <h1 className="text-[34px] leading-[1.1] font-extrabold">Архітектура<br />надихає</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-5 max-w-sm leading-6">Тут ви знайдете свіжі новини, цікаві будівлі, рейтинги та зможете поспілкуватися з однодумцями.</p>
            <button onClick={() => openModal('about')} className="btn-dark mt-7 self-start h-10 px-5 text-sm inline-flex items-center gap-2">Дізнатися більше <ArrowRight size={14} /></button>
          </div>
          <Img src={photos.hero} alt="hero" className="w-full h-full min-h-[240px]" />
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-lg">Популярні будівлі</h2><Link to="/buildings" className="link">Всі <ArrowRight size={12} /></Link></div>
          {popular.length === 0 ? <EmptyState compact icon={Building2} text="Додайте першу будівлю — вона з’явиться тут." action="Додати будівлю" onAction={() => adminAdd('building')} /> :
            popular.map(b => (
              <Link key={b.id} to={`/buildings/${b.id}`} className="flex items-center gap-3 py-3">
                <Img src={b.img} alt={b.name} className="w-16 h-16 rounded-xl" />
                <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{b.name}</div><div className="text-xs text-slate-400 mt-0.5 truncate">{b.place}</div></div>
                <Rating v={b.rating} />
              </Link>))}
        </div>
      </section>

      <section><Head title="Будівлі в каталозі" to="/buildings" label="Увесь каталог">
        {adminMode && <button onClick={() => adminAdd('building')} className="text-xs font-semibold flex items-center gap-1 bg-ink dark:bg-brand text-white rounded-full h-7 px-3"><Plus size={12} />Додати будівлю</button>}</Head>
        {latestBuildings.length === 0 ? <EmptyState icon={Building2} title="Каталог порожній" action="Додати будівлю" onAction={() => adminAdd('building')} /> :
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{latestBuildings.map(b => <BuildingCard key={b.id} b={b} />)}</div>}</section>

      <section><Head title="Останні новини" to="/news" label="Всі новини">
        {adminMode && <button onClick={() => adminAdd('news')} className="text-xs font-semibold flex items-center gap-1 bg-ink dark:bg-brand text-white rounded-full h-7 px-3"><Plus size={12} />Додати новину</button>}</Head>
        {latestNews.length === 0 ? <EmptyState icon={Newspaper} title="Новин поки немає" action="Створити новину" onAction={() => adminAdd('news')} /> :
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map(n => (
              <article key={n.id} onClick={() => openModal('newsView', { id: n.id })} className="card overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <Img src={n.img} alt={n.title} className="w-full h-[140px]" />
                <div className="p-4"><div className="text-[11px] font-semibold text-brand">{dateOf(n)}</div>
                  <h3 className="text-sm font-bold mt-1.5 leading-5">{n.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-[18px]">{n.text}</p></div>
              </article>))}
          </div>}</section>

      <section><Head title="Актуальні рейтинги" to="/ratings" label="Всі рейтинги">
        {adminMode && <button onClick={() => adminAdd('ratingForm')} className="text-xs font-semibold flex items-center gap-1 bg-ink dark:bg-brand text-white rounded-full h-7 px-3"><Plus size={12} />Створити рейтинг</button>}</Head>
        {latestRatings.length === 0 ? <EmptyState icon={Trophy} title="Рейтингів ще немає" action="Створити рейтинг" onAction={() => adminAdd('ratingForm')} /> :
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {latestRatings.map(r => (
              <Link to={`/ratings?r=${r.id}`} key={r.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 grid place-items-center text-lg">{r.icon}</div>
                <div className="text-sm font-bold mt-5">{r.title}</div><div className="text-[11px] text-slate-400 mt-3">{r.buildingIds.length} об’єктів</div>
              </Link>))}
          </div>}</section>

      <section><Head title="Останні теми на форумі" to="/forum" label="Всі теми" />
        {topics.length === 0 ? <EmptyState icon={MessageSquare} title="На форумі поки тихо" text="Тем ще немає. Створіть першу тему та розпочніть обговорення!" action="Створити тему" onAction={() => requireAuth(() => openModal('topic'), 'Увійдіть, щоб створити тему')} /> :
          <div className="card px-5 py-2">
            {[...topics].slice(0, 4).map((t, i) => (
              <div key={t.id} onClick={() => openModal('topicView', { id: t.id })} className={`flex items-center gap-4 py-4 cursor-pointer ${i ? 'border-t border-slate-100 dark:border-slate-700' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 grid place-items-center text-slate-500 dark:text-slate-400"><User size={18} /></div>
                <div className="flex-1"><div className="text-sm font-semibold">{t.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded px-2 py-0.5 text-[11px]">{t.cat}</span>
                    <User size={11} />{shortName(resolveAuthor(t).name)} • {agoOf(t)}</div></div>
                <span className="text-xs text-slate-400">{replyCount(t)} відповідей</span>
              </div>))}
          </div>}</section>
    </main>
  )
}
