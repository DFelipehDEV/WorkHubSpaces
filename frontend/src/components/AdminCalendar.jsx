import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

function AdminCalendar({ reservations, spaces, users }) {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getDayReservations = (year, month, day) => {
    const targetDate = new Date(year, month, day);
    targetDate.setHours(0, 0, 0, 0);

    return reservations.filter(res => {
      const start = new Date(res.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(res.endDate);
      end.setHours(23, 59, 59, 999);

      return targetDate >= start && targetDate <= end;
    });
  };

  const formatMonthName = (monthIndex, year) => {
    const date = new Date(year, monthIndex, 1);
    return date.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const selectedDateObject = selectedDay ? new Date(currentYear, currentMonth, selectedDay) : null;
  const selectedDayReservations = selectedDay ? getDayReservations(currentYear, currentMonth, selectedDay) : [];

  const statusLabel = {
    0: t('reservations.status.pending'),
    1: t('reservations.status.cancelled'),
    2: t('reservations.status.confirmed'),
    3: t('reservations.status.finished'),
  };

  const statusBorderColors = {
    0: 'border-l-amber-500',
    1: 'border-l-red-500',
    2: 'border-l-emerald-500',
    3: 'border-l-stone-400',
  };

  const statusBadgeColors = {
    0: 'bg-amber-50 text-amber-700 border-amber-100',
    1: 'bg-red-50 text-red-700 border-red-100',
    2: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    3: 'bg-stone-50 text-stone-700 border-stone-100',
  };

  const formatResTime = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1 && start.getHours() !== 0) {
      const sh = String(start.getHours()).padStart(2, '0');
      const sm = String(start.getMinutes()).padStart(2, '0');
      const eh = String(end.getHours()).padStart(2, '0');
      const em = String(end.getMinutes()).padStart(2, '0');
      return `${sh}:${sm} - ${eh}:${em}`;
    }
    return t('admin.calendar.all_day');
  };

  return (
    <div className="mt-8 border-t border-stone-200 pt-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <CalendarIcon size={22} className="text-stone-700" />
        {t('admin.calendar.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-stone-855 capitalize">
              {formatMonthName(currentMonth, currentYear)}
            </h2>
            <div className="flex gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 transition-colors cursor-pointer"
                aria-label={t('admin.calendar.prev_month')}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 transition-colors cursor-pointer"
                aria-label={t('admin.calendar.next_month')}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-1 text-center font-bold text-[10px] text-stone-450 uppercase tracking-wider mb-2" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
            <span>{t('admin.calendar.day_mon')}</span>
            <span>{t('admin.calendar.day_tue')}</span>
            <span>{t('admin.calendar.day_wed')}</span>
            <span>{t('admin.calendar.day_thu')}</span>
            <span>{t('admin.calendar.day_fri')}</span>
            <span>{t('admin.calendar.day_sat')}</span>
            <span>{t('admin.calendar.day_sun')}</span>
          </div>

          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square bg-stone-50/50 rounded-xl"></div>;
              }

              const dayReservations = getDayReservations(currentYear, currentMonth, day);
              const isSelected = selectedDay === day;
              const isToday = isSameDay(today, new Date(currentYear, currentMonth, day));

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square relative flex flex-col justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary-2 bg-primary/5 ring-1 ring-primary-2'
                      : isToday
                      ? 'border-stone-400 bg-stone-50/60'
                      : 'border-stone-100 bg-white hover:border-stone-300'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary-2' : isToday ? 'text-stone-900' : 'text-stone-700'}`}>
                    {day}
                  </span>
                  
                  <div className="flex flex-wrap justify-center gap-0.5 mt-auto max-w-full">
                    {dayReservations.slice(0, 4).map(res => (
                      <span
                        key={res._id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          res.status === 0 ? 'bg-amber-500' :
                          res.status === 2 ? 'bg-emerald-500' :
                          res.status === 3 ? 'bg-stone-400' :
                          'bg-red-500'
                        }`}
                      />
                    ))}
                    {dayReservations.length > 4 && (
                      <span className="text-[8px] font-bold text-stone-400 leading-none">+</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-stone-855 uppercase tracking-wider border-b border-stone-100 pb-3 mb-4">
            {selectedDateObject ? (
              t('admin.calendar.details_title', { date: selectedDateObject.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }) })
            ) : (
              t('admin.calendar.details_title', { date: '' })
            )}
          </h3>

          <div className="flex-1 overflow-y-auto max-h-100 space-y-3">
            {!selectedDay ? (
              <p className="text-xs text-stone-400 text-center py-10 font-medium">
                {t('admin.calendar.select_day')}
              </p>
            ) : selectedDayReservations.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-10 font-medium">
                {t('admin.calendar.no_bookings_day')}
              </p>
            ) : (
              selectedDayReservations.map(res => {
                const client = users.find(u => u._id === res.reservedBy);
                const space = spaces.find(s => s._id === (res.spaceId?._id || res.spaceId));
                return (
                  <div 
                    key={res._id} 
                    className={`p-3 bg-white border border-stone-150 rounded-xl border-l-4 ${statusBorderColors[res.status]} space-y-2`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-stone-850">
                        {space?.name || 'N/A'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${statusBadgeColors[res.status]}`}>
                        {statusLabel[res.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-stone-450 font-mono">
                      <Clock size={12} />
                      <span>{formatResTime(res.startDate, res.endDate)}</span>
                    </div>

                    <div className="text-[10px] border-t border-stone-100 pt-2 mt-1">
                      <div className="font-semibold text-stone-600">{client?.name || 'N/A'}</div>
                      <div className="text-[9px] text-stone-400 font-mono">{client?.email || res.reservedBy}</div>
                      {res.obs && (
                        <div className="text-[9px] text-stone-500 italic mt-1 bg-stone-50 p-1.5 rounded border border-stone-100">
                          "{res.obs}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCalendar;
