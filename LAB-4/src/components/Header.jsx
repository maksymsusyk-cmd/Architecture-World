import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User, Sun, Moon, Settings, Shield, LayoutDashboard } from 'lucide-react'
import SearchBox from './SearchBox'
import NotificationBell from './NotificationBell'
import { Switch } from './ui'
import { useOutside } from '../utils'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

const nav = [['Головна', '/'], ['Новини', '/news'], ['Будівлі', '/buildings'], ['Рейтинги', '/ratings'], ['Форум', '/forum']]

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 font-bold text-[19px] tracking-tight">
      <span className="flex items-end gap-[3px] h-6"><i className="w-[5px] h-3 bg-ink dark:bg-brand rounded-sm" /><i className="w-[5px] h-6 bg-ink dark:bg-brand rounded-sm" /><i className="w-[5px] h-[18px] bg-ink dark:bg-brand rounded-sm" /></span>
      Architecture World
    </Link>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { openModal, toast, theme, setTheme, adminMode, setAdminMode } = useUI()
  const [menu, setMenu] = useState(false)
  const menuRef = useRef(null)
  useOutside(menuRef, () => setMenu(false))
  const dark = theme === 'dark'
  return (
    <header className="bg-white dark:bg-navy border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="max-w-[1320px] mx-auto h-16 px-6 flex items-center justify-between gap-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 h-full">
          {nav.map(([t, to]) => (
            <NavLink key={t} to={to} end={to === '/'}
              className={({ isActive }) => `h-full flex items-center text-sm border-b-2 ${isActive ? 'font-semibold text-ink dark:text-slate-100 border-ink dark:border-white' : 'text-slate-600 border-transparent hover:text-ink'}`}>{t}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <SearchBox />
          <button onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Світла тема' : 'Темна тема'} className="w-9 h-9 grid place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
            {dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <NotificationBell />
          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-1.5" aria-label="Меню користувача">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                <span className="hidden lg:block text-xs font-semibold max-w-[110px] truncate">{currentUser.name}</span><ChevronDown size={14} className="text-slate-500 dark:text-slate-400" /></button>
              {menu && (
                <div className="absolute right-0 mt-3 w-60 card shadow-lg border border-slate-100 dark:border-slate-700 p-1.5 text-sm">
                  <Link to="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"><User size={14} />Мій профіль</Link>
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"><span className="flex items-center gap-2"><Shield size={14} />Режим адміністратора</span><Switch on={adminMode} onChange={v => { setAdminMode(v); toast(v ? 'Режим адміністратора увімкнено' : 'Режим адміністратора вимкнено', 'info') }} label="Режим адміністратора" /></div>
                  {adminMode && <Link to="/admin" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-brand font-semibold"><LayoutDashboard size={14} />Адмін-панель</Link>}
                  <button onClick={() => { setMenu(false); openModal('settings') }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left"><Settings size={14} />Налаштування</button>
                  <button onClick={() => { setMenu(false); logout(); toast('Ви вийшли з акаунта', 'info'); navigate('/') }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left"><LogOut size={14} />Вийти</button>
                </div>)}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => openModal('auth', { mode: 'login' })} className="text-xs font-semibold px-3 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">Увійти</button>
              <Link to="/register" className="btn-dark text-xs h-9 px-4 grid place-items-center">Реєстрація</Link>
            </div>)}
        </div>
      </div>
    </header>
  )
}
