import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from './Navigation';
import Footer from './Footer';

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
        if (!res.ok) throw new Error(t('profile.session_expired', 'Unauthorized or session expired'));
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
        setError(t('profile.session_expired', 'Unauthorized or session expired'));
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
      if (!res.ok) throw new Error(data.message || t('profile.failed', 'Failed to update profile'));

      setMessage(t('profile.success', 'Profile updated successfully!'));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="font-sans" style={{ padding: '20px', textAlign: 'center' }}>
        {t('common.loading', 'Loading...')}
      </div>
    );
  }

  return (
    <div className="font-sans" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation />
      
      <main style={{ flexGrow: 1, padding: '40px 20px', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <div className="font-sans" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333333' }}>
            {t('profile.title', 'Manage Profile')}
          </h2>

          {message && <div style={{ color: 'green', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{message}</div>}
          {error && <div style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666666' }}>{t('auth.name', 'Name')}</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="font-sans"
                style={{ padding: '8px', border: '1px solid #cccccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666666' }}>{t('auth.email', 'Email')}</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                className="font-sans"
                style={{ padding: '8px', border: '1px solid #cccccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666666' }}>{t('auth.contact', 'Contact')}</label>
              <input
                type="text"
                name="contact"
                value={profile.contact}
                onChange={handleChange}
                className="font-mono"
                style={{ padding: '8px', border: '1px solid #cccccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666666' }}>{t('auth.address', 'Address')}</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="font-sans"
                style={{ padding: '8px', border: '1px solid #cccccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666666' }}>{t('auth.nif', 'NIF')}</label>
              <input
                type="text"
                name="nif"
                value={profile.nif}
                onChange={handleChange}
                className="font-mono"
                style={{ padding: '8px', border: '1px solid #cccccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666666' }}>{t('auth.activity', 'Activity')}</label>
              <input
                type="text"
                name="activity"
                value={profile.activity}
                onChange={handleChange}
                className="font-sans"
                style={{ padding: '8px', border: '1px solid #cccccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666666' }}>{t('auth.company', 'Company')}</label>
              <input
                type="text"
                name="company"
                value={profile.company}
                onChange={handleChange}
                className="font-sans"
                style={{ padding: '8px', border: '1px solid #cccccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              className="font-sans"
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#333333',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#444444'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#333333'}
            >
              {t('profile.save_btn', 'Save Profile')}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
