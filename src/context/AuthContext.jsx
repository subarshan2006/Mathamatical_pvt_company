import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessToken, clearAccessToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data);
      return true;
    } catch {
      // No access token — try refreshing from the httpOnly refresh token cookie
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.data.accessToken);
        const { data: me } = await api.get('/auth/me');
        setUser(me.data);
        return true;
      } catch {
        setUser(null);
        clearAccessToken();
        return false;
      }
    }
  }, []);

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.tutor);
    return data.data.tutor;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
