import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { UIProvider } from './context/UIContext'
import { migrate } from './utils'
import './index.css'

migrate()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><AuthProvider><DataProvider><UIProvider><App /></UIProvider></DataProvider></AuthProvider></BrowserRouter>
)
