import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ROUTES } from '../consts/routes';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div className="page-center"><div className="spinner" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
