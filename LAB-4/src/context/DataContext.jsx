import { createContext, useContext } from 'react'
import { usePersisted, uid, prefsOf, slug } from '../utils'
import { makeSeed, categories } from '../data/mockData'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)
const userSnap = u => ({ authorId: u.id, author: u.name, avatar: u.avatar })

export function DataProvider({ children }) {
  const { users } = useAuth()
  const [buildings, setBuildings] = usePersisted('aw:buildings', [])
  const [news, setNews] = usePersisted('aw:news', [])
  const [ratings, setRatings] = usePersisted('aw:ratings', [])
  const [topics, setTopics] = usePersisted('aw:topics', [])
  const [reviews, setReviews] = usePersisted('aw:reviews', {})
  const [comments, setComments] = usePersisted('aw:comments', {})
  const [notifs, setNotifs] = usePersisted('aw:notifs', [])

  // ---------- сповіщення ----------
  // target: id користувача, масив id або 'all'. force — ігнорувати налаштування (вітання)
  const notify = (target, { type = 'system', text, link }, force = false) => {
    const ids = target === 'all' ? users.map(u => u.id) : [].concat(target)
    const items = ids
      .filter(id => { if (force) return true; const u = users.find(x => x.id === id); return !u || prefsOf(u)[type] !== false })
      .map(userId => ({ id: uid('nt'), userId, type, text, link, createdAt: Date.now(), read: false }))
    if (items.length) setNotifs(p => [...items, ...p].slice(0, 300))
  }
  const dropNotifs = pred => setNotifs(p => p.filter(n => !pred(n)))
  const markRead = id => setNotifs(p => p.map(n => (n.id === id ? { ...n, read: true } : n)))
  const markAllRead = userId => setNotifs(p => p.map(n => (n.userId === userId ? { ...n, read: true } : n)))

  // ---------- адмін: контент (Admin API: додавання, редагування, видалення) ----------
  const addBuilding = (d, u) => {
    const b = { id: `${slug(d.name) || 'b'}-${uid('')}`.replace('--', '-'), ...d, rating: 0, votes: 0, createdAt: Date.now(), addedBy: u.id }
    setBuildings(p => [b, ...p])
    notify('all', { type: 'buildings', text: `Додано нову будівлю: ${b.name}`, link: { to: `/buildings/${b.id}` } })
    return b
  }
  const updateBuilding = (id, d) => setBuildings(p => p.map(b => (b.id === id ? { ...b, ...d, id, updatedAt: Date.now() } : b)))
  // Видалення будівлі прибирає її з рейтингів, а також усі її відгуки, коментарі та сповіщення з посиланням на неї
  const deleteBuilding = id => {
    setBuildings(p => p.filter(b => b.id !== id))
    setRatings(p => p.map(r => ({ ...r, buildingIds: r.buildingIds.filter(x => x !== id) })))
    setReviews(p => { const { [id]: _drop, ...rest } = p; return rest })
    setComments(p => { const { [id]: _drop, ...rest } = p; return rest })
    dropNotifs(n => n.link?.to === `/buildings/${id}`)
  }
  const addNews = (data, u) => {
    const n = { id: uid('n'), ...data, ...userSnap(u), createdAt: Date.now() }
    setNews(p => [n, ...p])
    notify('all', { type: 'news', text: `Нова новина: ${n.title}`, link: { modal: 'newsView', id: n.id } })
  }
  const updateNews = (id, d) => setNews(p => p.map(n => (n.id === id ? { ...n, ...d, id, updatedAt: Date.now() } : n)))
  const deleteNews = id => { setNews(p => p.filter(n => n.id !== id)); dropNotifs(n => n.link?.modal === 'newsView' && n.link.id === id) }
  const addRating = data => {
    setRatings(p => [{ id: uid('rt'), ...data, createdAt: Date.now() }, ...p])
    notify('all', { type: 'news', text: `Новий рейтинг: ${data.title}`, link: { to: '/ratings' } })
  }
  const deleteRating = id => setRatings(p => p.filter(r => r.id !== id))

  // ---------- форум / відгуки ----------
  const addTopic = (data, u) => {
    const id = uid('t')
    setTopics(p => [{ id, ...data, ...userSnap(u), img: u.avatar, createdAt: Date.now(), views: 0, baseReplies: 0, replies: [] }, ...p])
    notify(u.id, { type: 'replies', text: `Тему «${data.title}» опубліковано`, link: { modal: 'topicView', id } })
  }
  const addReply = (topicId, text, u) => {
    const t = topics.find(x => x.id === topicId)
    setTopics(p => p.map(x => x.id === topicId ? { ...x, replies: [...x.replies, { id: uid('r'), text, ...userSnap(u), createdAt: Date.now() }] } : x))
    if (t) {
      const link = { modal: 'topicView', id: topicId }
      if (t.authorId && t.authorId !== u.id) notify(t.authorId, { type: 'replies', text: `${u.name} відповів(ла) у вашій темі «${t.title}»`, link })
      notify(u.id, { type: 'replies', text: `Ви відповіли у темі «${t.title}»`, link })
    }
  }
  // Редагування лише змінює вказані поля (відповіді, автор та лічильники лишаються)
  const updateTopic = (id, d) => setTopics(p => p.map(t => (t.id === id ? { ...t, ...d, id, replies: t.replies, updatedAt: Date.now() } : t)))
  // Відповіді зберігаються всередині теми, тож видалення теми прибирає й усі її відповіді
  const deleteTopic = id => { setTopics(p => p.filter(t => t.id !== id)); dropNotifs(n => n.link?.modal === 'topicView' && n.link.id === id) }
  const deleteReply = (topicId, replyId) => setTopics(p => p.map(t => (t.id === topicId ? { ...t, replies: t.replies.filter(r => r.id !== replyId) } : t)))
  const viewTopic = id => setTopics(p => p.map(t => (t.id === id ? { ...t, views: t.views + 1 } : t)))
  // Один відгук на користувача: повторна оцінка оновлює попередню
  const addReview = (bid, { rating, text }, u) => {
    const prev = (reviews[bid] || []).some(r => r.authorId === u.id)
    setReviews(p => ({ ...p, [bid]: [{ id: uid('rv'), rating, text, ...userSnap(u), likes: 0, createdAt: Date.now() }, ...(p[bid] || []).filter(r => r.authorId !== u.id)] }))
    return prev
  }
  const addComment = (bid, text, u) => {
    setComments(p => ({ ...p, [bid]: [{ id: uid('c'), text, ...userSnap(u), createdAt: Date.now() }, ...(p[bid] || [])] }))
    const b = buildings.find(x => x.id === bid)
    if (b) notify(u.id, { type: 'replies', text: `Ваш коментар до «${b.name}» опубліковано`, link: { to: `/buildings/${bid}` } })
  }
  // Рейтинг будівлі перераховується автоматично (ratingOf), тож окремо оновлювати його не потрібно
  const deleteReview = (buildingId, reviewId) => setReviews(p => ({ ...p, [buildingId]: (p[buildingId] || []).filter(r => r.id !== reviewId) }))
  const deleteComment = (buildingId, commentId) => setComments(p => ({ ...p, [buildingId]: (p[buildingId] || []).filter(c => c.id !== commentId) }))
  // Середній рейтинг = базова оцінка + оцінки користувачів (для нових будівель база = 0 голосів)
  const ratingOf = b => {
    const own = (reviews[b.id] || []).filter(r => r.createdAt)
    const votes = (b.votes || 0) + own.length
    if (!votes) return { rating: 0, votes: 0 }
    return { rating: +(((b.rating || 0) * (b.votes || 0) + own.reduce((s, r) => s + r.rating, 0)) / votes).toFixed(1), votes }
  }

  // ---------- демо-дані ----------
  const seedAll = () => {
    const s = makeSeed()
    setBuildings(s.buildings); setNews(s.news); setRatings(s.ratings); setTopics(s.topics); setReviews(s.reviews); setComments({})
    notify('all', { type: 'system', text: 'Завантажено демонстраційні дані' }, true)
  }
  const clearAll = () => {
    setBuildings([]); setNews([]); setRatings([]); setTopics([]); setReviews({}); setComments({}); setNotifs([])
  }

  return <Ctx.Provider value={{ news, topics, reviews, comments, buildings, ratings, categories, notifs, notify, markRead, markAllRead,
    addBuilding, updateBuilding, deleteBuilding, addNews, updateNews, deleteNews, addRating, deleteRating, addTopic, updateTopic, deleteTopic, addReply, deleteReply, viewTopic, addReview, deleteReview, addComment, deleteComment, ratingOf, seedAll, clearAll }}>{children}</Ctx.Provider>
}
