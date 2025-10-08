import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainHome from './pages/MainHome';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainHome />
  </StrictMode>,
)
