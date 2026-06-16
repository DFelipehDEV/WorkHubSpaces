import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle } from 'lucide-react';
import ReservationCard from '../components/ReservationCard';
import Pagination from '../components/Pagination';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';

function History() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          paginated: 'true',
        });
        params.append('status', 1); // Cancelled
        params.append('status', 3); // Finished

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations?${params.toString()}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch reservations');

        const result = await response.json();
        
        setReservations(result.data || []);
        setTotalPages(result.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError(t('reservations.error_fetching'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [currentPage, t]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <PageTitle className="mb-6">{t('nav.history')}</PageTitle>

      {isLoading ? (
        <Spinner fullPage />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center shadow-sm max-w-2xl mx-auto">
          <Calendar className="mx-auto text-stone-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-stone-800">{t('reservations.no_history')}</h3>
          <p className="text-stone-500 mt-1.5 text-sm">{t('reservations.no_history_desc')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} />
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

export default History;
