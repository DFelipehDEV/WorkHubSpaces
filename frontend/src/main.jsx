import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx';
import Spaces from './Spaces.jsx';
import Space from './Space.jsx';
import Login from './Login.jsx';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from './Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/:id" element={<Space />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>,
  </StrictMode>
)
