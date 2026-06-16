import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from './Button';

function ReservationCard({ reservation, onCancel }) {
  const { t } = useTranslation();

  const statusConfig = {
    0: { label: t('reservations.status.pending'), color: 'bg-yellow-100 text-yellow-800' },
    1: { label: t('reservations.status.cancelled'), color: 'bg-red-50 text-red-700 border border-red-100' },
    2: { label: t('reservations.status.confirmed'), color: 'bg-green-100 text-green-800' },
    3: { label: t('reservations.status.finished'), color: 'bg-stone-100 text-stone-700 border border-stone-200/60' }
  };

  const { label, color } = statusConfig[reservation.status] || {
    label: 'N/A',
    color: 'bg-stone-100 text-stone-700'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(hasTime ? { hour: '2-digit', minute: '2-digit' } : {})
    };
    return date.toLocaleDateString(undefined, options);
  };

  const isCancelable = reservation.status == 0 || reservation.status == 2;

  const spaceId = reservation.spaceId?._id;
  const spaceName = reservation.spaceId?.name || "?";

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md hover:border-stone-300 transition-all duration-200">
      <div className="space-y-3 grow">
        <div className="flex justify-between items-start gap-2">
          <span className="font-bold text-stone-850 line-clamp-1 text-base">
            <Link
              to={`/spaces/${spaceId}`}
              className="hover:text-primary-2 underline hover:decoration-primary-2"
            >
              {spaceName}
            </Link>
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 uppercase tracking-wider ${color}`}>
            {label}
          </span>
        </div>

        <div className="text-xs text-stone-600 space-y-2 font-mono bg-stone-50/75 p-3 rounded-xl border border-stone-100">
          <div>
            <strong className="text-stone-400 uppercase text-[9px] tracking-wider block mb-0.5">{t('reservations.start')}</strong> 
            <span>{formatDate(reservation.startDate)}</span>
          </div>
          <div>
            <strong className="text-stone-400 uppercase text-[9px] tracking-wider block mb-0.5">{t('reservations.end')}</strong> 
            <span>{formatDate(reservation.endDate)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-mono pt-1">
          <span className="text-stone-400 uppercase text-[9px] tracking-wider">{t('reservations.cost')}</span>
          <span className="font-bold text-stone-900 text-sm">{(reservation.cost ?? 0).toFixed(2)}€</span>
        </div>

        <div className="pt-2 border-t border-stone-100">
          <p className="text-[11px] text-stone-500 line-clamp-2 italic leading-relaxed">
            &ldquo;{reservation.obs}&rdquo;
          </p>
        </div>
      </div>

      {isCancelable && (
        <Button
          onClick={() => onCancel(reservation._id)}
          variant="danger-outline"
          size="small"
          className="w-full"
        >
          {t('reservations.cancel_btn')}
        </Button>
      )}
    </div>
  );
}

export default ReservationCard;
