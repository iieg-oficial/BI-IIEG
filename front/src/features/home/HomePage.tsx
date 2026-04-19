import { useAuth } from '../auth/hooks/useAuth';

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1 className="welcome-title">
          Bienvenido, {user?.fullName ?? 'Usuario'}
        </h1>
        <p className="welcome-subtitle">Panel de Business Intelligence - IIEG</p>
      </div>

      <div className="card home-card">
        <h2 className="card-title">Dashboard</h2>
        <p className="card-text">
          Aquí podrás visualizar y analizar datos de manera interactiva. Las
          funcionalidades de conexión a bases de datos, ejecución de consultas y
          generación de gráficas estarán disponibles próximamente.
        </p>
      </div>

      <div className="card home-card">
        <h2 className="card-title">Próximos pasos</h2>
        <ul className="feature-list">
          <li>Conectores de bases de datos</li>
          <li>Ejecución parametrizada de queries</li>
          <li>Visualizaciones con Plotly</li>
          <li>Dashboard builder extensible</li>
        </ul>
      </div>

      <button type="button" className="btn btn-outline logout-btn" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}
