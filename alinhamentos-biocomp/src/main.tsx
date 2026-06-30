import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import NeedlemanWunsch from './pages/Needlemanwunsch.tsx'
import Msa from './pages/Msa.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="needleman-wunsch" element={<NeedlemanWunsch />} />
          <Route path="msa" element={<Msa />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)