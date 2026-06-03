/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setIsAuthenticated(true);
      setUser(data);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    fetchProfile();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const isAdmin = user?.role === import.meta.env.VITE_DB_ADMIN_ROLE_ID;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
