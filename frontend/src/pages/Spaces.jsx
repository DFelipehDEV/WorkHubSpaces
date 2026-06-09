import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { Star, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/Pagination';

function Spaces() {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [sortBy, setSortBy] = useState("-popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { t } = useTranslation();
  
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
  }, [selectedType, dateRange, sortBy, debouncedSearchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedType) {
      params.append('type', selectedType);
    }
    if (sortBy) {
      params.append('sort', sortBy);
    }
    if (debouncedSearchQuery) {
      params.append('name', debouncedSearchQuery);
    }
    if (dateRange[0]?.startDate && dateRange[0]?.endDate) {
      params.append('startDate', dateRange[0].startDate.toISOString());
      params.append('endDate', dateRange[0].endDate.toISOString());
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setSpaces(Array.isArray(json) ? json : []);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedType, sortBy, dateRange, debouncedSearchQuery]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/spacetypes`)
      .then((res) => res.json())
      .then((json) => {
        setSpaceTypes(json);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSelect = (item) => {
    setDateRange([item.selection]);
  }; 

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-PT');
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
    <div className='max-w-6xl mx-auto w-full px-4 sm:px-6 py-6'>
        <div className='flex flex-col md:flex-row justify-between gap-3 mb-6 items-center'>
          <div className="relative w-full md:max-w-3xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-md pl-9 pr-3 py-2 border border-stone-200 shadow-sm text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-primary-2 focus:ring-1 focus:ring-primary-2 h-fit"
            />
          </div>

          <div className='flex flex-col sm:flex-row w-full md:w-auto justify-end gap-3 items-center'>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setShowFavoritesOnly(!showFavoritesOnly);
                  setCurrentPage(1);
                }}
                className={`w-full sm:w-auto px-3 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  showFavoritesOnly
                    ? 'bg-primary-2 text-white border-primary-2 hover:opacity-90'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white text-white' : 'text-stone-400'}`} />
                {showFavoritesOnly ? t('space.all_spaces') : t('space.favorites_only')}
              </button>
            )}

            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="cursor-pointer w-full sm:w-auto bg-white rounded-md px-3 py-2 border border-stone-200 shadow-sm text-sm text-stone-700 hover:bg-stone-50 hover:text-primary-2"
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
                  />
                </div>
              )}
            </div>

            <select 
              className='w-full sm:w-auto bg-white rounded-md px-3 py-2 border border-stone-200 shadow-sm text-sm text-stone-700 h-fit'
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">{t('space.type')} ({t('space.all')})</option>
              {spaceTypes.map((type, index) => (
                <option key={index} value={type._id}>{type.name}</option>
              ))}
            </select>

            <select 
              className='w-full sm:w-auto bg-white rounded-md px-3 py-2 border border-stone-200 shadow-sm text-sm text-stone-700 h-fit'
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Order by"
            >
              <option value="-popularity">{t('sort.popularity_desc')}</option>
              <option value="pricePerHour">{t('sort.price_asc')}</option>
              <option value="-pricePerHour">{t('sort.price_desc')}</option>
              <option value="capacity">{t('sort.capacity_asc')}</option>
              <option value="-capacity">{t('sort.capacity_desc')}</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {!loading && displayedSpaces.map((space) => (
              <Link 
                to={`/spaces/${space._id}`} 
                key={space._id} 
                className='border border-stone-200 rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow flex flex-col group'
              >
                {space.images && space.images.length > 0 ? (
                  <img
                    src={space.images[0]}
                    alt={space.name}
                    className='w-full h-40 object-cover'
                  />
                ) : (
                  <div className="w-full h-40 bg-stone-200 flex items-center justify-center text-sm text-stone-500">
                    {t('noimg')}
                  </div>
                )}
                
                <div className='flex flex-col justify-between p-3 grow'>
                  <h3 className='font-semibold text-base text-stone-800 mb-1 truncate group-hover:text-primary-2'>{space.name}</h3>
                  <div className='flex justify-between items-center mt-auto'>
                    <span className='text-sm text-stone-600'>
                      {space.pricePerHour}€/h <span className="text-stone-400">|</span> {space.pricePerHour * 8}€/d
                    </span>
                    {space.reviews.length > 0 && 
                      <div className='flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-full'>
                        <Star className='w-3 h-3 text-stone-700 fill-stone-700'/>
                        <span className='text-xs font-medium text-stone-700'>{space.reviews.length}</span>
                      </div>
                    }
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {!loading && filteredSpaces.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
    </div>
  );
}

export default Spaces;
