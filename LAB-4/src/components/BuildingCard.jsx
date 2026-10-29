import { Link } from 'react-router-dom'
import { Img, Rating } from './ui'
import SaveButton from './SaveButton'
import AdminActions from './AdminActions'
import useAdminActions from '../hooks/useAdminActions'
import { useData } from '../context/DataContext'

export default function BuildingCard({ b }) {
  const { ratingOf } = useData()
  const adm = useAdminActions()
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow relative">
      <Link to={`/buildings/${b.id}`} className="block">
        <Img src={b.img} alt={b.name} className="w-full h-[150px]" />
        <div className="p-4"><div className="text-sm font-bold truncate">{b.name}</div>
          <div className="flex justify-between items-center mt-1 gap-2"><span className="text-xs text-slate-400 truncate">{b.place}</span><Rating v={ratingOf(b).rating} /></div></div>
      </Link>
      <SaveButton building={b} />
      {adm.isAdmin && <div className="px-4 pb-4 -mt-1"><AdminActions compact onEdit={() => adm.editBuilding(b)} onDelete={() => adm.removeBuilding(b)} /></div>}
    </div>
  )
}
