import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Spaces() {
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const { t } = useTranslation();
  
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 2);

  const [dateRange, setDateRange] = useState([{
    startDate: today,
    endDate: futureDate,
    key: 'selection'
  }]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces`)
      .then((res) => res.json())
      .then((json) => {
        setSpaces(json.sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity)));
        setSpaceTypes([...new Set(json.map(space => space.type).filter(Boolean))]);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />
      
      <main className='grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6'>
        <div className='flex flex-col sm:flex-row justify-end gap-3 mb-6'>
          <div className="relative">
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
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {!loading && spaces
            .filter(space => space.available)
            .filter(space => selectedType === "" || space.type === selectedType)
            .map((space) => (
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
                      {space.pricePerHour}€/h <span className="text-stone-400">|</span> {space.pricePerHour * 24}€/d
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
      </main>
      
      {!loading && <Footer />}
    </div>
  );
}

export default Spaces;