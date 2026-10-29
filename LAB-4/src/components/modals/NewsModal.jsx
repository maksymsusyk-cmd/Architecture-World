import { useState } from 'react'
import Modal from '../Modal'
import { ImagePicker } from '../ImagePicker'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useUI } from '../../context/UIContext'
import { defaultNewsImages, newsCategories } from '../../data/mockData'

export default function NewsModal({ open, onClose, id }) {
  const { currentUser } = useAuth()
  const { addNews, updateNews, news } = useData()
  const editing = id ? news.find(x => x.id === id) : null
  const { toast, closeModal } = useUI()
  const [f, setF] = useState({ title: editing?.title || '', text: editing?.text || '', body: editing?.body || '', cat: editing?.cat || newsCategories[0], img: editing?.img || defaultNewsImages[0] })
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    if (!currentUser) return
    const data = { ...f, img: f.img.trim() || defaultNewsImages[0] }
    if (editing) { updateNews(editing.id, data); toast('Новину оновлено') }
    else { addNews(data, currentUser); toast('Новину опубліковано') }
    closeModal()
  }
  if (id && !editing) return null
  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Редагувати новину' : 'Додати новину'} width="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Заголовок</label><input required maxLength={120} className="field" value={f.title} onChange={set('title')} /></div>
        <div><label className="label">Короткий опис</label><input required maxLength={160} className="field" value={f.text} onChange={set('text')} /></div>
        <div><label className="label">Текст новини</label><textarea required rows={4} className="field resize-none" value={f.body} onChange={set('body')} /></div>
        <div><label className="label">Категорія</label><select className="field" value={f.cat} onChange={set('cat')}>{[...new Set([f.cat, ...newsCategories])].map(c => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Обкладинка</label><ImagePicker value={f.img} onChange={v => setF(s => ({ ...s, img: v }))} presets={defaultNewsImages} /></div>
        <button className="btn-dark w-full h-11 text-sm">{editing ? 'Зберегти зміни' : 'Опублікувати'}</button>
      </form>
    </Modal>
  )
}
