import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTitle from '../components/PageTitle';
import ReportsOverview from '../components/ReportsOverview';
import AdminCalendar from '../components/AdminCalendar';

function AdminReports() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, sRes, rRes, uRes] = await Promise.all([
        fetch(`${API_URL}/admin/reports-stats`, { credentials: 'include' }).then(res => {
          if (!res.ok) throw new Error(t('admin.reports.stats_failed'));
          return res.json();
        }),
        fetch(`${API_URL}/spaces`, { credentials: 'include' }).then(res => {
          if (!res.ok) throw new Error(t('admin.reports.stats_failed'));
          return res.json();
        }),
        fetch(`${API_URL}/reservations`, { credentials: 'include' }).then(res => {
          if (!res.ok) throw new Error(t('admin.reports.stats_failed'));
          return res.json();
        }),
        fetch(`${API_URL}/users`, { credentials: 'include' }).then(res => {
          if (!res.ok) throw new Error(t('admin.reports.stats_failed'));
          return res.json();
        })
      ]);
      setStats(statsRes);
      setSpaces(Array.isArray(sRes) ? sRes : []);
      setReservations(Array.isArray(rRes) ? rRes : []);
      setUsers(Array.isArray(uRes) ? uRes : []);
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

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

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
      <PageTitle className="!text-2xl mb-6">{t('admin.reports.title')}</PageTitle>

      <ReportsOverview stats={stats} />
      
      <AdminCalendar 
        reservations={reservations} 
        spaces={spaces} 
        users={users} 
      />
    </div>
  );
}

export default AdminReports;
