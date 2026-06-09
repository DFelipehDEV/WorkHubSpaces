import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    nif: '',
    activity: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) throw new Error(t('profile.session_expired'));
        return res.json();
      })
      .then((data) => {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          contact: data.contact || '',
          address: data.address || '',
          nif: data.nif || '',
          activity: data.activity || '',
          company: data.company || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(t('profile.session_expired'));
        setLoading(false);
        navigate('/login');
      });
  }, [navigate, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t('profile.failed'));

      setMessage(t('profile.success'));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">
        {t('profile.title')}
      </h1>

      {message && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 mb-6">
          <p className="text-sm font-semibold">{message}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 mb-6">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t('auth.name')}
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="w-full bg-white rounded-xl px-4 py-2.5 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 focus:ring-1 focus:ring-primary-2/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t('auth.nif')}
            </label>
            <input
              type="text"
              name="nif"
              value={profile.nif}
              onChange={handleChange}
              required
              pattern="\d{9}"
              className="w-full bg-white rounded-xl px-4 py-2.5 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 focus:ring-1 focus:ring-primary-2/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t('auth.contact')}
            </label>
            <input
              type="text"
              name="contact"
              value={profile.contact}
              onChange={handleChange}
              required
              className="w-full bg-white rounded-xl px-4 py-2.5 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 focus:ring-1 focus:ring-primary-2/20 transition-all duration-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t('auth.address')}
            </label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
              className="w-full bg-white rounded-xl px-4 py-2.5 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 focus:ring-1 focus:ring-primary-2/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t('auth.activity')}
            </label>
            <input
              type="text"
              name="activity"
              value={profile.activity || ''}
              onChange={handleChange}
              className="w-full bg-white rounded-xl px-4 py-2.5 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 focus:ring-1 focus:ring-primary-2/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t('auth.company')}
            </label>
            <input
              type="text"
              name="company"
              value={profile.company || ''}
              onChange={handleChange}
              className="w-full bg-white rounded-xl px-4 py-2.5 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 focus:ring-1 focus:ring-primary-2/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="pt-4 max-w-xs">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-primary-2 text-white font-bold rounded-xl text-sm shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2"
          >
            {t('profile.save_btn')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
