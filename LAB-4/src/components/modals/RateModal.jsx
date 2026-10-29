import { useState } from 'react'
import { Star } from 'lucide-react'
import Modal from '../Modal'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useUI } from '../../context/UIContext'

export default function RateModal({ open, onClose, building }) {
  const { currentUser } = useAuth()
  const { addReview } = useData()
  const { toast, closeModal } = useUI()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const submit = e => {
    e.preventDefault()
    if (!currentUser || !rating) return
    const updated = addReview(building.id, { rating, text: text.trim() }, currentUser)
    toast(updated ? 'Ваш відгук оновлено' : 'Дякуємо за оцінку!'); closeModal()
  }
  return (
    <Modal open={open} onClose={onClose} title={`Оцінити: ${building.name}`} width="max-w-md">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>{[1, 2, 3, 4, 5].map(n => (
          <button type="button" key={n} aria-label={`${n} з 5`} onMouseEnter={() => setHover(n)} onClick={() => setRating(n)}>
            <Star size={32} className={`transition-colors ${(hover || rating) >= n ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} /></button>))}</div>
        <div><label className="label">Відгук</label><textarea rows={4} className="field resize-none" value={text} onChange={e => setText(e.target.value)} placeholder="Поділіться враженнями..." /></div>
        <button disabled={!rating} className="btn-dark w-full h-11 text-sm disabled:opacity-40">Надіслати оцінку</button>
      </form>
    </Modal>
  )
}
