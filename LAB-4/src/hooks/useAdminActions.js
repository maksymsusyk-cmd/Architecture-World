import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

// Єдина точка для адмін-дій: підтвердження → виклик Admin API → Toast.
// Використовується і в Адмін-панелі, і в швидких діях на публічних сторінках.
export default function useAdminActions() {
  const d = useData()
  const { openModal, closeModal, confirm, toast, isAdmin } = useUI()

  const ask = (text, run, msg, extra = {}) =>
    confirm({ title: 'Ви впевнені, що хочете видалити цей елемент?', text, ...extra, onConfirm: () => { run(); toast(msg, 'info') } })

  return {
    isAdmin,
    editTopic: t => openModal('topic', { id: t.id }),
    editNews: n => openModal('news', { id: n.id }),
    editBuilding: b => openModal('building', { id: b.id }),
    removeTopic: (t, done) => ask(`Тема «${t.title}» та всі її відповіді (${t.replies?.length || 0}) будуть видалені.`, () => { d.deleteTopic(t.id); done?.() }, 'Тему видалено'),
    removeReply: (t, r) => ask(`Відповідь: «${(r.text || '').slice(0, 120)}»`, () => d.deleteReply(t.id, r.id), 'Відповідь видалено'),
    removeNews: (n, done) => ask(`Новину «${n.title}» буде видалено.`, () => { d.deleteNews(n.id); done?.() }, 'Новину видалено'),
    removeRating: r => ask(`Рейтинг «${r.title}» буде видалено.`, () => d.deleteRating(r.id), 'Рейтинг видалено'),
    removeBuilding: (b, done) => ask(`Будівлю «${b.name}», усі її відгуки та коментарі буде видалено.`, () => { d.deleteBuilding(b.id); done?.() }, 'Будівлю видалено'),
    removeReview: (b, r) => ask(`Відгук: «${(r.text || `оцінка ${r.rating}/5`).slice(0, 120)}»`, () => d.deleteReview(b.id, r.id), 'Відгук видалено'),
    removeComment: (b, c) => ask(`Коментар: «${(c.text || '').slice(0, 120)}»`, () => d.deleteComment(b.id, c.id), 'Коментар видалено'),
    closeModal, toast,
  }
}
