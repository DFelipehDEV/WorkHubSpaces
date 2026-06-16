
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { useTranslation } from "react-i18next";
import SpaceCard from '../components/SpaceCard';
import Button from '../components/Button';
import GoTo from '../components/GoTo';

function Home() {
  const { t } = useTranslation();
  const { data: spacesData, isLoading: loading } = useSWR('/spaces?sort=-popularity', fetcher);
  const featuredSpaces = Array.isArray(spacesData) ? spacesData.filter(s => s.available).slice(0, 4) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      <div className="py-8 md:py-12 rounded-3xl space-y-5">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          {t('home.hero.title')}
        </h1>
        <p className="text-stone-500 text-base md:text-lg max-w-2xl leading-relaxed">
          {t('home.hero.desc')}
        </p>
        <div className="pt-2">
          <Button to="/spaces">
            {t('home.hero.cta')}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">{t('home.featured.title', 'Featured Spaces')}</h2>
            <p className="text-stone-500 mt-2">{t('home.featured.desc', 'Discover our most popular workspaces')}</p>
          </div>
          <GoTo 
            to="/spaces" 
            text={t('home.featured.view_all', 'View all')} 
            direction="right" 
            align="right" 
            linkClassName="text-primary-2 hover:text-primary-2/80 font-medium" 
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSpaces.map((space) => (
              <SpaceCard key={space._id} space={space} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
