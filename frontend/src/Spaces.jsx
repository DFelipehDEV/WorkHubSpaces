import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import Navigation from "./Navigation";
import Footer from "./Footer";

function Spaces() {
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  
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
    <body className="min-h-screen bg-stone-50 overflow-scroll">
      <Navigation />
      <div className='px-16 lg:px-48 py-8'>
        <div className='flex justify-end gap-4 mb-6 relative'>
          <div>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-white rounded-md px-4 py-2 border border-stone-200 shadow-sm text-stone-700"
            >
              {formatDate(dateRange[0].startDate)} - {formatDate(dateRange[0].endDate)}
            </button>

            {showCalendar && (
              <div className="absolute z-10 top-12 right-32 shadow-lg border border-stone-200 bg-white">
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
            className='bg-white rounded-md px-4 py-2 border border-stone-200 shadow-sm h-fit'
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Tipo (Todos)</option>
            {spaceTypes.map((type, index) => (
              <option key={index} value={type._id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {!loading && spaces
            .filter(space => space.available)
            .filter(space => selectedType === "" || space.type === selectedType)
            .map((space) => (
              <a href={`${import.meta.env.VITE_FRONTEND_URL}/spaces/${space._id}`} key={space._id} className='border border-stone-200 rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow'>
                {space.images && space.images.length > 0 ? (
                  <img
                    src={space.images[0]}
                    alt={space.name}
                    className='w-full h-48 object-cover'
                  />
                ) : (
                  <div className="w-full h-48 bg-stone-200 flex items-center justify-center text-stone-500">
                    Sem Imagem
                  </div>
                )}
                <div className='flex justify-between p-4'>
                  <div className='leading-tight'>
                    <h3 className='font-semibold text-lg text-stone-800'>{space.name}</h3>
                    <small className='font-light text-stone-600'>{space.pricePerHour}€/hora ou {space.pricePerHour * 24}€/dia</small>
                    <br />
                    <small className='font-light text-stone-600'>{space.reviews.length} review(s)</small>
                  </div>
                </div>
              </a>
            ))}
        </div>
      </div>
      {!loading && <Footer />}
    </body>
  );
}

export default Spaces;