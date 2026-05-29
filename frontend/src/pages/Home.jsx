import { Link } from "react-router"
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-stone-200 p-8 md:p-12 rounded-3xl shadow-sm space-y-5">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          {t('home.hero.title')}
        </h1>
        <p className="text-stone-500 text-base md:text-lg max-w-2xl leading-relaxed">
          {t('home.hero.desc')}
        </p>
        <div className="pt-2">
          <Link to="/spaces" className="inline-block bg-primary-2 text-center px-6 py-3 rounded-2xl tracking-tighter text-white font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
            {t('home.hero.cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
