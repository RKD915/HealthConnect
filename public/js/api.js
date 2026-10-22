// Base fetch wrapper
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`/api${url}`, { ...options, headers });
    
    // Auto logout on 401
    if (response.status === 401 && window.location.pathname !== '/auth.html') {
      localStorage.removeItem('token');
      window.location.href = '/auth.html';
      return null;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Something went wrong');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Check Auth state on load for protected pages
if (window.location.pathname !== '/auth.html' && window.location.pathname !== '/') {
  if (!localStorage.getItem('token')) {
    window.location.href = '/auth.html';
  }
}

// Redirect if logged in and on auth page
if ((window.location.pathname === '/auth.html' || window.location.pathname === '/') && localStorage.getItem('token')) {
    if(window.location.pathname !== '/index.html') {
        window.location.href = '/index.html';
    }
}
