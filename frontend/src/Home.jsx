// import { useState } from 'react'
import Navigation from "./Navigation"
import Footer from "./Footer"
import { Link } from "react-router"
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  return (
    <body className="overflow-scroll">
      <Navigation />
      <div className="px-16 py-12 lg:px-48 min-h-screen">
        <div className="bg-white p-3 rounded-xl">
          <h1 className="text-3xl font-semibold">{t('home.hero.title')}</h1>
          <h2 className="text-neutral-600 text-sm mb-4">{t('home.hero.desc')}</h2>
          <Link to={`${import.meta.env.VITE_FRONTEND_URL}/spaces`} className="bg-primary-2 text-center px-4 py-1 rounded-xl tracking-tighter text-white text-md font-normal">{t('home.hero.cta')}</Link>
        </div>
      </div>
      <Footer />
    </body>
  )
}

export default Home
