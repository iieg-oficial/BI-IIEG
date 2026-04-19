import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';
import { renderWithProviders } from '../../../../test/testUtils';
import { AUTH_LABELS, VALIDATION } from '../../consts';

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(AUTH_LABELS.FULL_NAME_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(AUTH_LABELS.CONFIRM_PASSWORD_LABEL)).toBeInTheDocument();
  });

  it('shows error when submitting empty form', () => {
    const { container } = renderWithProviders(<RegisterForm />);
    const form = container.querySelector('form')!;

    fireEvent.submit(form);

    expect(screen.getByText(VALIDATION.REQUIRED_FIELDS)).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(AUTH_LABELS.FULL_NAME_LABEL), 'Juan Pérez');
    await user.type(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL), 'test@test.com');
    await user.type(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL), 'short');
    await user.type(screen.getByLabelText(AUTH_LABELS.CONFIRM_PASSWORD_LABEL), 'short');

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(screen.getByText(VALIDATION.PASSWORD_TOO_SHORT)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(AUTH_LABELS.FULL_NAME_LABEL), 'Juan Pérez');
    await user.type(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL), 'test@test.com');
    await user.type(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL), 'password123');
    await user.type(
      screen.getByLabelText(AUTH_LABELS.CONFIRM_PASSWORD_LABEL),
      'different123',
    );

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(screen.getByText(VALIDATION.PASSWORD_MISMATCH)).toBeInTheDocument();
  });

  it('calls register with correct data on valid submit', async () => {
    const user = userEvent.setup();
    const registerMock = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<RegisterForm />, { register: registerMock });

    await user.type(screen.getByLabelText(AUTH_LABELS.FULL_NAME_LABEL), 'Juan Pérez');
    await user.type(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL), 'test@test.com');
    await user.type(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL), 'password123');
    await user.type(
      screen.getByLabelText(AUTH_LABELS.CONFIRM_PASSWORD_LABEL),
      'password123',
    );
    await user.click(screen.getByRole('button', { name: AUTH_LABELS.REGISTER_BUTTON }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Juan Pérez',
      });
    });
  });

  it('shows error message when register fails', async () => {
    const user = userEvent.setup();
    const registerMock = vi
      .fn()
      .mockRejectedValue(new Error('El correo ya está registrado'));
    renderWithProviders(<RegisterForm />, { register: registerMock });

    await user.type(screen.getByLabelText(AUTH_LABELS.FULL_NAME_LABEL), 'Juan Pérez');
    await user.type(screen.getByLabelText(AUTH_LABELS.EMAIL_LABEL), 'test@test.com');
    await user.type(screen.getByLabelText(AUTH_LABELS.PASSWORD_LABEL), 'password123');
    await user.type(
      screen.getByLabelText(AUTH_LABELS.CONFIRM_PASSWORD_LABEL),
      'password123',
    );
    await user.click(screen.getByRole('button', { name: AUTH_LABELS.REGISTER_BUTTON }));

    expect(
      await screen.findByText('El correo ya está registrado'),
    ).toBeInTheDocument();
  });

  it('has link to login page', () => {
    renderWithProviders(<RegisterForm />);

    const link = screen.getByRole('link', { name: AUTH_LABELS.LOGIN_LINK });
    expect(link).toHaveAttribute('href', '/login');
  });
});
