import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Building2, Newspaper, MessageCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { timeAgo, useOutside } from '../utils'

const icons = { system: Sparkles, buildings: Building2, news: Newspaper, replies: MessageCircle }

export default function NotificationBell() {
  const { currentUser } = useAuth()
  const { notifs, markRead, markAllRead } = useData()
  const { openModal } = useUI()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  const mine = currentUser ? notifs.filter(n => n.userId === currentUser.id) : []
  const unread = mine.filter(n => !n.read).length
  const toggle = () => (currentUser ? setOpen(!open) : openModal('auth', { mode: 'login', reason: 'Увійдіть, щоб бачити сповіщення' }))
  const click = n => {
    markRead(n.id); setOpen(false)
    if (n.link?.to) navigate(n.link.to)
    else if (n.link?.modal) openModal(n.link.modal, { id: n.link.id })
  }
  return (
    <div ref={ref} className="relative">
      <button onClick={toggle} aria-label="Сповіщення" className="relative w-9 h-9 grid place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
        <Bell size={17} className="text-amber-500 fill-amber-400" />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-[340px] card shadow-xl border border-slate-100 dark:border-slate-700 z-40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700"><h2 className="font-bold text-sm">Сповіщення</h2>
            <button disabled={!unread} onClick={() => markAllRead(currentUser.id)} className="link disabled:opacity-40 disabled:no-underline">Позначити все як прочитане</button></div>
          <div className="max-h-[380px] overflow-y-auto">
            {mine.length === 0 && <div className="text-center py-10 px-6"><Bell size={26} className="mx-auto text-slate-300" /><p className="text-sm text-slate-400 mt-3">Сповіщень поки немає</p></div>}
            {mine.map(n => { const I = icons[n.type] || Bell; return (
              <button key={n.id} onClick={() => click(n)} className={`w-full text-left flex gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${n.read ? '' : 'bg-blue-50/60 dark:bg-blue-500/10'}`}>
                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-brand grid place-items-center shrink-0"><I size={14} /></span>
                <span className="flex-1 min-w-0"><span className={`block text-xs leading-5 ${n.read ? 'text-slate-600 dark:text-slate-300' : 'font-semibold'}`}>{n.text}</span><span className="block text-[10px] text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</span></span>
                {!n.read && <span className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" />}
              </button>) })}
          </div>
        </div>)}
    </div>
  )
}
