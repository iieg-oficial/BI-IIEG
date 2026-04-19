import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ROUTES } from '../consts/routes';
import type { ReactNode } from 'react';
import logoBlanco from '../assets/logo_blanco_iieg.png';

export default function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <div className="layout">
      <header className="header">
        <Link to={ROUTES.HOME} className="header-title">
          <img src={logoBlanco} alt="IIEG" className="header-logo" />
        </Link>
        {isAuthenticated && (
          <nav className="header-nav">
            <Link to={ROUTES.HOME} className="nav-link">Inicio</Link>
            <Link to={ROUTES.CONNECTIONS} className="nav-link">Conexiones</Link>
            <Link to={ROUTES.QUERIES} className="nav-link">Consultas</Link>
            <Link to={ROUTES.CHARTS} className="nav-link">Gráficas</Link>
            <Link to={ROUTES.DASHBOARDS} className="nav-link">Dashboards</Link>
            <button type="button" className="btn btn-outline" onClick={logout}>
              Cerrar sesión
            </button>
          </nav>
        )}
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
