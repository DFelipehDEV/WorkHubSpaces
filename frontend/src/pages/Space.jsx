import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, User, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import GoTo from '../components/GoTo';
import Spinner from '../components/Spinner';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';

function Space() {
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  const { data: space, error, isLoading: loading, mutate } = useSWR(`/spaces/slug/${slug}`, fetcher);
  const [rating, setRating] = useState(10);
  const [reviewText, setReviewText] = useState("");
  const [reviewMsg, setReviewMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const {t} = useTranslation();

  const isFavorited = !!(space?.favoritedBy && user && space.favoritedBy.includes(user._id));

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return;
    const endpoint = isFavorited ? 'defavorite' : 'favorite';
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces/${space._id}/${endpoint}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (res.ok) {
        const list = space.favoritedBy || [];
        const updatedList = isFavorited
          ? list.filter(uid => uid !== user._id)
          : [...list, user._id];
        mutate({ ...space, favoritedBy: updatedList }, false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setReviewMsg(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces/${space._id}/review`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: reviewText,
          rating: Number(rating),
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || t("space.review_error"));
      }

      setReviewMsg({ text: t("space.review_success"), isError: false });
      setReviewText("");
      setRating(10);

      mutate({
        ...space,
        reviews: [
          ...(space.reviews || []),
          {
            user: { name: user?.name || "Tu" },
            review: reviewText,
            rating: Number(rating),
          },
        ],
      }, false);
    } catch (err) {
      setReviewMsg({ text: err.message, isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };



  if (loading) {
    return (
      <Spinner fullPage />
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
        <GoTo to="/spaces" text={t('goback')} direction="left" align="left" className="mb-6" />

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
          {space.images && space.images.length > 0 ? (
            <div className="relative w-full h-96">
              <img
                src={space.images[activeImageIdx] || space.images[0]}
                alt={space.name}
                className='w-full h-full object-cover'
              />
              {space.images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2 px-4 py-4 overflow-x-auto overflow-y-hidden z-10">
                  {space.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        activeImageIdx === idx ? 'border-white opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/70'
                      }`}
                    >
                      <img src={imgUrl} alt={`${space.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                  <p className='text-xs font-mono text-stone-400 mt-0.5'>{space.pricePerHour * 8}€/{t('space.day')}</p>
                </div>
                <Button to={`/spaces/${space.slug || space._id}/book`}>
                  {t('space.book_this_space')}
                </Button>
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
              <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-8 space-y-4">
                <h3 className="text-lg font-semibold text-stone-800">
                  {t("space.equipments_title")}
                </h3>
                {space.equipments && space.equipments.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                    {space.equipments.map((eq) => (
                      <li key={eq._id}>{eq.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-400">
                    {t("space.no_equipments")}
                  </p>
                )}
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

            {isAuthenticated && (
              <form onSubmit={handleAddReview} className="mt-8 border-t border-stone-100 pt-6 w-full space-y-4">
                <h4 className="text-lg font-semibold text-stone-850">
                  {t("space.add_review_title", { name: space.name })}
                </h4>
                <p className="text-xs text-stone-500">
                  {t("space.add_review_desc")}
                </p>
                
                {reviewMsg && (
                  <div className={`p-3 rounded-xl border text-xs ${reviewMsg.isError ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                    {reviewMsg.text}
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                  <div className="grow w-full md:w-auto">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      {t("space.review_label")}
                    </label>
                    <textarea
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={1}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-850 focus:outline-none focus:border-stone-400 resize-none h-10"
                    />
                  </div>

                  <div className="flex items-end gap-4 shrink-0 w-full md:w-auto pb-0.5">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        {t("space.rating_label")}
                      </label>
                      <div className="flex items-center gap-0.5 h-7">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="cursor-pointer transition-transform active:scale-90"
                          >
                            <Star
                              size={18}
                              className={
                                rating >= star
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-stone-300 hover:text-yellow-400"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="small"
                      className="disabled:opacity-50"
                    >
                      {isSubmitting ? "..." : t("space.submit_review_btn")}
                    </Button>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
    </div>
  );
}

export default Space;