import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../HomePage';
import { renderWithProviders } from '../../../test/testUtils';
import type { User } from '../../../types/auth';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  fullName: 'Juan Pérez',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('HomePage', () => {
  it('renders welcome message with user name', () => {
    renderWithProviders(<HomePage />, {
      user: mockUser,
      isAuthenticated: true,
      token: 'fake-token',
    });

    expect(screen.getByText(/bienvenido, juan pérez/i)).toBeInTheDocument();
  });

  it('renders "Panel de Business Intelligence" text', () => {
    renderWithProviders(<HomePage />, {
      user: mockUser,
      isAuthenticated: true,
      token: 'fake-token',
    });

    expect(
      screen.getByText(/panel de business intelligence - iieg/i),
    ).toBeInTheDocument();
  });

  it('renders logout button', () => {
    renderWithProviders(<HomePage />, {
      user: mockUser,
      isAuthenticated: true,
      token: 'fake-token',
    });

    expect(
      screen.getByRole('button', { name: /cerrar sesión/i }),
    ).toBeInTheDocument();
  });

  it('calls logout when button is clicked', async () => {
    const user = userEvent.setup();
    const logoutMock = vi.fn();
    renderWithProviders(<HomePage />, {
      user: mockUser,
      isAuthenticated: true,
      token: 'fake-token',
      logout: logoutMock,
    });

    await user.click(screen.getByRole('button', { name: /cerrar sesión/i }));

    expect(logoutMock).toHaveBeenCalledOnce();
  });
});
