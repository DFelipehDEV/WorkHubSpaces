import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext'; 

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 0);
      return () => clearTimeout(timer);
    }

    const fetchNotifications = () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) return [];
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        })
        .catch(err => console.error("Navigation notifications load failed:", err));
    };

    fetchNotifications();
    
    // Poll every 20 seconds to keep fresh
    const interval = setInterval(fetchNotifications, 20000);
    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleDismissNotification = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error("Dismiss failed:", err);
    }
  };

  const handleNotificationClick = (link) => {
    closeMenus();
    if (!link) return;
    try {
      const url = new URL(link);
      navigate(url.pathname);
    } catch {
      navigate('/reservations');
    }
  };

  return (
    <div className="px-4 md:px-12 lg:px-24 pt-5 sticky top-0 z-50">
      <div className="px-6 py-4 flex gap-8 justify-between items-center rounded-3xl bg-white/75 backdrop-blur-sm border border-stone-200 shadow-sm relative">
        <Link to="/" className="text-primary-2 text-shadow-sm text-xl md:text-2xl font-semibold" onClick={closeMenus}>
          Workhub Spaces
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-stone-800 text-lg font-normal tracking-tighter hover:text-primary-2">
            {t('nav.home')}
          </Link>
          <Link to="/spaces" className="text-stone-800 text-lg font-normal tracking-tighter hover:text-primary-2">
            {t('nav.spaces')}
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center justify-center p-2 rounded-full text-stone-800 cursor-pointer group"
                >
                  <Bell size={24} className='group-hover:text-primary-2' /> 
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl py-3 flex flex-col z-50">
                    
                    <div className="flex flex-col max-h-64 overflow-y-auto divide-y divide-stone-100">
                      {notifications.map((notif) => (
                        <div 
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif.link)}
                          className={`p-3 text-left hover:bg-stone-50/50 transition-all flex justify-between items-start gap-3 ${
                            notif.link ? 'cursor-pointer' : ''
                          }`}
                        >
                          <p className="text-xs font-semibold text-stone-700 leading-normal hover:text-stone-900">
                            {notif.message}
                          </p>
                          <button
                            onClick={(e) => handleDismissNotification(notif._id, e)}
                            className="text-stone-400 hover:text-red-500 shrink-0 cursor-pointer p-1"
                            aria-label="Dismiss notification"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="flex items-center justify-center p-2 rounded-full text-stone-800 cursor-pointer group"
                >
                  <User size={24} className='group-hover:text-primary-2' />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-2 flex flex-col z-50">
                    <Link to="/dashboard" onClick={closeMenus} className="px-4 py-2 text-stone-800 hover:bg-primary/10 hover:text-primary-2">
                      {t('nav.dashboard')}
                    </Link>
                    <Link to="/reservations" onClick={closeMenus} className="px-4 py-2 text-stone-800 hover:bg-primary/10 hover:text-primary-2">
                      {t('nav.reservations')}
                    </Link>
                    <Link to="/history" onClick={closeMenus} className="px-4 py-2 text-stone-800 hover:bg-primary/10 hover:text-primary-2">
                      {t('nav.history')}
                    </Link>
                    <Link to="/profile" onClick={closeMenus} className="px-4 py-2 text-stone-800 hover:bg-primary/10 hover:text-primary-2">
                      {t('nav.profile')}
                    </Link>
                    {isAdmin && (
                      <>
                        <Link to="/admin/spaces" onClick={closeMenus} className="px-4 py-2 text-stone-800 hover:bg-primary/10 hover:text-primary-2">
                          Admin Spaces
                        </Link>
                        <Link to="/admin/reservations" onClick={closeMenus} className="px-4 py-2 text-stone-800 hover:bg-primary/10 hover:text-primary-2">
                          Admin Reservations
                        </Link>
                        <Link to="/admin/services" onClick={closeMenus} className="px-4 py-2 text-stone-800 hover:bg-primary/10 hover:text-primary-2">
                          Admin Services
                        </Link>
                      </>
                    )}
                    <div className="border-t border-stone-100 my-1"></div>
                    <Link to="/logout" onClick={closeMenus} className="px-4 py-2 text-red-600 hover:bg-red-50">
                      {t('nav.logout')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-primary-2 text-center px-5 py-2 rounded-xl tracking-tighter text-white text-md font-medium hover:opacity-90 transition-opacity">
              {t('nav.login')}
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-stone-800 p-2 cursor-pointer hover:bg-primary-2 rounded-lg"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsProfileOpen(false);
            setIsNotificationsOpen(false);
          }}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 p-4 bg-white border border-stone-200 rounded-2xl shadow-lg flex flex-col gap-2 z-50 relative">
          <Link to="/" className="text-stone-800 text-lg py-2 border-b border-stone-100" onClick={closeMenus}>
            {t('nav.home')}
          </Link>
          <Link to="/spaces" className="text-stone-800 text-lg py-2 border-b border-stone-100" onClick={closeMenus}>
            {t('nav.spaces')}
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="text-stone-400 text-sm font-semibold pt-2 pb-1 uppercase tracking-wider flex justify-between items-center border-b border-stone-100">
                <span>Account</span>
              </div>

              {notifications.length > 0 && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 my-1 space-y-2 max-h-40 overflow-y-auto">
                  {notifications.map(notif => (
                    <div 
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif.link)}
                      className="text-xs flex justify-between items-start gap-2 border-b border-stone-150/50 pb-2 last:border-0 last:pb-0 cursor-pointer"
                    >
                      <p className="font-semibold text-stone-700 leading-normal hover:text-stone-900">{notif.message}</p>
                      <button 
                        onClick={(e) => handleDismissNotification(notif._id, e)}
                        className="text-stone-400 hover:text-red-500 shrink-0 p-1 cursor-pointer"
                        aria-label="Dismiss notification"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/dashboard" className="text-stone-800 text-lg py-2 pl-4 border-b border-stone-50" onClick={closeMenus}>
                {t('nav.dashboard')}
              </Link>
              <Link to="/reservations" className="text-stone-800 text-lg py-2 pl-4 border-b border-stone-50" onClick={closeMenus}>
                {t('nav.reservations')}
              </Link>
              <Link to="/history" className="text-stone-800 text-lg py-2 pl-4 border-b border-stone-50" onClick={closeMenus}>
                {t('nav.history')}
              </Link>
              <Link to="/profile" className="text-stone-800 text-lg py-2 pl-4 border-b border-stone-50" onClick={closeMenus}>
                {t('nav.profile')}
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin/spaces" className="text-stone-800 text-lg py-2 pl-4 border-b border-stone-50" onClick={closeMenus}>
                    Admin Spaces
                  </Link>
                  <Link to="/admin/reservations" className="text-stone-800 text-lg py-2 pl-4 border-b border-stone-50" onClick={closeMenus}>
                    Admin Reservations
                  </Link>
                  <Link to="/admin/services" className="text-stone-800 text-lg py-2 pl-4 border-b border-stone-50" onClick={closeMenus}>
                    Admin Services
                  </Link>
                </>
              )}
              <Link to="/logout" className="text-red-600 text-lg py-2 pl-4 font-medium mt-2" onClick={closeMenus}>
                {t('nav.logout')}
              </Link>
            </>
          ) : (
            <Link to="/login" className="bg-primary-2 text-center px-4 py-3 rounded-xl text-white text-md font-medium mt-2" onClick={closeMenus}>
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Navigation;
