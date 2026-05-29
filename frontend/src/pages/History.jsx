import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle } from 'lucide-react';
import ReservationCard from '../components/ReservationCard';

function History() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch reservations');

        const data = await response.json();
        
        // Filter only Cancelled (1) and Finished (3) bookings
        const pastBookings = data.filter(res => res.status === 1 || res.status === 3);
        setReservations(pastBookings);
      } catch (err) {
        console.error(err);
        setError(t('reservations.error_fetching', 'Could not load booking history.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [t]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">{t('nav.history', 'Booking History')}</h1>

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
        <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center shadow-sm max-w-2xl mx-auto">
          <Calendar className="mx-auto text-stone-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-stone-800">{t('reservations.no_history', 'No past bookings found')}</h3>
          <p className="text-stone-500 mt-1.5 text-sm">{t('reservations.no_history_desc', 'Your completed and cancelled reservations will appear here.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation._id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
