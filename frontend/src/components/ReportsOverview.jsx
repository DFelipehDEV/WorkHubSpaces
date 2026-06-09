import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ReportsOverview({ stats }) {
  const { t } = useTranslation();

  return (
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
  );
}

export default ReportsOverview;
