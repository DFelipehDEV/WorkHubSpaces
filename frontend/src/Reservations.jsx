import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function Reservations() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const statusConfig = {
    0: { label: t('reservations.status.pending', 'Pending'), color: 'bg-yellow-100 text-yellow-800', Icon: Clock },
    1: { label: t('reservations.status.cancelled', 'Cancelled'), color: 'bg-red-100 text-red-800', Icon: XCircle },
    2: { label: t('reservations.status.confirmed', 'Confirmed'), color: 'bg-green-100 text-green-800', Icon: CheckCircle },
    3: { label: t('reservations.status.finished', 'Finished'), color: 'bg-stone-200 text-stone-800', Icon: Calendar }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch reservations');

        const data = await response.json();

        setReservations(data);
      } catch (err) {
        console.error(err);
        setError(t('reservations.error_fetching', 'Could not load reservations.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [t]);

  const handleCancel = async (id) => {
    if (!window.confirm(t('reservations.confirm_cancel', 'Are you sure you want to cancel this reservation?'))) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations/${id}/cancel`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to cancel');
      }

      setReservations(prev =>
        prev.map(res => res._id === id ? { ...res, status: 1 } : res)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="px-4 md:px-12 lg:px-48 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">{t('nav.reservations', 'Reservations')}</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-stone-200 text-center">
          <Calendar className="mx-auto text-stone-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-stone-900">{t('reservations.no_data', 'No reservations found')}</h3>
          <p className="text-stone-500 mt-1">{t('reservations.no_data_desc', 'You have not made any bookings yet.')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => {
            const { label, color, Icon } = statusConfig[reservation.status];

            return (
              <div key={reservation._id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-800">
                      {reservation.spaceId !== null ? (
                        <Link
                          to={`/spaces/${reservation.spaceId._id}`}
                          className="text-stone-900 hover:text-primary-2 underline hover:decoration-primary-2 font-bold"
                        >
                          {reservation.spaceId.name}
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-stone-500">
                          {typeof reservation.spaceId === 'string' ? reservation.spaceId.substring(0, 8) + '...' : 'N/A'}
                        </span>
                      )}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${color}`}>
                      <Icon size={14} />
                      {label}
                    </span>
                  </div>

                  <div className="text-sm text-stone-600 space-y-1 font-mono">
                    <p><strong>{t('reservations.start', 'Start')}:</strong> {formatDate(reservation.startDate)}</p>
                    <p><strong>{t('reservations.end', 'End')}:</strong> {formatDate(reservation.endDate)}</p>
                    {reservation.cost && (
                      <p><strong>{t('reservations.cost', 'Cost')}: </strong>{reservation.cost.toFixed(2)}€</p>
                    )}
                  </div>
                </div>

                {(reservation.status === 0 || reservation.status === 2) && (
                  <button
                    onClick={() => handleCancel(reservation._id)}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 cursor-pointer text-sm font-medium w-full md:w-auto"
                  >
                    {t('reservations.cancel_btn', 'Cancel Booking')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Reservations;