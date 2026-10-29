import { useState } from 'react'
import Modal from '../Modal'
import { ImagePicker, GalleryPicker } from '../ImagePicker'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useUI } from '../../context/UIContext'
import { buildingStyles, photos } from '../../data/mockData'

const presets = [photos.dubai, photos.tower, photos.london, photos.singapore, photos.barcelona]

// place зберігається як «Місто, Країна» — розбираємо назад для форми редагування
const splitPlace = place => { const i = (place || '').lastIndexOf(','); return i < 0 ? [place || '', ''] : [place.slice(0, i).trim(), place.slice(i + 1).trim()] }

export default function BuildingModal({ open, onClose, id }) {
  const { currentUser } = useAuth()
  const { addBuilding, updateBuilding, buildings } = useData()
  const editing = id ? buildings.find(x => x.id === id) : null
  const [ec, eco] = splitPlace(editing?.place)
  const { toast, closeModal } = useUI()
  const [f, setF] = useState(() => editing ? {
    name: editing.name || '', country: eco, city: ec, architect: editing.architect || '', year: String(editing.year ?? ''), style: editing.style || buildingStyles[0],
    subtitle: editing.subtitle || '', description: (editing.description || []).join('\n\n'), features: (editing.features || []).join('\n'),
    lat: editing.coords ? String(editing.coords[0]) : '', lon: editing.coords ? String(editing.coords[1]) : ''
  } : { name: '', country: '', city: '', architect: '', year: '', style: buildingStyles[0], subtitle: '', description: '', features: '', lat: '', lon: '' })
  const [img, setImg] = useState(editing?.img || '')
  const [gallery, setGallery] = useState(() => (editing?.gallery || []).filter(g => g !== editing?.img))
  const [err, setErr] = useState('')
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    if (!currentUser) return
    if (!img.trim()) return setErr('Додайте головне фото')
    const lat = parseFloat(f.lat), lon = parseFloat(f.lon)
    const place = `${f.city.trim()}, ${f.country.trim()}`
    const features = f.features.split('\n').map(x => x.trim()).filter(Boolean)
    const style = f.style.trim(), city = f.city.trim()
    const data = {
      name: f.name.trim(), place, architect: f.architect.trim(), year: Number(f.year), style,
      subtitle: f.subtitle.trim() || `${style}, ${place}`,
      description: f.description.split(/\n+/).map(x => x.trim()).filter(Boolean),
      features: features.length ? features : [`Рік завершення — ${f.year}`, `Автор проєкту — ${f.architect.trim()}`, `Стиль — ${style}`],
      tags: [style, city], img: img.trim(), gallery: [img.trim(), ...gallery],
      coords: Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null
    }
    if (editing) {
      // Зберігаємо додаткові теги, змінюючи лише стиль і місто
      const old = new Set([editing.style, splitPlace(editing.place)[0]])
      data.tags = [...new Set([...data.tags, ...(editing.tags || []).filter(t => !old.has(t))])]
      updateBuilding(editing.id, data); toast('Будівлю оновлено')
    } else { addBuilding(data, currentUser); toast('Будівлю додано до каталогу') }
    closeModal()
  }
  if (id && !editing) return null
  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Редагувати будівлю' : 'Додати будівлю'} width="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Назва</label><input required maxLength={80} className="field" value={f.name} onChange={set('name')} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Країна</label><input required className="field" value={f.country} onChange={set('country')} placeholder="Україна" /></div>
          <div><label className="label">Місто</label><input required className="field" value={f.city} onChange={set('city')} placeholder="Львів" /></div>
          <div><label className="label">Архітектор</label><input required className="field" value={f.architect} onChange={set('architect')} /></div>
          <div><label className="label">Рік</label><input required type="number" min="-3000" max="2100" className="field" value={f.year} onChange={set('year')} /></div>
        </div>
        <div><label className="label">Стиль</label><input required list="styles" className="field" value={f.style} onChange={set('style')} /><datalist id="styles">{buildingStyles.map(s => <option key={s} value={s} />)}</datalist></div>
        <div><label className="label">Короткий підзаголовок (необов’язково)</label><input maxLength={120} className="field" value={f.subtitle} onChange={set('subtitle')} /></div>
        <div><label className="label">Опис</label><textarea required rows={4} className="field resize-none" value={f.description} onChange={set('description')} placeholder="Окремі абзаци — з нового рядка" /></div>
        <div><label className="label">Особливості (кожна з нового рядка, необов’язково)</label><textarea rows={3} className="field resize-none" value={f.features} onChange={set('features')} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Широта (необов’язково)</label><input className="field" value={f.lat} onChange={set('lat')} placeholder="49.8397" /></div>
          <div><label className="label">Довгота (необов’язково)</label><input className="field" value={f.lon} onChange={set('lon')} placeholder="24.0297" /></div></div>
        <div><label className="label">Головне фото</label><ImagePicker value={img} onChange={v => { setImg(v); setErr('') }} presets={presets} /></div>
        <div><label className="label">Фото галереї</label><GalleryPicker value={gallery} onChange={setGallery} /></div>
        {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
        <button className="btn-dark w-full h-11 text-sm">{editing ? 'Зберегти зміни' : 'Додати будівлю'}</button>
      </form>
    </Modal>
  )
}
