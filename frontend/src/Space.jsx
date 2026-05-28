import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Star, ChevronLeft, User, Check, Package } from 'lucide-react';

function Space() {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <div className="min-h-screen bg-stone-50 flex flex-col overflow-scroll">
        <Navigation />
        <main className='grow px-8 lg:px-48 py-8'>
          <div className="w-20 h-6 bg-stone-200 rounded animate-pulse mb-6"></div>

          <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
            <div className="w-full h-96 bg-stone-200 animate-pulse"></div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-1/2">
                  <div className="h-10 bg-stone-200 rounded animate-pulse mb-4 w-3/4"></div>
                  <div className='flex gap-2 md:gap-8'>
                    <div className="w-24 h-6 bg-stone-200 rounded animate-pulse"></div>
                    <div className="w-24 h-6 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-24 h-8 bg-stone-200 rounded animate-pulse"></div>
                  <div className="w-24 h-8 bg-stone-200 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-100 pt-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-4 bg-stone-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-stone-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-stone-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-stone-200 rounded animate-pulse w-4/6"></div>
                </div>

                <div className="space-y-6">
                  <div className='flex justify-end'>
                    {/* Button skeleton */}
                    <div className="w-24 h-10 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    {/* Equipment list skeleton */}
                    <div className="w-32 h-6 bg-stone-200 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-4 bg-stone-200 rounded animate-pulse"></div>
                    <div className="w-5/6 h-4 bg-stone-200 rounded animate-pulse"></div>
                    <div className="w-4/6 h-4 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-stone-100 pt-6">
                {/* Reviews skeleton */}
                <div className="w-32 h-8 bg-stone-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-stone-50 p-4 rounded-md">
                      <div className="flex justify-between mb-4">
                        <div className="w-32 h-5 bg-stone-200 rounded animate-pulse"></div>
                        <div className="w-16 h-5 bg-stone-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full h-4 bg-stone-200 rounded animate-pulse"></div>
                        <div className="w-2/3 h-4 bg-stone-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Espaço não encontrado</h2>
          <Link to="/spaces" className="px-4 py-2 bg-stone-800 text-white rounded-md">Voltar aos espaços</Link>
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
          <ChevronLeft /> Voltar
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
              Sem Imagem
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
                        {space.available ? "Disponível" : "Indisponível"}
                      </p>
                    </div>
                    <div>
                      <div className='flex md:gap-2'>
                        <User/>
                        <p className="text-stone-600">{space.capacity} pessoas</p>
                      </div>
                    </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-stone-800">{space.pricePerHour}€/hora</p>
                <p className='text-xl font-bold text-stone-800'>{space.pricePerHour * 24}€/dia</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-100 pt-6">

              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {space.description || "Nenhuma descrição disponível."}
                  </p>
                </div>
              </div>

              <div className="space-y-6 rounded-md">
                <div className='flex justify-end'>
                  <button className="bg-primary-2 text-white rounded-md px-3 py-2 cursor-pointer">Reservar</button>
                </div>
                <div>
                  <div className='flex md:gap-2'>
                    <Package/>
                    <h3 className="font-semibold text-stone-800 mb-1">Equipamentos</h3>
                  </div>
                  {space.equipments && space.equipments.length > 0 ? (
                    <ul className="list-disc list-inside text-stone-600">
                      {space.equipments.map((eq, i) => (
                        <li key={i}>{eq}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-500 text-sm">Nenhum equipamento listado.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-stone-100 pt-6">
              <h3 className="text-xl font-semibold text-stone-800 mb-4">Reviews</h3>
              {space.reviews && space.reviews.length > 0 ? (
                <div className="space-y-4">
                  {space.reviews.map((review, i) => (
                    <div key={i} className="bg-stone-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-stone-800">{review.user}</span>
                        <div className='flex md:gap-2'>
                          <Star className='text-primary-2'/>
                          <span className="text-primary-2 font-semibold">{review.rating}/10</span>
                        </div>
                      </div>
                      <p className="text-stone-600">{review.review}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500">Ainda não existem avaliações para este espaço.</p>
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