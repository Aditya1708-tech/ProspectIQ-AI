import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserContext } from 'shared';

interface AuthContextType {
  user: UserContext | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginUser: (accessToken: string, refreshToken: string, user: UserContext) => void;
  logoutUser: () => Promise<void>;
  loading: boolean;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loginUser = useCallback((newAccessToken: string, newRefreshToken: string, newUser: UserContext) => {
    localStorage.setItem('prospectiq_access_token', newAccessToken);
    localStorage.setItem('prospectiq_refresh_token', newRefreshToken);
    localStorage.setItem('prospectiq_user', JSON.stringify(newUser));
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);
  }, []);

  const logoutUser = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('prospectiq_refresh_token') || refreshToken;
    if (storedRefreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: storedRefreshToken })
        });
      } catch (e) {
        console.error('Failed to notify logout endpoint:', e);
      }
    }
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, [refreshToken]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('prospectiq_refresh_token');
    if (!storedRefreshToken) {
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const result = await response.json();
      if (result.success && result.data) {
        const { accessToken: newAccess, refreshToken: newRefresh, user: newUser } = result.data;
        loginUser(newAccess, newRefresh, newUser);
        return true;
      }
    } catch (e) {
      console.error('Session refresh failed:', e);
      // Clean up invalid session
      localStorage.removeItem('prospectiq_access_token');
      localStorage.removeItem('prospectiq_refresh_token');
      localStorage.removeItem('prospectiq_user');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
    setLoading(false);
    return false;
  }, [loginUser]);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('prospectiq_user');
      const savedAccess = localStorage.getItem('prospectiq_access_token');
      const savedRefresh = localStorage.getItem('prospectiq_refresh_token');

      if (savedUser && savedAccess && savedRefresh) {
        setAccessToken(savedAccess);
        setRefreshToken(savedRefresh);
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.clear();
        }
      }

      // Try refreshing to ensure the access token is valid/refreshed
      if (savedRefresh) {
        await refreshSession();
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, loginUser, logoutUser, loading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
