import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { uid, usePersisted } from '../utils'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)
export const useUI = () => useContext(Ctx)

export function UIProvider({ children }) {
  const { currentUser } = useAuth()
  const [toasts, setToasts] = useState([])
  const [theme, setTheme] = usePersisted('aw:theme', () => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [adminMode, setAdminMode] = usePersisted('aw:admin', false)
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])
  // Адміністратором вважається авторизований користувач із увімкненим режимом адміністратора або роллю admin
  const isAdmin = !!currentUser && (adminMode || currentUser.role === 'admin')
  const [confirmState, setConfirmState] = useState(null)
  const [modal, setModal] = useState({ name: null, props: {}, open: false })

  const toast = useCallback((message, type = 'success') => {
    const id = uid('toast')
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])
  const openModal = useCallback((name, props = {}) => {
    setModal({ name, props, open: false })
    requestAnimationFrame(() => requestAnimationFrame(() => setModal(m => ({ ...m, open: true }))))
  }, [])
  const closeModal = useCallback(() => {
    setModal(m => ({ ...m, open: false }))
    setTimeout(() => setModal(m => (m.open ? m : { name: null, props: {}, open: false })), 220)
  }, [])
  // fn отримує користувача — і одразу, і після входу через модальне вікно
  const requireAuth = useCallback((fn, reason = 'Увійдіть, щоб продовжити') => {
    if (currentUser) fn(currentUser)
    else openModal('auth', { mode: 'login', reason, onSuccess: fn })
  }, [currentUser, openModal])

  // Швидке додавання контенту: потрібен вхід; режим адміністратора вмикається автоматично
  const adminAdd = useCallback(name => requireAuth(() => {
    if (!adminMode) { setAdminMode(true); toast('Режим адміністратора увімкнено', 'info') }
    openModal(name)
  }, 'Увійдіть, щоб скористатися панеллю адміністратора'), [requireAuth, adminMode, setAdminMode, toast, openModal])

  // Підтвердження небезпечних дій: confirm({ title, text, confirmLabel, onConfirm })
  const confirm = useCallback(opts => setConfirmState(opts), [])
  const closeConfirm = useCallback(() => setConfirmState(null), [])

  const lastErr = useRef(0)
  useEffect(() => {
    const h = () => { if (Date.now() - lastErr.current > 5000) { lastErr.current = Date.now(); toast('Сховище браузера переповнене — використайте менші зображення або посилання', 'info') } }
    window.addEventListener('aw:storage-error', h)
    return () => window.removeEventListener('aw:storage-error', h)
  }, [toast])

  return <Ctx.Provider value={{ toasts, toast, modal, openModal, closeModal, requireAuth, theme, setTheme, adminMode, setAdminMode, adminAdd, isAdmin, confirm, closeConfirm, confirmState }}>{children}</Ctx.Provider>
}
