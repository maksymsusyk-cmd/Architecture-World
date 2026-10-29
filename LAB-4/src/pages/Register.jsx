import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Newspaper, Landmark, Users, Star } from 'lucide-react'
import { photos } from '../data/mockData'
import { Img } from '../components/ui'
import AuthForm from '../components/AuthForm'
import { useUI } from '../context/UIContext'

const perks = [[Newspaper, 'Актуальні новини', 'Будьте в курсі подій зі світу архітектури'], [Landmark, 'Каталог будівель', 'Досліджуйте найцікавіші архітектурні об’єкти'],
  [Users, 'Форум', 'Спілкуйтеся з однодумцями та отримуйте допомогу'], [Star, 'Рейтинги та ТОПи', 'Оцініть та знаходьте найкращі проєкти']]

export default function Register() {
  const nav = useNavigate()
  const { openModal, toast } = useUI()
  const social = n => toast(`Вхід через ${n} поки недоступний — скористайтеся поштою`, 'info')
  return (
    <main className="grid lg:grid-cols-[1fr_1fr] min-h-[calc(100vh-64px)] bg-white dark:bg-navy">
      <div className="px-8 sm:px-16 py-14 flex items-center justify-center">
        <div className="w-full max-w-[420px] space-y-5">
          <Link to="/" className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><ArrowLeft size={13} />Назад на головну</Link>
          <div><h1 className="text-[30px] font-extrabold">Реєстрація</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Створіть свій акаунт, щоб отримати доступ до всіх можливостей Architecture World.</p></div>
          <AuthForm mode="register" onDone={() => nav('/profile')} />
          <div className="flex items-center gap-3 text-xs text-slate-400"><hr className="flex-1" />Або<hr className="flex-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => social('Google')} className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-2"><span className="font-bold text-[#4285F4]">G</span>Продовжити з Google</button>
            <button type="button" onClick={() => social('Facebook')} className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-2"><span className="w-4 h-4 rounded-full bg-[#1877F2] text-white text-[10px] grid place-items-center">f</span>Продовжити з Facebook</button></div>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Вже маєте акаунт? <button onClick={() => openModal('auth', { mode: 'login', onSuccess: () => nav('/profile') })} className="font-bold text-brand">Увійти</button></p>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Img src={photos.zaha} alt="Heydar Aliyev Center" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-[#0B4F9E]/60" />
        <div className="relative h-full flex flex-col justify-center px-16 text-white">
          <h2 className="text-[34px] font-extrabold leading-tight">Приєднуйтесь до спільноти Architecture World</h2>
          <p className="text-sm mt-4 max-w-md text-white/90">Діліться ідеями, обговорюйте проєкти, знаходьте натхнення та розвивайтеся разом з нами.</p>
          <ul className="mt-9 space-y-5">{perks.map(([I, t, s]) => (
            <li key={t} className="flex items-center gap-4"><span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur grid place-items-center"><I size={16} /></span>
              <span><b className="block text-sm">{t}</b><span className="text-xs text-white/85">{s}</span></span></li>))}</ul>
        </div>
      </div>
    </main>
  )
}
