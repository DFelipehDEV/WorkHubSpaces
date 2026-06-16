export const fetcher = async (url) => {
  const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL}${url}`;
  
  const res = await fetch(fullUrl, {
    credentials: 'omit', // Default, we can change it to include dynamically if needed
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json().catch(() => ({}));
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const fetcherWithAuth = async (url) => {
  const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL}${url}`;
  
  const res = await fetch(fullUrl, {
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json().catch(() => ({}));
    error.status = res.status;
    throw error;
  }

  return res.json();
};
