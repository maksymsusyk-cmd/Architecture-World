import { useState } from 'react'
import Modal from '../Modal'
import AuthForm from '../AuthForm'
import { useUI } from '../../context/UIContext'

export default function AuthModal({ open, onClose, mode: initial = 'login', reason, onSuccess }) {
  const [mode, setMode] = useState(initial)
  const { closeModal } = useUI()
  const isReg = mode === 'register'
  const done = user => { closeModal(); if (onSuccess) setTimeout(() => onSuccess(user), 250) }
  return (
    <Modal open={open} onClose={onClose} title={isReg ? 'Реєстрація' : 'Вхід в акаунт'} width="max-w-md">
      {reason && <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2 mb-4">{reason}</p>}
      <AuthForm key={mode} mode={mode} onDone={done} />
      {!isReg && <p className="text-[11px] text-slate-400 mt-3">Демо-акаунт: demo@architecture.world / 123456</p>}
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">{isReg ? 'Вже маєте акаунт?' : 'Ще немає акаунта?'}{' '}
        <button onClick={() => setMode(isReg ? 'login' : 'register')} className="font-bold text-brand">{isReg ? 'Увійти' : 'Зареєструватися'}</button></p>
    </Modal>
  )
}
