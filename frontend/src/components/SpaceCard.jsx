import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function SpaceCard({ space }) {
  const { t } = useTranslation();

  return (
    <Link 
      to={`/spaces/${space.slug}`} 
      className='p-0 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col group border border-white/60'
    >
      {space.images && space.images.length > 0 ? (
        <div className="relative overflow-hidden h-44">
          <img
            src={space.images[0]}
            alt={space.name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="w-full h-44 bg-white/40 flex items-center justify-center text-sm text-stone-500 border-b border-white/30">
          {t('noimg', 'No image available')}
        </div>
      )}
      
      <div className='flex flex-col justify-between p-4 grow bg-white/40 backdrop-blur-md'>
        <h3 className='font-semibold text-lg text-stone-800 mb-1 truncate group-hover:text-primary-2 transition-colors'>{space.name}</h3>
        <div className='flex justify-between items-center mt-auto pt-2'>
          <span className='text-[14px] font-medium text-stone-600'>
            {space.pricePerHour}€<span className="text-stone-400 font-normal">/h</span> <span className="text-stone-300 font-normal mx-1">|</span> {space.pricePerHour * 8}€<span className="text-stone-400 font-normal">/d</span>
          </span>
          {space.reviews && space.reviews.length > 0 && 
            <div className='flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full shadow-sm'>
              <Star className='w-3.5 h-3.5 text-amber-400 fill-amber-400'/>
              <span className='text-xs font-bold text-stone-700'>{space.reviews.length}</span>
            </div>
          }
        </div>
      </div>
    </Link>
  );
}

export default SpaceCard;
