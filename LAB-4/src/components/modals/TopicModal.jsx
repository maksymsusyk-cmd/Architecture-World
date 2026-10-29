import { useState } from 'react'
import Modal from '../Modal'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useUI } from '../../context/UIContext'

export default function TopicModal({ open, onClose, category, id }) {
  const { currentUser } = useAuth()
  const { addTopic, updateTopic, topics, categories } = useData()
  const editing = id ? topics.find(x => x.id === id) : null
  const { toast, closeModal } = useUI()
  const [f, setF] = useState({ title: editing?.title || '', cat: editing?.cat || category || categories[0].name, text: editing?.text || '' })
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    if (!currentUser || !f.title.trim() || !f.text.trim()) return
    const data = { ...f, title: f.title.trim(), text: f.text.trim() }
    if (editing) { updateTopic(editing.id, data); toast('Тему оновлено') }
    else { addTopic(data, currentUser); toast('Тему опубліковано') }
    closeModal()
  }
  if (id && !editing) return null
  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Редагувати тему' : 'Створити тему'}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Назва теми</label><input required maxLength={120} className="field" value={f.title} onChange={set('title')} placeholder="Про що ви хочете запитати?" /></div>
        <div><label className="label">Категорія</label>
          <select className="field" value={f.cat} onChange={set('cat')}>{categories.map(c => <option key={c.name}>{c.name}</option>)}</select></div>
        <div><label className="label">Повідомлення</label><textarea required rows={5} className="field resize-none" value={f.text} onChange={set('text')} placeholder="Опишіть питання детальніше..." /></div>
        <button className="btn-dark w-full h-11 text-sm">{editing ? 'Зберегти зміни' : 'Опублікувати'}</button>
      </form>
    </Modal>
  )
}
