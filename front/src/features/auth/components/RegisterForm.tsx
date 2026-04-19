import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../../../consts/routes';
import { AUTH_LABELS, VALIDATION } from '../consts';

export default function RegisterForm() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!fullName || !email || !password || !confirmPassword) {
      return VALIDATION.REQUIRED_FIELDS;
    }
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return VALIDATION.PASSWORD_TOO_SHORT;
    }
    if (password !== confirmPassword) {
      return VALIDATION.PASSWORD_MISMATCH;
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, fullName });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <label className="form-label" htmlFor="register-name">
        {AUTH_LABELS.FULL_NAME_LABEL}
      </label>
      <input
        id="register-name"
        className="form-input"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Juan Pérez"
        autoComplete="name"
        required
      />

      <label className="form-label" htmlFor="register-email">
        {AUTH_LABELS.EMAIL_LABEL}
      </label>
      <input
        id="register-email"
        className="form-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@ejemplo.com"
        autoComplete="email"
        required
      />

      <label className="form-label" htmlFor="register-password">
        {AUTH_LABELS.PASSWORD_LABEL}
      </label>
      <input
        id="register-password"
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        autoComplete="new-password"
        required
      />

      <label className="form-label" htmlFor="register-confirm">
        {AUTH_LABELS.CONFIRM_PASSWORD_LABEL}
      </label>
      <input
        id="register-confirm"
        className="form-input"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repite tu contraseña"
        autoComplete="new-password"
        required
      />

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Cargando...' : AUTH_LABELS.REGISTER_BUTTON}
      </button>

      <p className="form-footer">
        {AUTH_LABELS.HAS_ACCOUNT}{' '}
        <Link to={ROUTES.LOGIN}>{AUTH_LABELS.LOGIN_LINK}</Link>
      </p>
    </form>
  );
}
