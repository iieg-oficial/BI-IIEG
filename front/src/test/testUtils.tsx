import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import type { LoginRequest, RegisterRequest, User } from '../types/auth';

interface AuthOverrides {
  user?: User | null;
  token?: string | null;
  isAuthenticated?: boolean;
  loading?: boolean;
  login?: (data: LoginRequest) => Promise<void>;
  register?: (data: RegisterRequest) => Promise<void>;
  logout?: () => void;
}

export function renderWithProviders(
  ui: ReactNode,
  authOverrides: AuthOverrides = {},
  routerOptions: { initialEntries?: string[] } = {},
) {
  const auth = {
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...authOverrides,
  };

  const result = render(
    <MemoryRouter initialEntries={routerOptions.initialEntries ?? ['/']}>
      <AuthContext.Provider value={auth}>{ui}</AuthContext.Provider>
    </MemoryRouter>,
  );

  return { ...result, auth };
}
