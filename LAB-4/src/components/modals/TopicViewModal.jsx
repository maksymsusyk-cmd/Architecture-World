import { useEffect, useState } from 'react'
import { MessageCircle, Eye } from 'lucide-react'
import Modal from '../Modal'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useUI } from '../../context/UIContext'
import AdminActions, { DeleteIcon } from '../AdminActions'
import useAdminActions from '../../hooks/useAdminActions'
import { agoOf, replyCount, shortName } from '../../utils'

export default function TopicViewModal({ open, onClose, id }) {
  const { resolveAuthor } = useAuth()
  const { topics, addReply, viewTopic } = useData()
  const { requireAuth, toast } = useUI()
  const [text, setText] = useState('')
  const adm = useAdminActions()
  useEffect(() => { viewTopic(id) }, [id]) // eslint-disable-line
  const t = topics.find(x => x.id === id)
  if (!t) return null
  const a = resolveAuthor(t)
  const send = e => {
    e.preventDefault()
    if (!text.trim()) return
    requireAuth(u => { addReply(id, text.trim(), u); setText(''); toast('Відповідь додано') }, 'Увійдіть, щоб залишити відповідь')
  }
  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <span className="text-xs font-semibold text-brand">{t.cat}</span>
      <h2 className="text-xl font-bold mt-1 pr-8">{t.title}</h2>
      <div className="flex items-center gap-2 mt-3 text-xs text-slate-400"><img src={t.authorId ? a.avatar : t.img} className="w-6 h-6 rounded-full" alt="" />
        <b className="text-ink dark:text-slate-100">{shortName(a.name)}</b>•<span>{agoOf(t)}</span>•<Eye size={12} />{t.views}•<MessageCircle size={12} />{replyCount(t)}</div>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-6 mt-4">{t.text}</p>
      {adm.isAdmin && <AdminActions className="mt-4" onEdit={() => adm.editTopic(t)} onDelete={() => adm.removeTopic(t, onClose)} />}
      <h3 className="font-bold text-sm mt-6 mb-3">Відповіді ({t.replies.length})</h3>
      <div className="space-y-3">{t.replies.length === 0 && <p className="text-sm text-slate-400">Відповідей поки немає — будьте першим.</p>}
        {t.replies.map(r => { const ra = resolveAuthor(r); return (
          <div key={r.id} className="flex gap-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3"><img src={ra.avatar} className="w-8 h-8 rounded-full" alt="" />
            <div className="flex-1 min-w-0"><div className="text-xs"><b>{shortName(ra.name)}</b> <span className="text-slate-400">{agoOf(r)}</span></div><p className="text-sm text-slate-600 dark:text-slate-300 mt-1 break-words">{r.text}</p></div>
            {adm.isAdmin && <DeleteIcon label="Видалити відповідь" onClick={() => adm.removeReply(t, r)} />}</div>) })}</div>
      <form onSubmit={send} className="mt-5 flex gap-3"><input className="field flex-1" value={text} onChange={e => setText(e.target.value)} placeholder="Напишіть відповідь..." />
        <button className="btn-dark px-5 text-sm">Відправити</button></form>
    </Modal>
  )
}
