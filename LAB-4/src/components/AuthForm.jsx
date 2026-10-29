import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

const Field = ({ label, icon: I, type = 'text', toggle, ...rest }) => {
  const [show, setShow] = useState(false)
  return (
    <label className="block"><span className="text-xs font-bold">{label}</span>
      <div className="relative mt-2"><I size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input required className="input" type={toggle && show ? 'text' : type} {...rest} />
        {toggle && <button type="button" onClick={() => setShow(!show)} aria-label="Показати пароль" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">{show ? <EyeOff size={14} /> : <Eye size={14} />}</button>}</div></label>
  )
}

export default function AuthForm({ mode, onDone }) {
  const { login, register } = useAuth()
  const { toast } = useUI()
  const { notify } = useData()
  const [f, setF] = useState({ first: '', last: '', email: '', pw: '', pw2: '' })
  const [err, setErr] = useState('')
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const isReg = mode === 'register'
  const submit = e => {
    e.preventDefault(); setErr('')
    try {
      let user
      if (isReg) {
        if (f.pw.length < 6) throw new Error('Пароль має містити щонайменше 6 символів')
        if (f.pw !== f.pw2) throw new Error('Паролі не збігаються')
        user = register({ first: f.first, last: f.last, email: f.email, password: f.pw })
        toast(`Вітаємо, ${user.name}! Акаунт створено`)
        notify(user.id, { type: 'system', text: 'Ласкаво просимо до Architecture World! 🎉 Досліджуйте будівлі, новини та форум.' }, true)
      } else {
        user = login(f.email, f.pw)
        toast(`З поверненням, ${user.name.split(' ')[0]}!`)
      }
      onDone?.(user)
    } catch (x) { setErr(x.message) }
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      {isReg && <>
        <Field label="Ім’я" icon={User} placeholder="Введіть ваше ім’я" value={f.first} onChange={set('first')} />
        <Field label="Прізвище" icon={User} placeholder="Введіть ваше прізвище" value={f.last} onChange={set('last')} /></>}
      <Field label="Електронна пошта" icon={Mail} type="email" placeholder="example@domain.com" value={f.email} onChange={set('email')} />
      <Field label="Пароль" icon={Lock} type="password" toggle placeholder="Введіть пароль" value={f.pw} onChange={set('pw')} />
      {isReg && <Field label="Підтвердіть пароль" icon={Lock} type="password" toggle placeholder="Повторіть пароль" value={f.pw2} onChange={set('pw2')} />}
      {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
      <button className="btn-dark w-full h-11 text-sm">{isReg ? 'Зареєструватися' : 'Увійти'}</button>
    </form>
  )
}
