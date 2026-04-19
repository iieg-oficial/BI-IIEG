import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import type { LoginRequest, RegisterRequest, User } from '../../types/auth';

interface AuthOverrides {
  user?: User | null;
  token?: string | null;
  isAuthenticated?: boolean;
  loading?: boolean;
  login?: (data: LoginRequest) => Promise<void>;
  register?: (data: RegisterRequest) => Promise<void>;
  logout?: () => void;
}

function renderProtectedRoute(authOverrides: AuthOverrides = {}) {
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

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <AuthContext.Provider value={auth}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('shows children when authenticated', () => {
    renderProtectedRoute({ isAuthenticated: true });

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    renderProtectedRoute({ isAuthenticated: false });

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('shows spinner when loading', () => {
    const { container } = renderProtectedRoute({ loading: true });

    expect(container.querySelector('.spinner')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
