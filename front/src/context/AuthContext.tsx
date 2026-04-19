import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { LoginRequest, RegisterRequest, User } from '../types/auth';
import * as authService from '../features/auth/services/authService';
import { TOKEN_KEY } from '../services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = token !== null && user !== null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authService.login(data);
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setToken(res.accessToken);
    const me = await authService.getMe();
    setUser(me);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data);
    const res = await authService.login({ email: data.email, password: data.password });
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setToken(res.accessToken);
    const me = await authService.getMe();
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated, loading, login, register, logout }),
    [user, token, isAuthenticated, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
