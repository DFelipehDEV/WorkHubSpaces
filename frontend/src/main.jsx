import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import Home from './Home.jsx';
import Spaces from './Spaces.jsx';
import Space from './Space.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import SignUp from './SignUp.jsx';
import Dashboard from './Dashboard.jsx';
import Reservations from './Reservations.jsx';
import Profile from './Profile.jsx';
import './i18n.js';

import { AuthProvider } from './AuthContext.jsx';
import { ClientRoute } from './ClientRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={
      <div className="min-h-screen">

      </div>
    }>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spaces" element={<Spaces />} />
            <Route path="/spaces/:id" element={<Space />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ClientRoute>
                  <Dashboard />
                </ClientRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ClientRoute>
                  <Reservations />
                </ClientRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ClientRoute>
                  <Profile />
                </ClientRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);