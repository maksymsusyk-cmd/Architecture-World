import { useState } from 'react'
import { Sun, Moon, Mail, Lock } from 'lucide-react'
import Modal from '../Modal'
import { Switch } from '../ui'
import DataTools from '../DataTools'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { prefsOf } from '../../utils'

const prefList = [['system', 'Системні повідомлення'], ['buildings', 'Нові будівлі'], ['news', 'Новини та рейтинги'], ['replies', 'Теми, відповіді та коментарі']]
const Section = ({ title, children }) => <section><h3 className="font-bold text-sm mb-3">{title}</h3>{children}</section>

export default function SettingsModal({ open, onClose }) {
  const { currentUser: u, updateCredentials, setNotifPref } = useAuth()
  const { theme, setTheme, toast } = useUI()
  const [f, setF] = useState({ email: u.email, cur: '', next: '', next2: '' })
  const [err, setErr] = useState('')
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const prefs = prefsOf(u)
  const save = e => {
    e.preventDefault(); setErr('')
    try {
      if (f.next && f.next !== f.next2) throw new Error('Нові паролі не збігаються')
      updateCredentials({ email: f.email, currentPassword: f.cur, newPassword: f.next })
      setF(s => ({ ...s, cur: '', next: '', next2: '' })); toast('Дані акаунта оновлено')
    } catch (x) { setErr(x.message) }
  }
  return (
    <Modal open={open} onClose={onClose} title="Налаштування" width="max-w-xl">
      <div className="space-y-7">
        <Section title="Тема оформлення">
          <div className="grid grid-cols-2 gap-3">{[['light', 'Світла', Sun], ['dark', 'Темна', Moon]].map(([k, l, I]) => (
            <button key={k} onClick={() => setTheme(k)} aria-pressed={theme === k} className={`h-12 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold ${theme === k ? 'border-brand text-brand bg-blue-50 dark:bg-blue-500/15' : 'border-slate-200 dark:border-slate-700'}`}><I size={16} />{l}</button>))}</div>
        </Section>
        <Section title="Електронна пошта та пароль">
          <form onSubmit={save} className="space-y-3">
            <div><label className="label flex items-center gap-1.5"><Mail size={12} />Електронна пошта</label><input required type="email" className="field" value={f.email} onChange={set('email')} /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className="label flex items-center gap-1.5"><Lock size={12} />Новий пароль</label><input type="password" className="field" value={f.next} onChange={set('next')} placeholder="Залиште порожнім, якщо без змін" autoComplete="new-password" /></div>
              <div><label className="label">Повторіть новий пароль</label><input type="password" className="field" value={f.next2} onChange={set('next2')} autoComplete="new-password" /></div></div>
            <div><label className="label">Поточний пароль (для підтвердження)</label><input required type="password" className="field" value={f.cur} onChange={set('cur')} autoComplete="current-password" /></div>
            {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
            <button className="btn-dark h-10 px-5 text-sm">Зберегти зміни</button>
          </form>
        </Section>
        <Section title="Сповіщення">
          <div className="space-y-3">{prefList.map(([k, l]) => (
            <div key={k} className="flex items-center justify-between gap-3"><span className="text-sm">{l}</span><Switch on={prefs[k]} onChange={v => setNotifPref(k, v)} label={l} /></div>))}</div>
        </Section>
        <Section title="Дані сайту"><DataTools /></Section>
      </div>
    </Modal>
  )
}
