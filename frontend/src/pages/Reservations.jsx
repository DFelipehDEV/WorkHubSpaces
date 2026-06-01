import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle } from 'lucide-react';
import ReservationCard from '../components/ReservationCard';
import Pagination from '../components/Pagination';

function Reservations() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [reservations.length, totalPages, currentPage]);

  const displayedReservations = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch reservations');

        const data = await response.json();

        const activeBookings = data.filter(res => res.status == 0 || res.status == 2);
        setReservations(activeBookings);
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

      setReservations(prev => prev.filter(res => res._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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
        <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center shadow-sm max-w-2xl mx-auto">
          <Calendar className="mx-auto text-stone-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-stone-800">{t('reservations.no_data', 'No reservations found')}</h3>
          <p className="text-stone-500 mt-1.5 text-sm">{t('reservations.no_data_desc', 'You have not made any bookings yet.')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReservations.map((reservation) => (
              <ReservationCard
                key={reservation._id}
                reservation={reservation}
                onCancel={handleCancel}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default Reservations;
