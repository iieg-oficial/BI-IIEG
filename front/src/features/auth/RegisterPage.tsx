import RegisterForm from './components/RegisterForm';
import { AUTH_LABELS } from './consts';

export default function RegisterPage() {
  return (
    <div className="page-center">
      <div className="card auth-card">
        <h1 className="card-title">{AUTH_LABELS.REGISTER_TITLE}</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
