import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx';
import Spaces from './Spaces.jsx';
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<Spaces />} />
      </Routes>
  </BrowserRouter>,
)
