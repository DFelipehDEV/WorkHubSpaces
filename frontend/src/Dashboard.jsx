import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from "./Navigation"
import Footer from "./Footer"
import {useTranslation} from 'react-i18next'

function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);

  const {t} = useTranslation();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/validate-token`, {
      method: 'GET',
      credentials: 'include'
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.message === "Success") {
        setAuthenticated(true);
      }
    })
    .catch(error => console.error(error));
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navigation />
        <div className="flex flex-col items-center justify-center grow">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">{t('auth.not_authenticated')}</h2>
          <Link to="/spaces" className="px-4 py-2 bg-stone-800 text-white rounded-md">{t('goback')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col overflow-scroll">
      <Navigation />

      <main className='grow px-8 lg:px-48 py-8'>
        {authenticated && <h1>protegido2</h1>}
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
