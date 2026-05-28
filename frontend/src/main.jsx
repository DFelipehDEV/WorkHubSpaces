import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import Home from './Home.jsx';
import Spaces from './Spaces.jsx';
import Space from './Space.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import './i18n.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={
      <div className="min-h-screen">
        
      </div>
    }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/:id" element={<Space />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);