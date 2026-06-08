import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

function AdminReports() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/reports-stats`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(t('admin.reports.stats_failed'));
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL, t]);

  useEffect(() => {
    let active = true;
    if (active) {
      setTimeout(() => {
        fetchStats();
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">
        {t('admin.reports.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-850 uppercase tracking-wider border-b border-stone-100 pb-2">
            Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-stone-400">{t('admin.reports.total_revenue')}</span>
              <span className="text-xl font-bold text-stone-900">{stats?.totalRevenue?.toFixed(2)}€</span>
            </div>
            <div>
              <span className="block text-xs text-stone-400">{t('admin.reports.total_bookings')}</span>
              <span className="text-xl font-bold text-stone-900">{stats?.totalReservations}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-855 uppercase tracking-wider border-b border-stone-100 pb-2">
            {t('admin.reports.total_users')}
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="block text-xs text-stone-400">Total</span>
              <span className="text-lg font-bold text-stone-850">{stats?.totalUsers}</span>
            </div>
            <div>
              <span className="block text-xs text-stone-450">{t('admin.reports.active_clients')}</span>
              <span className="text-lg font-bold text-emerald-600">{stats?.activeUsers}</span>
            </div>
            <div>
              <span className="block text-xs text-stone-450">{t('admin.reports.suspended_clients')}</span>
              <span className="text-lg font-bold text-red-600">{stats?.suspendedUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-855 uppercase tracking-wider border-b border-stone-100 pb-2">
            {t('admin.reports.bookings_by_status')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/reservations?status=2" className="flex justify-between items-center p-2.5 bg-stone-50 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors">
              <span>{t('admin.reports.confirmed')}</span>
              <span className="font-bold text-stone-900">{stats?.confirmedBookings}</span>
            </Link>
            <Link to="/admin/reservations?status=3" className="flex justify-between items-center p-2.5 bg-stone-50 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors">
              <span>{t('admin.reports.finished')}</span>
              <span className="font-bold text-stone-900">{stats?.finishedBookings}</span>
            </Link>
            <Link to="/admin/reservations?status=0" className="flex justify-between items-center p-2.5 bg-stone-50 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors">
              <span>{t('admin.reports.pending')}</span>
              <span className="font-bold text-stone-900">{stats?.pendingBookings}</span>
            </Link>
            <Link to="/admin/reservations?status=1" className="flex justify-between items-center p-2.5 bg-stone-50 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors">
              <span>{t('admin.reports.cancelled')}</span>
              <span className="font-bold text-stone-900">{stats?.cancelledBookings}</span>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-855 uppercase tracking-wider border-b border-stone-100 pb-2">
            {t('admin.reports.popular_spaces')}
          </h3>
          {stats?.popularSpaces && stats.popularSpaces.length > 0 ? (
            <ul className="divide-y divide-stone-100">
              {stats.popularSpaces.map((space, index) => (
                <li key={space.name} className="py-2.5 flex justify-between items-center text-xs font-semibold text-stone-700">
                  <Link to={`/spaces/${space.id}`} className="hover:text-primary-2 hover:underline font-bold">
                    {index + 1}. {space.name}
                  </Link>
                  <span className="text-stone-400">{space.count} {t('nav.reservations').toLowerCase()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-stone-400 text-center py-4">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
