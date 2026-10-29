import Modal from '../Modal'
import { Img } from '../ui'
import { useData } from '../../context/DataContext'
import AdminActions from '../AdminActions'
import useAdminActions from '../../hooks/useAdminActions'
import { dateOf } from '../../utils'

export default function NewsViewModal({ open, onClose, id }) {
  const n = useData().news.find(x => x.id === id)
  const adm = useAdminActions()
  if (!n) return null
  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <Img src={n.img} alt={n.title} className="w-full h-56 rounded-xl -mt-1" />
      <div className="text-xs mt-4 text-slate-400"><span className="text-brand font-semibold">{dateOf(n)}</span> • {n.cat}</div>
      <h2 className="text-xl font-bold mt-1">{n.title}</h2>
      {adm.isAdmin && <AdminActions className="mt-3" onEdit={() => adm.editNews(n)} onDelete={() => adm.removeNews(n, onClose)} />}
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-3">{n.text}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-6 mt-3 whitespace-pre-line">{n.body}</p>
    </Modal>
  )
}
