import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronLeft, User, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function Space() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {t} = useTranslation();

  const isFavorited = !!(space?.favoritedBy && user && space.favoritedBy.includes(user._id));

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return;
    const endpoint = isFavorited ? 'defavorite' : 'favorite';
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces/${id}/${endpoint}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (res.ok) {
        setSpace(prev => {
          const list = prev.favoritedBy || [];
          const updatedList = isFavorited
            ? list.filter(uid => uid !== user._id)
            : [...list, user._id];
          return { ...prev, favoritedBy: updatedList };
        });
      }
    } catch (err) {
      console.error(err);
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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">{t('space.notfound')}</h2>
        <Link to="/spaces" className="px-4 py-2 bg-stone-800 text-white rounded-md">{t('goback')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/spaces" className="flex mb-6 text-stone-600 hover:text-primary-2 items-center gap-1">
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
                <div className="flex items-center gap-3 mb-2">
                  <h1 className='text-3xl font-bold text-stone-850'>{space.name}</h1>
                  {isAuthenticated && (
                    <button
                      onClick={handleToggleFavorite}
                      className="p-1.5 rounded-full border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer group"
                      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star
                        size={20}
                        className={`transition-transform group-active:scale-90 ${
                          isFavorited ? 'fill-yellow-500 text-yellow-500' : 'text-stone-400 hover:text-yellow-500'
                        }`}
                      />
                    </button>
                  )}
                </div>
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
              <div className="text-right flex flex-col items-end gap-3">
                <div>
                  <p className="text-xl font-mono font-bold text-stone-850">{space.pricePerHour}€/{t('space.hour')}</p>
                  <p className='text-xs font-mono text-stone-400 mt-0.5'>{space.pricePerHour * 24}€/{t('space.day')}</p>
                </div>
                <Link
                  to={`/spaces/${space._id}/book`}
                  className="bg-primary-2 text-white font-bold py-2.5 px-5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-sm text-sm"
                >
                  {t('space.book_this_space', 'Book Space')}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-100 pt-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {space.description}
                  </p>
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
                        <span className="font-medium text-stone-800">{review.user.name}</span>
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
    </div>
  );
}

export default Space;