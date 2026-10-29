import { useState } from 'react'
import { Star } from 'lucide-react'
export const Img = ({ src, alt = '', className = '' }) => {
  const [bad, setBad] = useState(false)
  return <img alt={alt} loading="lazy" className={`object-cover ${className}`}
    src={bad ? `https://picsum.photos/seed/${encodeURIComponent(alt || src)}/800/600` : src} onError={() => setBad(true)} />
}
export const Rating = ({ v, className = '' }) => (
  <span className={`text-xs font-bold text-amber-600 inline-flex items-center gap-0.5 ${className}`}><Star size={11} className="fill-amber-500 text-amber-500" />{v || '—'}</span>
)
export const Stars = ({ n = 5, size = 12 }) => (
  <span className="inline-flex">{Array.from({ length: n }).map((_, i) => <Star key={i} size={size} className="fill-amber-400 text-amber-400" />)}</span>
)
export const tagColor = {
  blue: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600', purple: 'bg-purple-50 text-purple-600', slate: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300', red: 'bg-rose-50 text-rose-600', beige: 'bg-amber-50 text-amber-700'
}

export const Switch = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
    className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-brand' : 'bg-slate-300 dark:bg-slate-600'}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-navy shadow transition-transform ${on ? 'translate-x-4' : ''}`} /></button>
)
