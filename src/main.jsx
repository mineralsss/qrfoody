import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Checkout from './Checkout.jsx'
import Landing from './Landing.jsx'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
    <Analytics/>
    <SpeedInsights/>
  </StrictMode>,
)
