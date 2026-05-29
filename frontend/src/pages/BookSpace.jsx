import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar as CalendarIcon, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

function BookSpace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [extraServices, setExtraServices] = useState([]);
  const [selectedExtraServices, setSelectedExtraServices] = useState([]);
  const [allEquipments, setAllEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [obs, setObs] = useState('');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 1);

  const [dateRange, setDateRange] = useState([{
    startDate: today,
    endDate: futureDate,
    key: 'selection'
  }]);
  const [showCalendar, setShowCalendar] = useState(false);

  const [bookingMode, setBookingMode] = useState('hourly'); // 'hourly' or 'daily'
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  // Time slots for hourly booking
  const timeSlots = [];
  for (let h = 0; h <= 24; h++) {
    const hh = String(h).padStart(2, '0');
    timeSlots.push(`${hh}:00`);
    if (h < 24) {
      timeSlots.push(`${hh}:30`);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch space details
    fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch space details");
        return res.json();
      })
      .then((json) => {
        setSpace(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch extra services
    fetch(`${import.meta.env.VITE_BACKEND_URL}/extraservices`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch extra services");
        return res.json();
      })
      .then((json) => {
        setExtraServices(json.filter(service => service.available));
      })
      .catch((err) => {
        console.error("Error fetching extra services:", err);
      });

    // Fetch equipment
    fetch(`${import.meta.env.VITE_BACKEND_URL}/equipments`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipments");
        return res.json();
      })
      .then((json) => {
        setAllEquipments(json);
      })
      .catch((err) => {
        console.error("Error fetching equipments:", err);
      });
  }, [id, isAuthenticated, navigate]);

  const handleSelect = (item) => {
    setDateRange([item.selection]);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateDays = () => {
    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const calculateHours = () => {
    if (bookingMode !== 'hourly') return 0;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const diff = (endH + endM / 60) - (startH + startM / 60);
    return Math.max(0, diff);
  };

  const hours = calculateHours();
  const days = calculateDays();
  const hourlyRate = space ? space.pricePerHour : 0;
  const dailyPrice = hourlyRate * 24;

  const spaceCost = bookingMode === 'hourly'
    ? hours * hourlyRate
    : days * dailyPrice;

  const extraServicesCost = extraServices
    .filter(s => selectedExtraServices.includes(s._id))
    .reduce((sum, s) => sum + s.price, 0);

  const equipmentsCost = allEquipments
    .filter(eq => selectedEquipments.includes(eq._id))
    .reduce((sum, eq) => sum + eq.price, 0);

  const totalCost = spaceCost + extraServicesCost + equipmentsCost;

  const handleToggleExtraService = (id) => {
    setSelectedExtraServices(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleEquipment = (id) => {
    setSelectedEquipments(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBook = async () => {
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      let finalStartDate = dateRange[0].startDate;
      let finalEndDate = dateRange[0].endDate;

      if (bookingMode === 'hourly') {
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        
        finalStartDate = new Date(dateRange[0].startDate);
        finalStartDate.setHours(startH, startM, 0, 0);
        
        finalEndDate = new Date(dateRange[0].startDate);
        finalEndDate.setHours(endH, endM, 0, 0);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId: space._id,
          startDate: finalStartDate,
          endDate: finalEndDate,
          obs: obs,
          extraServices: selectedExtraServices,
          equipments: selectedEquipments,
          cost: totalCost,
          active: true
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to book the space');
      }

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/reservations');
      }, 2000);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">{t('space.notfound', 'Space Not Found')}</h2>
        <p className="text-stone-500 mb-6">{error || t('space.notfound_desc', 'The requested space does not exist.')}</p>
        <Link to="/spaces" className="px-5 py-2.5 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800">{t('goback', 'Go Back')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to={`/spaces/${space._id}`} className="flex items-center gap-1.5 mb-6 text-stone-500 hover:text-primary-2 w-fit">
        <ChevronLeft size={16} />
        <span className="text-sm font-medium">{t('booking.goback_to_space', 'Go Back to Space details')}</span>
      </Link>

      {bookingSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={24} className="text-green-600 shrink-0" />
          <div>
            <p className="font-bold">{t('booking.success_title', 'Booking Successful!')}</p>
            <p className="text-sm">{t('booking.success_desc', 'Your reservation was created. Redirecting to your bookings page...')}</p>
          </div>
        </div>
      )}

      {bookingError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle size={24} className="text-red-600 shrink-0" />
          <div>
            <p className="font-bold">{t('booking.error_title', 'Booking Failed')}</p>
            <p className="text-sm">{bookingError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Reservation Options (Left side / Column 1 & 2) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary/20 text-primary-2 w-7 h-7 rounded-full text-sm font-sans font-bold">1</span>
              {t('booking.step_dates', 'Select Booking Dates')}
            </h2>

            {/* Segmented Booking Mode Selector */}
            <div className="flex border border-stone-200 mb-6 bg-stone-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setBookingMode('hourly');
                  setShowCalendar(false);
                }}
                className={`flex-1 py-2 text-center text-sm font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                  bookingMode === 'hourly'
                    ? 'bg-white text-primary-2 shadow-sm ring-1 ring-stone-200/50'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {t('booking.mode_hourly', 'Hourly Booking')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingMode('daily');
                  setShowCalendar(false);
                }}
                className={`flex-1 py-2 text-center text-sm font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                  bookingMode === 'daily'
                    ? 'bg-white text-primary-2 shadow-sm ring-1 ring-stone-200/50'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {t('booking.mode_daily', 'Daily Booking')}
              </button>
            </div>

            {bookingMode === 'hourly' ? (
              <div className="flex flex-col gap-4">
                {/* Date Picker for Hourly */}
                <div className="flex items-center justify-between p-3 border border-stone-200 rounded-xl bg-stone-50">
                  <div className="flex items-center gap-3">
                    <CalendarIcon size={18} className="text-stone-450" />
                    <div>
                      <p className="text-xs font-semibold text-stone-450 uppercase tracking-wider">{t('booking.select_date', 'Select Date')}</p>
                      <p className="text-sm font-semibold text-stone-800">
                        {formatDate(dateRange[0].startDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="px-4 py-2 bg-primary-2 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {showCalendar ? t('booking.hide_calendar', 'Done') : t('booking.change_dates', 'Choose Date')}
                  </button>
                </div>

                {showCalendar && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden shadow-inner flex justify-center bg-white p-2">
                    <DateRange
                      ranges={dateRange}
                      onChange={(item) => {
                        // Make start and end dates equal for hourly booking
                        const selectedDate = item.selection.startDate;
                        setDateRange([{
                          startDate: selectedDate,
                          endDate: selectedDate,
                          key: 'selection'
                        }]);
                      }}
                      minDate={today}
                      months={1}
                      direction="horizontal"
                    />
                  </div>
                )}

                {/* Hourly Time Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{t('booking.start_time', 'Start Time')}</label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-white rounded-xl px-4 py-3 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 cursor-pointer transition-all duration-200"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{t('booking.end_time', 'End Time')}</label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-white rounded-xl px-4 py-3 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 cursor-pointer transition-all duration-200"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {hours <= 0 && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {t('booking.error_time_relation', 'End time must be after start time.')}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Date Picker for Daily */}
                <div className="flex items-center justify-between p-3 border border-stone-200 rounded-xl bg-stone-50">
                  <div className="flex items-center gap-3">
                    <CalendarIcon size={18} className="text-stone-450" />
                    <div>
                      <p className="text-xs font-semibold text-stone-450 uppercase tracking-wider">{t('booking.dates_selected', 'Dates Selected')}</p>
                      <p className="text-sm font-semibold text-stone-800">
                        {formatDate(dateRange[0].startDate)} — {formatDate(dateRange[0].endDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="px-4 py-2 bg-primary-2 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {showCalendar ? t('booking.hide_calendar', 'Done') : t('booking.change_dates', 'Choose Dates')}
                  </button>
                </div>

                {showCalendar && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden shadow-inner flex justify-center bg-white p-2">
                    <DateRange
                      ranges={dateRange}
                      onChange={handleSelect}
                      minDate={today}
                      months={1}
                      direction="horizontal"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {extraServices.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/20 text-primary-2 w-7 h-7 rounded-full text-sm font-sans font-bold">2</span>
                {t('booking.step_services', 'Extra Services (Optional)')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {extraServices.map((service) => {
                  const isSelected = selectedExtraServices.includes(service._id);
                  return (
                    <button
                      key={service._id}
                      onClick={() => handleToggleExtraService(service._id)}
                      className={`flex items-start justify-between p-4 rounded-xl border text-left transition-all duration-250 cursor-pointer ${
                        isSelected
                          ? 'border-primary-2 bg-primary/5 shadow-sm ring-1 ring-primary-2'
                          : 'border-stone-200 bg-white hover:border-primary-2/40 hover:bg-stone-50/30'
                      }`}
                    >
                      <div className="pr-3">
                        <p className="text-sm font-bold text-stone-850">{service.name}</p>
                        {service.description && (
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{service.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-primary-2 shrink-0 bg-primary/10 px-2 py-0.5 rounded">
                        +{service.price}€
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {allEquipments.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/20 text-primary-2 w-7 h-7 rounded-full text-sm font-sans font-bold">3</span>
                {t('booking.step_equipment', 'Select Equipment (Optional)')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allEquipments.map((eq) => {
                  const isSelected = selectedEquipments.includes(eq._id);
                  return (
                    <button
                      key={eq._id}
                      onClick={() => handleToggleEquipment(eq._id)}
                      className={`flex items-start justify-between p-4 rounded-xl border text-left transition-all duration-250 cursor-pointer ${
                        isSelected
                          ? 'border-primary-2 bg-primary/5 shadow-sm ring-1 ring-primary-2'
                          : 'border-stone-200 bg-white hover:border-primary-2/40 hover:bg-stone-50/30'
                      }`}
                    >
                      <div className="pr-3">
                        <p className="text-sm font-bold text-stone-850">{eq.name}</p>
                        {eq.description && (
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{eq.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-primary-2 shrink-0 bg-primary/10 px-2 py-0.5 rounded">
                        +{eq.price}€
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary/20 text-primary-2 w-7 h-7 rounded-full text-sm font-sans font-bold">4</span>
              {t('booking.step_observations', 'Special Requests (Optional)')}
            </h2>
            <div className="flex items-start gap-3 border border-stone-200 rounded-xl p-3 bg-stone-50">
              <FileText size={20} className="text-stone-400 mt-1 shrink-0" />
              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                rows={3}
                placeholder={t('space.observations_placeholder', 'Do you need specific seating, visual presentation gear, or specific layout configurations? Let us know.')}
                className="w-full text-sm text-stone-850 placeholder-stone-400 bg-transparent outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-3">{t('booking.summary_title', 'Booking Summary')}</h3>
            <div className="bg-stone-50 rounded-xl overflow-hidden border border-stone-100 p-3">
              {space.images && space.images.length > 0 && (
                <img
                  src={space.images[0]}
                  alt={space.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h4 className="font-bold text-stone-850">{space.name}</h4>
              <p className="text-xs text-stone-500 mt-1">{space.location}</p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex justify-between text-sm text-stone-600">
              <span>{t('booking.duration', 'Duration')}</span>
              <span className="font-semibold text-stone-900 text-right">
                {bookingMode === 'hourly' ? (
                  `${hours} ${hours === 1 ? t('space.hour', 'hour') : t('space.hours', 'hours')}`
                ) : (
                  `${days} ${days === 1 ? t('space.day', 'day') : t('space.days', 'days')}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm text-stone-600">
              <span>{t('booking.space_cost', 'Space Rental')}</span>
              <span className="font-mono">{spaceCost.toFixed(2)}€</span>
            </div>

            {selectedExtraServices.length > 0 && (
              <div className="flex justify-between text-sm text-stone-600">
                <span>{t('booking.services_total', 'Extra Services')}</span>
                <span className="font-mono">+{extraServicesCost.toFixed(2)}€</span>
              </div>
            )}

            {selectedEquipments.length > 0 && (
              <div className="flex justify-between text-sm text-stone-600">
                <span>{t('booking.equipments_total', 'Equipment Rental')}</span>
                <span className="font-mono">+{equipmentsCost.toFixed(2)}€</span>
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-150">
              <span>{t('booking.total_cost', 'Total Price')}</span>
              <span className="font-mono text-stone-950 text-lg">{totalCost.toFixed(2)}€</span>
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={bookingLoading || bookingSuccess || (bookingMode === 'hourly' && hours <= 0)}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              bookingLoading || bookingSuccess || (bookingMode === 'hourly' && hours <= 0)
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-primary-2 text-white hover:opacity-90 transition-opacity active:scale-[0.98]'
            }`}
          >
            {bookingLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              t('booking.confirm_btn', 'Confirm and Book')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookSpace;
