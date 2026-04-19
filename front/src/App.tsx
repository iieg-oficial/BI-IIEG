import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './hooks/useAuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { LoginPage, RegisterPage } from './features/auth';
import { HomePage } from './features/home';
import { ConnectionsPage } from './features/connections';
import { QueriesPage } from './features/queries';
import { ChartsPage } from './features/charts';
import { DashboardsPage, DashboardBuilderPage } from './features/dashboards';
import { ROUTES } from './consts/routes';
import type { ReactNode } from 'react';

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div className="page-center"><div className="spinner" /></div>;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONNECTIONS}
          element={
            <ProtectedRoute>
              <ConnectionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.QUERIES}
          element={
            <ProtectedRoute>
              <QueriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHARTS}
          element={
            <ProtectedRoute>
              <ChartsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DASHBOARDS}
          element={
            <ProtectedRoute>
              <DashboardsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DASHBOARD_EDIT}
          element={
            <ProtectedRoute>
              <DashboardBuilderPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
