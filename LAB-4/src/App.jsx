import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import ModalHost from './components/modals/ModalHost'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import News from './pages/News'
import Buildings from './pages/Buildings'
import Building from './pages/Building'
import Forum from './pages/Forum'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Ratings from './pages/Ratings'
import Admin from './pages/Admin'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <div className="min-h-screen bg-page dark:bg-ink">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/buildings" element={<Buildings />} />
        <Route path="/buildings/:id" element={<Building />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <ModalHost />
      <Toasts />
    </div>
  )
}
