import { useState } from 'react'
import { Upload } from 'lucide-react'
import Modal from '../Modal'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { avatarChoices, coverChoices } from '../../data/mockData'
import { fileToAvatar } from '../../utils'
import { ImagePicker } from '../ImagePicker'

export default function EditProfileModal({ open, onClose }) {
  const { currentUser, updateProfile } = useAuth()
  const { toast, closeModal } = useUI()
  const [f, setF] = useState({ name: currentUser.name, bio: currentUser.bio, city: currentUser.city, avatar: currentUser.avatar, cover: currentUser.cover || coverChoices[0] })
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const upload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    try { const data = await fileToAvatar(file); setF(s => ({ ...s, avatar: data })) }
    catch { toast('Не вдалося завантажити фото', 'info'); setF(s => ({ ...s, avatar: currentUser.avatar })) }
  }
  const submit = e => {
    e.preventDefault()
    updateProfile({ ...f, name: f.name.trim() || currentUser.name })
    toast('Профіль оновлено'); closeModal()
  }
  return (
    <Modal open={open} onClose={onClose} title="Редагувати профіль" width="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {f.avatar ? <img src={f.avatar} className="w-14 h-14 rounded-full object-cover" alt="" /> : <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-600" />}
          <div className="flex gap-1.5">{avatarChoices.map(a => (
            <button type="button" key={a} onClick={() => setF(s => ({ ...s, avatar: a }))} className={`rounded-full border-2 ${f.avatar === a ? 'border-brand' : 'border-transparent'}`}><img src={a} className="w-9 h-9 rounded-full" alt="" /></button>))}</div>
          <label className="cursor-pointer text-xs font-semibold text-brand flex items-center gap-1"><Upload size={13} />Завантажити<input type="file" accept="image/*" hidden onChange={upload} /></label>
        </div>
        <div><label className="label">Обкладинка профілю</label><ImagePicker value={f.cover} onChange={v => setF(s => ({ ...s, cover: v }))} presets={coverChoices} max={1400} /></div>
        <div><label className="label">Ім’я та прізвище</label><input required className="field" value={f.name} onChange={set('name')} /></div>
        <div><label className="label">Місто</label><input className="field" value={f.city} onChange={set('city')} placeholder="Львів, Україна" /></div>
        <div><label className="label">Про себе</label><textarea rows={3} maxLength={240} className="field resize-none" value={f.bio} onChange={set('bio')} /></div>
        <button className="btn-dark w-full h-11 text-sm">Зберегти зміни</button>
      </form>
    </Modal>
  )
}
