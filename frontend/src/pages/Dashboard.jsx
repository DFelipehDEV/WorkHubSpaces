import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import useSWR from 'swr';
import { fetcherWithAuth } from '../utils/fetcher';

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: reservationsData, isLoading: loadingRes } = useSWR('/reservations', fetcherWithAuth);
  const { data: notificationsData, mutate: mutateNotif, isLoading: loadingNotif } = useSWR('/notifications', fetcherWithAuth);

  const loading = loadingRes || loadingNotif;
  
  const notifications = Array.isArray(notificationsData) ? notificationsData : [];
  
  let nextBooking = null;
  if (Array.isArray(reservationsData)) {
    const active = reservationsData.filter(res => res.status === 0 || res.status === 2);
    const now = new Date();
    const futureBookings = active
      .filter(res => new Date(res.startDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      
    if (futureBookings.length > 0) {
      nextBooking = futureBookings[0];
    }
  }

  const handleDismissNotification = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        mutateNotif(prev => prev.filter(item => item._id !== id), false);
      }
    } catch (err) {
      console.error("Dismiss failed:", err);
    }
  };

  const handleNotificationClick = (link) => {
    if (!link) return;
    try {
      const url = new URL(link);
      navigate(url.pathname);
    } catch {
      navigate('/reservations');
    }
  };

  if (loading) {
    return (
      <Spinner fullPage />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div>
        <PageTitle className="mb-6">{t('dashboard.title', 'Dashboard')}</PageTitle>
      </div>

      <div>
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-stone-850 mb-3">{t('dashboard.upcoming_title')}</h3>
            {nextBooking ? (
              <div className="bg-stone-50/75 p-5 rounded-2xl border border-stone-100 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-stone-900 text-base line-clamp-1">
                    {nextBooking.spaceId !== null ? nextBooking.spaceId.name : 'N/A'}
                  </h4>
                  {nextBooking.cost && (
                    <span className="text-xs font-mono font-bold text-stone-900 shrink-0 bg-stone-200/50 px-2 py-0.5 rounded">
                      {nextBooking.cost.toFixed(2)}€
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('reservations.start')}</p>
                  <p className="text-xs text-stone-700 font-mono">
                    {new Date(nextBooking.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <p className="text-xs text-stone-450">{t('dashboard.no_upcoming')}</p>
                <Link to="/spaces" className="inline-block px-5 py-2.5 bg-primary-2 text-white font-bold rounded-xl text-xs hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer">
                  {t('home.hero.cta')}
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-stone-100 text-xs">
            <Link to="/reservations" className="text-primary-2 font-bold hover:underline">
              {t('dashboard.view_details')}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-stone-850">{t('dashboard.notifications_title')}</h3>
          {notifications.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary-2 px-2.5 py-0.5 rounded-full font-bold">
              {notifications.length} {t('dashboard.unread')}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif._id}
              onClick={() => handleNotificationClick(notif.link)}
              className={`p-4 rounded-2xl border text-left flex justify-between items-center gap-4 transition-all duration-200 ${
                notif.link ? 'cursor-pointer hover:bg-stone-50/50 hover:border-stone-300' : 'border-stone-150'
              }`}
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-stone-800 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              
              <button
                onClick={(e) => handleDismissNotification(notif._id, e)}
                className="text-stone-400 hover:text-red-500 shrink-0 cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
