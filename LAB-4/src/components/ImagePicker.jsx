import { useRef } from 'react'
import { Upload, X, Plus } from 'lucide-react'
import { Img } from './ui'
import { fileToImage } from '../utils'
import { useUI } from '../context/UIContext'

// Одне зображення: готові шаблони, посилання або завантаження файлу
export function ImagePicker({ value, onChange, presets = [], max = 1000 }) {
  const { toast } = useUI()
  const upload = async e => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) return
    try { onChange(await fileToImage(file, max)) } catch { toast('Не вдалося завантажити фото', 'info') }
  }
  return (
    <div>
      {presets.length > 0 && <div className="flex gap-2 mb-2 flex-wrap">{presets.map(src => (
        <button type="button" key={src} onClick={() => onChange(src)} className={`rounded-lg overflow-hidden border-2 ${value === src ? 'border-brand' : 'border-transparent'}`}>
          <Img src={src} alt="preset" className="w-16 h-12" /></button>))}</div>}
      <div className="flex gap-2">
        <input className="field flex-1 min-w-0" value={value?.startsWith('data:') ? '' : value || ''} onChange={e => onChange(e.target.value)} placeholder={value?.startsWith('data:') ? 'Завантажено файл' : 'Посилання на зображення'} />
        <label className="btn-ghost h-[42px] px-3 text-xs flex items-center gap-1.5 cursor-pointer shrink-0"><Upload size={13} />Файл<input type="file" accept="image/*" hidden onChange={upload} /></label>
      </div>
      {value && <Img src={value} alt="preview" className="mt-2 h-24 w-40 rounded-lg" />}
    </div>
  )
}

// Галерея: кілька зображень
export function GalleryPicker({ value, onChange }) {
  const { toast } = useUI()
  const url = useRef(null)
  const add = src => src && onChange([...value, src])
  const upload = async e => {
    const files = [...(e.target.files || [])]; e.target.value = ''
    try { const imgs = await Promise.all(files.map(f => fileToImage(f, 900, 0.7))); onChange([...value, ...imgs]) } catch { toast('Не вдалося завантажити фото', 'info') }
  }
  return (
    <div>
      <div className="flex gap-2">
        <input ref={url} className="field flex-1 min-w-0" placeholder="Посилання на фото галереї"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(url.current.value.trim()); url.current.value = '' } }} />
        <button type="button" onClick={() => { add(url.current.value.trim()); url.current.value = '' }} className="btn-ghost h-[42px] px-3 text-xs flex items-center gap-1"><Plus size={13} />Додати</button>
        <label className="btn-ghost h-[42px] px-3 text-xs flex items-center gap-1.5 cursor-pointer shrink-0"><Upload size={13} />Файли<input type="file" accept="image/*" multiple hidden onChange={upload} /></label>
      </div>
      {value.length > 0 && <div className="flex gap-2 flex-wrap mt-2">{value.map((src, i) => (
        <div key={i} className="relative"><Img src={src} alt={`gallery ${i}`} className="w-20 h-14 rounded-lg" />
          <button type="button" aria-label="Видалити фото" onClick={() => onChange(value.filter((_, k) => k !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink dark:bg-brand text-white grid place-items-center"><X size={11} /></button></div>))}</div>}
    </div>
  )
}
