import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Star, ChevronLeft, User, Check, Package, Calendar as CalendarIcon, FileText, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

function Space() {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {t} = useTranslation();

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [extraServices, setExtraServices] = useState([]);
  const [selectedExtraServices, setSelectedExtraServices] = useState([]);
  const [allEquipments, setAllEquipments] = useState([]);
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
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showAllEquipments, setShowAllEquipments] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
  }, []);

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

  const days = calculateDays();
  const dailyPrice = space ? space.pricePerHour * 24 : 0;
  const spaceCost = days * dailyPrice;
  
  const extraServicesCost = extraServices
    .filter(s => selectedExtraServices.includes(s._id))
    .reduce((sum, s) => sum + s.price, 0);

  const totalCost = spaceCost + extraServicesCost;

  const handleToggleExtraService = (id) => {
    setSelectedExtraServices(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getEquipmentName = (eqId) => {
    const found = allEquipments.find(eq => eq._id === eqId);
    return found ? found.name : eqId;
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId: space._id,
          startDate: dateRange[0].startDate,
          endDate: dateRange[0].endDate,
          obs: obs,
          extraServices: selectedExtraServices,
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch space");
        return res.json();
      })
      .then((json) => {
        setSpace(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navigation />
        <main className="grow flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navigation />
        <div className="flex flex-col items-center justify-center grow">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">{t('space.notfound')}</h2>
          <Link to="/spaces" className="px-4 py-2 bg-stone-800 text-white rounded-md">{t('goback')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col overflow-scroll">
      <Navigation />

      <main className='grow px-8 lg:px-48 py-8'>
        <Link to="/spaces" className="flex mb-6 text-stone-600 hover:text-stone-900 transition-colors">
          <ChevronLeft /> {t('goback')}
        </Link>

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
          {space.images && space.images.length > 0 ? (
            <img
              src={space.images[0]}
              alt={space.name}
              className='w-full h-96 object-cover'
            />
          ) : (
            <div className="w-full h-96 bg-stone-200 flex items-center justify-center text-stone-500">
              {t('noimg')}
            </div>
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className='text-3xl font-bold text-stone-800 mb-2'>{space.name}</h1>
                <div className='flex gap-2 md:gap-8'>
                    <div className='flex md:gap-2'>
                      <Check className={space.available ? "text-green-600" : "text-red-600"}/>
                      <p className={space.available ? "text-green-600" : "text-red-600"}>
                        {space.available ? t('space.available') : t('space.unavailable')}
                      </p>
                    </div>
                    <div>
                      <div className='flex md:gap-2'>
                        <User/>
                        <p className="text-stone-600">{space.capacity} {t('space.people')}</p>
                      </div>
                    </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono text-stone-800">{space.pricePerHour}€/{t('space.hour')}</p>
                <p className='text-xl font-mono text-stone-800'>{space.pricePerHour * 24}€/{t('space.day')}</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-3 mb-8 relative z-30 overflow-visible transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full lg:w-auto">
                  
                  <div className="relative shrink-0">
                    <button
                      onClick={() => {
                        setShowCalendar(!showCalendar);
                        setShowServicesDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium cursor-pointer"
                    >
                      <CalendarIcon size={16} className="text-stone-400" />
                      <span>{formatDate(dateRange[0].startDate)} — {formatDate(dateRange[0].endDate)}</span>
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">{days} {days === 1 ? t('space.day', 'day') : t('space.days', 'days')}</span>
                    </button>

                    {showCalendar && (
                      <div className="absolute z-50 top-full mt-2 left-0 shadow-xl border border-stone-200 bg-white rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

                  <div className="h-5 w-px bg-stone-200 hidden md:block"></div>

                  <div className="relative shrink-0">
                    <button
                      onClick={() => {
                        setShowServicesDropdown(!showServicesDropdown);
                        setShowCalendar(false);
                      }}
                      className="w-full flex items-center gap-2.5 text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium cursor-pointer"
                    >
                      <Plus size={16} className="text-stone-400" />
                      <span>
                        {selectedExtraServices.length === 0
                          ? t('space.no_extras', 'Add Services')
                          : `${selectedExtraServices.length} selected`}
                      </span>
                      {extraServicesCost > 0 && (
                        <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                          +{extraServicesCost.toFixed(2)}€
                        </span>
                      )}
                    </button>

                    {showServicesDropdown && (
                      <div className="absolute z-50 top-full mt-2 left-0 shadow-xl border border-stone-200 bg-white rounded-xl p-3 w-72 lg:w-80 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {extraServices.length > 0 ? (
                          <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                            {extraServices.map((service) => {
                              const isSelected = selectedExtraServices.includes(service._id);
                              return (
                                <button
                                  key={service._id}
                                  onClick={() => handleToggleExtraService(service._id)}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                                    isSelected
                                      ? 'border-stone-950 bg-stone-50'
                                      : 'border-transparent bg-white hover:bg-stone-50'
                                  }`}
                                >
                                  <div className="pr-2">
                                    <div className="text-xs font-semibold text-stone-800">{service.name}</div>
                                    {service.description && (
                                      <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{service.description}</div>
                                    )}
                                  </div>
                                  <div className="text-xs font-mono text-stone-900">
                                    +{service.price}€
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-stone-400 text-xs py-2">{t('space.no_extras_available', 'No extra services available.')}</p>
                        )}
                        <div className="pt-2 border-t border-stone-100 flex justify-end">
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-5 w-px bg-stone-200 hidden md:block"></div>

                  <div className="w-full md:w-auto flex-grow flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-stone-50/50 transition-colors">
                    <FileText size={16} className="text-stone-400 shrink-0" />
                    <input
                      type="text"
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      placeholder={t('space.observations_placeholder_short', 'Any special requests?')}
                      className="w-full text-sm text-stone-850 placeholder-stone-400 bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-100">
                  <div className="text-left lg:text-right shrink-0">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">{t('space.total', 'Total Cost')}</span>
                    <span className="text-base font-mono text-stone-905">{totalCost.toFixed(2)}€</span>
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={handleBook}
                      disabled={bookingLoading || bookingSuccess}
                      className={`py-2 px-5 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        bookingLoading || bookingSuccess
                          ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98]'
                      }`}
                    >
                      {bookingLoading ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      ) : (
                        t('space.book_btn_short', 'Book Now')
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="py-2 px-5 bg-primary-2 hover:bg-primary-2/95 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center cursor-pointer text-center"
                    >
                      {t('space.login_to_book', 'Login')}
                    </Link>
                  )}
                </div>
              </div>

              {(bookingSuccess || bookingError) && (
                <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col gap-2">
                  {bookingSuccess && (
                    <div className="bg-green-50 border border-green-200/50 text-green-800 rounded-lg p-3 flex gap-2.5 items-center">
                      <CheckCircle2 className="text-green-600 shrink-0" size={18} />
                      <div>
                        <div className="font-bold text-xs">{t('space.booking_success_title', 'Booking Created!')}</div>
                        <div className="text-[10px] text-green-700 mt-0.5">{t('space.booking_success_desc', 'Redirecting to your dashboard...')}</div>
                      </div>
                    </div>
                  )}

                  {bookingError && (
                    <div className="bg-red-50 border border-red-200/50 text-red-800 rounded-lg p-3 flex gap-2.5 items-center">
                      <AlertCircle className="text-red-600 shrink-0" size={16} />
                      <div className="text-[11px] font-semibold leading-relaxed">{bookingError}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-100 pt-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {space.description}
                  </p>
                </div>
              </div>

              <div className="md:col-span-1 space-y-6">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="text-stone-600" size={16} />
                    <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">{t('space.equipments', 'Equipments')}</h3>
                  </div>

                  {space.equipments && space.equipments.length > 0 ? (
                    <div>
                      <div className="flex flex-wrap gap-2 transition-all duration-350">
                        {space.equipments
                          .slice(0, showAllEquipments ? space.equipments.length : 3)
                          .map((eq, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center bg-white border border-stone-200/60 text-stone-700 text-xs px-2.5 py-1 rounded-md font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            >
                              {getEquipmentName(eq)}
                            </span>
                          ))}
                      </div>
                      
                      {space.equipments && space.equipments.length > 3 && (
                        <button
                          onClick={() => setShowAllEquipments(!showAllEquipments)}
                          className="mt-3 text-[10px] font-bold text-stone-500 hover:text-stone-800 uppercase tracking-wider flex items-center gap-0.5 cursor-pointer outline-none transition-colors"
                        >
                          {showAllEquipments ? t('common.show_less', 'Show Less') : `${t('common.show_all', 'Show All')} (${space.equipments.length})`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-xs">{t('space.no_equipments', 'No equipment list specified.')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-stone-100 pt-6">
              <h3 className="text-xl font-semibold text-stone-800 mb-4">{t('space.reviews')}</h3>
              {space.reviews && space.reviews.length > 0 ? (
                <div className="space-y-4">
                  {space.reviews.map((review, i) => (
                    <div key={i} className="bg-stone-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-stone-800">{review.user}</span>
                        <div className='flex md:gap-2'>
                          <Star className='text-primary-2'/>
                          <span className="text-primary-2 font-mono">{review.rating}/10</span>
                        </div>
                      </div>
                      <p className="text-stone-600">{review.review}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500">{t('space.no_reviews')}</p>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Space;