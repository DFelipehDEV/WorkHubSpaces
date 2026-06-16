import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Bell, BellOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext'; 

const mainLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/spaces', label: 'nav.spaces' },
];

const accountLinks = [
  { to: '/dashboard', label: 'nav.dashboard' },
  { to: '/reservations', label: 'nav.reservations' },
  { to: '/history', label: 'nav.history' },
  { to: '/profile', label: 'nav.profile' },
];

const adminMenuLinks = [
  { to: '/admin/spaces', label: 'admin.nav.spaces' },
  { to: '/admin/reservations', label: 'admin.nav.reservations' },
  { to: '/admin/services', label: 'admin.nav.services' },
  { to: '/admin/users', label: 'admin.nav.users' },
  { to: '/admin/reports', label: 'admin.nav.reports' },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isDropdownOpen = isProfileOpen || isNotificationsOpen;

  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => setNotifications([]), 0);
      return () => clearTimeout(timer);
    }

    const fetchNotifications = () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) return [];
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(err => console.error("Navigation notifications load failed:", err));
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
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
      navigate(new URL(link).pathname);
    } catch {
      navigate('/reservations');
    }
  };

  const renderNavLinks = (isMobile = false) => mainLinks.map(link => (
    <Link 
      key={link.to} 
      to={link.to} 
      onClick={closeMenus}
      className={isMobile 
        ? "text-stone-800 text-lg py-2 border-b border-stone-100" 
        : "text-stone-800 px-4 py-2 text-md font-light tracking-wider rounded-full hover:bg-white/70 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300"}
    >
      {t(link.label)}
    </Link>
  ));

  const renderDropdownLinks = (links, isMobile = false) => links.map(link => (
    <Link 
      key={link.to} 
      to={link.to} 
      onClick={closeMenus} 
      className={isMobile
        ? "text-stone-800 text-lg py-2 pl-4 border-b border-stone-50"
        : "mx-2 my-0.5 px-4 py-2 text-sm text-stone-800 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all duration-300"}
    >
      {t(link.label)}
    </Link>
  ));

  return (
    <div className="px-4 md:px-8 lg:px-16 pt-6 sticky top-0 z-50 pointer-events-none">
      <div className="flex justify-between items-center w-full">
        <Link to="/" className="text-primary-2 text-shadow-sm text-xl md:text-2xl font-bold hover:-translate-y-0.5 hover:opacity-90 transition-all duration-300 pointer-events-auto drop-shadow-sm" onClick={closeMenus}>
          Workhub Spaces
        </Link>

        <div className={`group pointer-events-auto flex items-center px-3 py-2 md:px-5 md:py-3 rounded-full backdrop-blur-lg border transition-all duration-500 ease-out relative ${isDropdownOpen ? 'bg-white/60 border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.08)]' : 'bg-white/10 border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:bg-white/60 hover:border-white/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]'}`}>
          
          <div className={`hidden md:flex items-center transition-all duration-500 ease-out ${isDropdownOpen ? 'gap-4 md:gap-6' : 'gap-2 group-hover:gap-4 md:gap-4 md:group-hover:gap-6'}`}>
            {renderNavLinks()}
            
            {isAuthenticated ? (
              <div className={`flex items-center transition-all duration-500 ease-out ${isDropdownOpen ? 'gap-4 md:gap-6' : 'gap-2 group-hover:gap-4 md:gap-4 md:group-hover:gap-6'}`}>
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileOpen(false);
                    }}
                    className="relative flex items-center justify-center p-2.5 rounded-full text-stone-800 cursor-pointer hover:bg-white/70 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 group/btn"
                  >
                    <Bell size={22} className='group-hover/btn:text-primary-2 transition-colors' /> 
                    {notifications.length > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/60 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] py-3 flex flex-col z-50">
                      <div className="flex flex-col min-h-50 max-h-64 overflow-y-auto px-1 gap-1">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id}
                              onClick={() => handleNotificationClick(notif.link)}
                              className={`px-4 py-3 mx-1 text-left bg-white/30 hover:bg-white/70 border border-white/40 rounded-2xl transition-all duration-300 flex justify-between items-start gap-3 ${notif.link ? 'cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]' : ''}`}
                            >
                              <p className="text-xs font-semibold text-stone-700 leading-normal hover:text-stone-900">
                                {notif.message}
                              </p>
                              <button
                                onClick={(e) => handleDismissNotification(notif._id, e)}
                                className="text-stone-400 hover:text-red-500 shrink-0 cursor-pointer p-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col flex-1 items-center justify-center text-stone-400 gap-2 opacity-80 h-full py-8">
                            <BellOff size={28} strokeWidth={1.5} />
                          </div>
                        )}
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
                    className="flex items-center justify-center p-2.5 rounded-full text-stone-800 cursor-pointer hover:bg-white/70 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 group/btn"
                  >
                    <User size={22} className='group-hover/btn:text-primary-2 transition-colors' />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/60 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] py-3 flex flex-col z-50">
                      {renderDropdownLinks(accountLinks)}
                      {isAdmin && (
                        <>
                          <div className="border-t border-white/40 my-1 mx-3"></div>
                          {renderDropdownLinks(adminMenuLinks)}
                        </>
                      )}
                      <div className="border-t border-white/40 my-1 mx-3"></div>
                      <Link to="/logout" onClick={closeMenus} className="mx-2 my-0.5 px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all duration-300">
                        {t('nav.logout')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-primary-2/90 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full tracking-tight text-white text-md font-medium hover:bg-primary-2 hover:shadow-[0_4px_16px_rgba(0,230,118,0.3)] hover:-translate-y-0.5 transition-all duration-300 ml-2">
                {t('nav.login')}
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-stone-800 p-2 cursor-pointer hover:bg-white/80 rounded-full transition-all duration-300 shadow-sm ml-2 shrink-0"
            onClick={() => {
              setIsOpen(!isOpen);
              setIsProfileOpen(false);
              setIsNotificationsOpen(false);
            }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-3 p-5 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] flex flex-col gap-2 z-50 relative pointer-events-auto">
          {renderNavLinks(true)}
          
          {isAuthenticated ? (
            <>
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
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {renderDropdownLinks(accountLinks, true)}
              {isAdmin && renderDropdownLinks(adminMenuLinks, true)}
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