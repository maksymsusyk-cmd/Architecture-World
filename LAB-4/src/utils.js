import { useEffect, useState } from 'react'

export const defaultPrefs = { system: true, buildings: true, news: true, replies: true }
export const prefsOf = u => ({ ...defaultPrefs, ...(u?.settings?.notif || {}) })

// Одноразова міграція: нова версія починає з порожніх розділів
export function migrate() {
  try {
    if (localStorage.getItem('aw:schema') === '2') return
    ;['news', 'topics', 'reviews', 'comments', 'buildings', 'ratings', 'notifs'].forEach(k => localStorage.removeItem('aw:' + k))
    const us = JSON.parse(localStorage.getItem('aw:users') || 'null')
    if (us) localStorage.setItem('aw:users', JSON.stringify(us.map(x => ({ ...x, saved: [] }))))
    localStorage.setItem('aw:schema', '2')
  } catch { /* ignore */ }
}

export function useOutside(ref, cb) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) cb() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [ref, cb])
}

export const uid = (p = 'id') => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
export const fmtDate = ts => new Date(ts).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
export const timeAgo = ts => {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return 'щойно'
  if (m < 60) return `${m} хв тому`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} год тому`
  return `${Math.floor(h / 24)} дн. тому`
}
// Дата/час з урахуванням того, що початкові (seed) записи мають готовий текстовий підпис
export const dateOf = i => (i.createdAt ? fmtDate(i.createdAt) : i.time || i.dateLabel)
export const slug = t => t.toLowerCase().replace(/[^a-z0-9а-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 30)
export const agoOf = i => (i.createdAt ? timeAgo(i.createdAt) : i.time)
export const shortName = n => {
  const p = (n || '').trim().split(/\s+/)
  if (p.length < 2) return n || ''
  const l = p[p.length - 1]
  return l.endsWith('.') ? n : `${p[0]} ${l[0]}.`
}
export const replyCount = t => (t.baseReplies || 0) + t.replies.length
export const lastActivity = t => t.replies[t.replies.length - 1] || t
export const activityTs = t => lastActivity(t).createdAt || t.createdAt || 0

export function usePersisted(key, seed) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); if (s !== null) return JSON.parse(s) } catch { /* ignore */ }
    return typeof seed === 'function' ? seed() : seed
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)) } catch (e) { console.warn('localStorage:', e); window.dispatchEvent(new Event('aw:storage-error')) }
  }, [key, v])
  return [v, setV]
}

export const fileToAvatar = file => new Promise((res, rej) => {
  const r = new FileReader()
  r.onload = () => {
    const img = new Image()
    img.onload = () => {
      const s = 160, c = document.createElement('canvas'); c.width = c.height = s
      const k = Math.max(s / img.width, s / img.height), w = img.width * k, h = img.height * k
      c.getContext('2d').drawImage(img, (s - w) / 2, (s - h) / 2, w, h)
      res(c.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = rej; img.src = r.result
  }
  r.onerror = rej; r.readAsDataURL(file)
})

// Стискає зображення до dataURL (щоб вкластися в ліміт localStorage)
export const fileToImage = (file, max = 1000, quality = 0.75) => new Promise((res, rej) => {
  const r = new FileReader()
  r.onload = () => {
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      res(c.toDataURL('image/jpeg', quality))
    }
    img.onerror = rej; img.src = r.result
  }
  r.onerror = rej; r.readAsDataURL(file)
})
