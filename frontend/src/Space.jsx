import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Star } from 'lucide-react';

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
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navigation />
        <div className="flex items-center justify-center">
          <p className="text-stone-500">A carregar...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navigation />
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Espaço não encontrado</h2>
          <Link to="/spaces" className="px-4 py-2 bg-stone-800 text-white rounded-md">Voltar aos espaços</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navigation />

      <main className='flex-grow px-8 lg:px-48 py-8'>
        <Link to="/spaces" className="inline-block mb-6 text-stone-600 hover:text-stone-900 transition-colors">
          &larr; Voltar
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
              </div>
              <div className="text-right">
                <p className='text-2xl font-semibold text-stone-800'>{space.pricePerHour}€<span className="text-base font-normal text-stone-500">/hora</span></p>
                <p className='text-stone-500'>{space.pricePerHour * 24}€/dia</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-100 pt-6">

              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">Descrição</h3>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {space.description || "Nenhuma descrição disponível."}
                  </p>
                </div>
              </div>

              <div className="space-y-6 p-6 rounded-md">
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Capacidade</h3>
                  <p className="text-stone-600">{space.capacity} pessoas</p>
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Disponibilidade</h3>
                  <p className={space.available ? "text-green-600" : "text-red-600"}>
                    {space.available ? "Disponível" : "Indisponível"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Equipamentos</h3>
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
              <h3 className="text-xl font-semibold text-stone-800 mb-4">Reviews ({space.reviews?.length || 0})</h3>
              {space.reviews && space.reviews.length > 0 ? (
                <div className="space-y-4">
                  {space.reviews.map((review, i) => (
                    <div key={i} className="bg-stone-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-stone-800">Utilizador {review.user}</span>
                        <Star />
                        <span className="text-stone-600 font-semibold">{review.rating}/10</span>
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