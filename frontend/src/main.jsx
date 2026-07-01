import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import Home from './pages/Home.jsx';
import Spaces from './pages/Spaces.jsx';
import Space from './pages/Space.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reservations from './pages/Reservations.jsx';
import Profile from './pages/Profile.jsx';
import BookSpace from './pages/BookSpace.jsx';
import History from './pages/History.jsx';
import AdminSpaces from './pages/AdminSpaces.jsx';
import AdminReservations from './pages/AdminReservations.jsx';
import AdminServices from './pages/AdminServices.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminReports from './pages/AdminReports.jsx';
import NotFound from './pages/NotFound.jsx';
import './i18n.js';

import { AuthProvider } from './context/AuthContext.jsx';
import { ClientRoute } from './ClientRoute.jsx';
import Layout from './components/Layout.jsx';

let refreshPromise = null;
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let response = await originalFetch(...args);
  
  if (response.status === 401 && !args[0]?.includes('/refresh') && !args[0]?.includes('/login')) {
    if (!refreshPromise) {
      refreshPromise = originalFetch(`${import.meta.env.VITE_BACKEND_URL}/refresh`, { 
        method: 'POST', 
        credentials: 'include' 
      }).finally(() => refreshPromise = null);
    }
    
    const refreshRes = await refreshPromise;
    if (refreshRes.ok) {
      response = await originalFetch(...args);
    }
  }
  
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={
      <div className="min-h-screen">

      </div>
    }>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/spaces" element={<Spaces />} />
              <Route path="/spaces/:slug" element={<Space />} />
              <Route
                path="/spaces/:slug/book"
                element={
                  <ClientRoute>
                    <BookSpace />
                  </ClientRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
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
                path="/history"
                element={
                  <ClientRoute>
                    <History />
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
              <Route
                path="/admin/spaces"
                element={
                  <ClientRoute>
                    <AdminSpaces />
                  </ClientRoute>
                }
              />
              <Route
                path="/admin/reservations"
                element={
                  <ClientRoute>
                    <AdminReservations />
                  </ClientRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ClientRoute>
                    <AdminServices />
                  </ClientRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ClientRoute>
                    <AdminUsers />
                  </ClientRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ClientRoute>
                    <AdminReports />
                  </ClientRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);