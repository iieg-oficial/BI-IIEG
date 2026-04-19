import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { renderWithProviders } from '../../../../test/testUtils';
import { AUTH_LABELS } from '../../consts';

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL)).toBeInTheDocument();
  });

  it('shows error when submitting empty form', () => {
    const { container } = renderWithProviders(<LoginForm />);
    const form = container.querySelector('form')!;

    fireEvent.submit(form);

    expect(
      screen.getByText('Todos los campos son obligatorios.'),
    ).toBeInTheDocument();
  });

  it('calls login with correct data on valid submit', async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<LoginForm />, { login: loginMock });

    await user.type(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL), 'test@test.com');
    await user.type(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL), 'password123');
    await user.click(screen.getByRole('button', { name: AUTH_LABELS.LOGIN_BUTTON }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });

  it('shows error message when login fails', async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn().mockRejectedValue(new Error('Credenciales inválidas'));
    renderWithProviders(<LoginForm />, { login: loginMock });

    await user.type(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL), 'test@test.com');
    await user.type(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: AUTH_LABELS.LOGIN_BUTTON }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn(() => new Promise<void>(() => {}));
    renderWithProviders(<LoginForm />, { login: loginMock });

    await user.type(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL), 'test@test.com');
    await user.type(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL), 'password123');
    await user.click(screen.getByRole('button', { name: AUTH_LABELS.LOGIN_BUTTON }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cargando/i })).toBeDisabled();
    });
  });

  it('has link to register page', () => {
    renderWithProviders(<LoginForm />);

    const link = screen.getByRole('link', { name: AUTH_LABELS.REGISTER_LINK });
    expect(link).toHaveAttribute('href', '/register');
  });
});
