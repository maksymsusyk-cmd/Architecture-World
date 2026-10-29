import { Target, Users, Landmark, Newspaper, MessageSquare, Star, PencilRuler } from 'lucide-react'
import Modal from '../Modal'

const block = (I, t, items) => (
  <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4"><h3 className="font-bold text-sm flex items-center gap-2"><I size={15} className="text-brand" />{t}</h3>
    <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-5 list-disc pl-4">{items.map(i => <li key={i}>{i}</li>)}</ul></div>
)

export default function AboutModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Про проєкт Architecture World" width="max-w-2xl">
      <div className="space-y-5">
        <div className="flex gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-brand grid place-items-center shrink-0"><Target size={18} /></span>
          <div><h3 className="font-bold text-sm">Наша місія</h3><p className="text-sm text-slate-600 dark:text-slate-300 leading-6 mt-1">Architecture World — це відкрита платформа, яка робить світову архітектуру ближчою: збирає у єдиному просторі цікаві будівлі, свіжі новини, рейтинги та живе спілкування спільноти студентів, архітекторів і всіх, хто закоханий у простір довкола нас.</p></div></div>
        <div className="grid sm:grid-cols-2 gap-4">
          {block(Users, 'Для користувачів', ['Каталог будівель із фото, описом та картою', 'Оцінки, відгуки й коментарі', 'Закладки — зберігайте улюблені об’єкти', 'Форум: питання, поради, досвід'])}
          {block(PencilRuler, 'Для архітекторів', ['Презентуйте проєкти та їхню історію', 'Публікуйте новини й анонси конкурсів', 'Створюйте власні рейтинги й добірки', 'Знаходьте колег та однодумців'])}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">{[[Landmark, 'Будівлі'], [Newspaper, 'Новини'], [Star, 'Рейтинги'], [MessageSquare, 'Форум']].map(([I, l]) => (
          <span key={l} className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1.5 font-semibold"><I size={12} className="text-brand" />{l}</span>))}</div>
        <button onClick={onClose} className="btn-dark w-full h-11 text-sm">Зрозуміло, почнімо!</button>
      </div>
    </Modal>
  )
}
