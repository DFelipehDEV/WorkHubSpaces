import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { enUS, pt } from 'date-fns/locale';
import { Star, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/Pagination';
import SpaceCard from '../components/SpaceCard';
import Spinner from '../components/Spinner';
import useSWR from 'swr';

function Spaces() {
  const { isAuthenticated, user } = useAuth();
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [sortBy, setSortBy] = useState("-popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || i18n.resolvedLanguage || 'en';
  const calendarLocale = currentLang.startsWith('pt') ? pt : enUS;
  
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 2);

  const [dateRange, setDateRange] = useState([{
    startDate: today,
    endDate: futureDate,
    key: 'selection'
  }]);

  // Debounce search query changes to prevent over-fetching
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset to first page when any filters, search, or sorting change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedType, selectedCity, dateRange, sortBy, debouncedSearchQuery]);

  const params = new URLSearchParams();
  if (selectedType) params.append('type', selectedType);
  if (selectedCity) params.append('city', selectedCity);
  if (sortBy) params.append('sort', sortBy);
  if (debouncedSearchQuery) params.append('name', debouncedSearchQuery);
  if (dateRange[0]?.startDate && dateRange[0]?.endDate) {
    params.append('startDate', dateRange[0].startDate.toISOString());
    params.append('endDate', dateRange[0].endDate.toISOString());
  }

  const fetcher = (url) => fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`).then(res => res.json());
  const { data: spacesData, isValidating } = useSWR(`/spaces?${params.toString()}`, fetcher, { keepPreviousData: true, revalidateOnFocus: false });
  const { data: spaceTypesData } = useSWR('/spacetypes', fetcher);
  const { data: citiesData } = useSWR('/cities', fetcher);

  const spaces = Array.isArray(spacesData) ? spacesData : [];
  const spaceTypes = Array.isArray(spaceTypesData) ? spaceTypesData : [];
  const cities = citiesData;

  const handleSelect = (item) => {
    setDateRange([item.selection]);
  }; 

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  const filteredSpaces = spaces.filter(space => {
    if (!space.available) return false;
    if (showFavoritesOnly) {
      return space.favoritedBy && space.favoritedBy.includes(user?._id);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredSpaces.length / itemsPerPage);
  const displayedSpaces = filteredSpaces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className='max-w-350 mx-auto w-full px-4 sm:px-6 pt-6 pb-2'>
        <div className='flex flex-col xl:flex-row justify-between gap-4 mb-4 items-start xl:items-center bg-white p-3 rounded-2xl border border-stone-200 shadow-sm'>
          <div className="relative w-full xl:w-64 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 rounded-xl pl-9 pr-3 py-2 border border-transparent focus:bg-white focus:border-primary-2 focus:ring-2 focus:ring-primary-2/20 text-sm text-stone-700 placeholder-stone-400 outline-none transition-all duration-300 h-10.5"
            />
          </div>

          <div className='flex flex-wrap xl:flex-nowrap w-full xl:w-auto justify-start xl:justify-end gap-3 items-center'>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setShowFavoritesOnly(!showFavoritesOnly);
                  setCurrentPage(1);
                }}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 h-10.5 ${
                  showFavoritesOnly
                    ? 'bg-primary-2 text-white shadow-md shadow-primary-2/20 hover:bg-primary-2/90'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-white hover:border-stone-300'
                }`}
              >
                <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white text-white' : 'text-stone-400'}`} />
                {showFavoritesOnly ? t('space.all_spaces') : t('space.favorites_only')}
              </button>
            )}

            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="cursor-pointer w-full sm:w-auto bg-stone-50 rounded-xl px-4 py-2 border border-stone-200 text-sm font-medium text-stone-700 hover:bg-white hover:border-primary-2 hover:text-primary-2 transition-all duration-200 h-10.5"
              >
                {formatDate(dateRange[0].startDate)} - {formatDate(dateRange[0].endDate)}
              </button>

              {showCalendar && (
                <div className="absolute z-50 top-full mt-2 right-0 sm:right-auto sm:left-0 shadow-lg border border-stone-200 bg-white rounded-md overflow-hidden">
                  <DateRange
                    ranges={dateRange}
                    onChange={handleSelect}
                    months={1}
                    direction="horizontal"
                    locale={calendarLocale}
                    key={calendarLocale.code}
                  />
                </div>
              )}
            </div>

            <select 
              className='w-full sm:w-auto bg-stone-50 rounded-xl px-3 py-2 border border-stone-200 text-sm font-medium text-stone-700 hover:bg-white hover:border-primary-2 outline-none focus:border-primary-2 focus:ring-2 focus:ring-primary-2/20 transition-all duration-200 h-10.5 cursor-pointer'
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">{t('admin.spaces.field_city', 'City')} ({t('space.all')})</option>
              {cities.map((city, index) => (
                <option key={index} value={city._id}>{city.name}</option>
              ))}
            </select>

            <select 
              className='w-full sm:w-auto bg-stone-50 rounded-xl px-3 py-2 border border-stone-200 text-sm font-medium text-stone-700 hover:bg-white hover:border-primary-2 outline-none focus:border-primary-2 focus:ring-2 focus:ring-primary-2/20 transition-all duration-200 h-10.5 cursor-pointer'
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">{t('space.type')} ({t('space.all')})</option>
              {spaceTypes.map((type, index) => (
                <option key={index} value={type._id}>{type.name}</option>
              ))}
            </select>

            <select 
              className='w-full sm:w-auto bg-stone-50 rounded-xl px-3 py-2 border border-stone-200 text-sm font-medium text-stone-700 hover:bg-white hover:border-primary-2 outline-none focus:border-primary-2 focus:ring-2 focus:ring-primary-2/20 transition-all duration-200 h-10.5 cursor-pointer'
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Order by"
            >
              <option value="-popularity">{t('sort.title')} ({t('sort.popularity_desc')})</option>
              <option value="pricePerHour">{t('sort.price_asc')}</option>
              <option value="-pricePerHour">{t('sort.price_desc')}</option>
              <option value="capacity">{t('sort.capacity_asc')}</option>
              <option value="-capacity">{t('sort.capacity_desc')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto w-full px-4 sm:px-6 pb-6'>
        {isValidating ? (
          <div className="flex justify-center items-center py-32">
            <Spinner />
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {displayedSpaces.map((space) => (
                  <SpaceCard key={space._id} space={space} />
              ))}
              {displayedSpaces.length > 0 && Array.from({ length: itemsPerPage - displayedSpaces.length }).map((_, i) => (
                <div key={`placeholder-${i}`} className="invisible pointer-events-none" aria-hidden="true">
                  <SpaceCard space={displayedSpaces[0]} />
                </div>
              ))}
            </div>

            {filteredSpaces.length > 0 && (
              <div className="pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Spaces;
