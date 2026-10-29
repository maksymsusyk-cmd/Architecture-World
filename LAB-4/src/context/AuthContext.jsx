import { createContext, useContext } from 'react'
import { usePersisted, uid, prefsOf } from '../utils'
import { seedUsers, coverChoices } from '../data/mockData'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
const randomAvatar = () => `https://i.pravatar.cc/120?img=${1 + Math.floor(Math.random() * 70)}`

export function AuthProvider({ children }) {
  const [users, setUsers] = usePersisted('aw:users', () => seedUsers)
  const [sessionId, setSessionId] = usePersisted('aw:session', null)
  const currentUser = users.find(x => x.id === sessionId) || null

  const register = ({ first, last, email, password }) => {
    const mail = email.trim().toLowerCase()
    if (users.some(x => x.email === mail)) throw new Error('Користувач із такою поштою вже існує')
    const user = { id: uid('u'), name: `${first.trim()} ${last.trim()}`, handle: '@' + mail.split('@')[0], email: mail, password,
      avatar: randomAvatar(), bio: '', city: '', joined: Date.now(), saved: [], cover: coverChoices[0], settings: { notif: {} } }
    setUsers(p => [...p, user]); setSessionId(user.id)
    return user
  }
  const login = (email, password) => {
    const found = users.find(x => x.email === email.trim().toLowerCase() && x.password === password)
    if (!found) throw new Error('Невірна пошта або пароль')
    setSessionId(found.id)
    return found
  }
  const logout = () => setSessionId(null)
  const updateProfile = patch => setUsers(p => p.map(x => (x.id === sessionId ? { ...x, ...patch } : x)))
  // u — користувач, переданий із requireAuth (актуальний і одразу після входу)
  const toggleSaved = (id, u = currentUser) => {
    const has = u.saved.includes(id)
    setUsers(p => p.map(x => (x.id === u.id ? { ...x, saved: has ? x.saved.filter(s => s !== id) : [...x.saved, id] } : x)))
    return !has
  }
  const updateCredentials = ({ email, currentPassword, newPassword }) => {
    if (currentPassword !== currentUser.password) throw new Error('Поточний пароль невірний')
    const patch = {}
    const mail = (email || '').trim().toLowerCase()
    if (mail && mail !== currentUser.email) {
      if (users.some(x => x.id !== currentUser.id && x.email === mail)) throw new Error('Така пошта вже використовується')
      patch.email = mail
    }
    if (newPassword) {
      if (newPassword.length < 6) throw new Error('Новий пароль має містити щонайменше 6 символів')
      patch.password = newPassword
    }
    if (!Object.keys(patch).length) throw new Error('Немає змін для збереження')
    updateProfile(patch)
  }
  const setNotifPref = (key, val) => updateProfile({ settings: { ...(currentUser.settings || {}), notif: { ...prefsOf(currentUser), [key]: val } } })
  // Актуальні ім'я/аватар автора (якщо автор — зареєстрований користувач), інакше — знімок у записі
  const resolveAuthor = item => {
    const a = item.authorId && users.find(x => x.id === item.authorId)
    return a ? { name: a.name, avatar: a.avatar } : { name: item.author, avatar: item.avatar }
  }
  return <Ctx.Provider value={{ users, currentUser, register, login, logout, updateProfile, toggleSaved, updateCredentials, setNotifPref, resolveAuthor }}>{children}</Ctx.Provider>
}
