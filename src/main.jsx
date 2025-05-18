import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Checkout from './Checkout.jsx'
import Landing from './Landing.jsx'
import Admin from './Admin.jsx'
import Mainpage from './Mainpage.jsx'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/landing" element={<Landing />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>

    <Analytics/>
    <SpeedInsights/>
  </StrictMode>,
)
