import LoginForm from './components/LoginForm';
import { AUTH_LABELS } from './consts';

export default function LoginPage() {
  return (
    <div className="page-center">
      <div className="card auth-card">
        <h1 className="card-title">{AUTH_LABELS.LOGIN_TITLE}</h1>
        <LoginForm />
      </div>
    </div>
  );
}
