import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle } from 'lucide-react';
import ReservationCard from '../components/ReservationCard';
import Pagination from '../components/Pagination';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import useSWR from 'swr';
import { fetcherWithAuth } from '../utils/fetcher';

function Reservations() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const params = new URLSearchParams({
    page: currentPage,
    limit: itemsPerPage,
    paginated: 'true',
  });
  params.append('status', 0); // Pending
  params.append('status', 2); // Confirmed

  const { data: result, error, isLoading, mutate } = useSWR(`/reservations?${params.toString()}`, fetcherWithAuth);

  const reservations = result?.data || [];
  const totalPages = result?.totalPages || 1;

  const handleCancel = async (id) => {
    if (!window.confirm(t('reservations.confirm_cancel'))) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations/${id}/cancel`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to cancel');
      }

      mutate({
        ...result,
        data: reservations.filter(res => res._id !== id)
      }, false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <PageTitle className="mb-6">{t('nav.reservations')}</PageTitle>

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
          <h3 className="text-lg font-bold text-stone-800">{t('reservations.no_data')}</h3>
          <p className="text-stone-500 mt-1.5 text-sm">{t('reservations.no_data_desc')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
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
