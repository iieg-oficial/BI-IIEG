import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../../../consts/routes';
import { AUTH_LABELS } from '../consts';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <label className="form-label" htmlFor="login-email">
        {AUTH_LABELS.EMAIL_LABEL}
      </label>
      <input
        id="login-email"
        className="form-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@ejemplo.com"
        autoComplete="email"
        required
      />

      <label className="form-label" htmlFor="login-password">
        {AUTH_LABELS.PASSWORD_LABEL}
      </label>
      <input
        id="login-password"
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Cargando...' : AUTH_LABELS.LOGIN_BUTTON}
      </button>

      <p className="form-footer">
        {AUTH_LABELS.NO_ACCOUNT}{' '}
        <Link to={ROUTES.REGISTER}>{AUTH_LABELS.REGISTER_LINK}</Link>
      </p>
    </form>
  );
}
