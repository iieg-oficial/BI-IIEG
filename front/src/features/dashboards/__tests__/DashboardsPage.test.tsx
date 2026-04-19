import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardsPage from '../DashboardsPage';
import type { Dashboard } from '../../../types/dashboards';

vi.mock('react-grid-layout', () => {
  const FakeGrid = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return {
    default: FakeGrid,
    useContainerWidth: () => ({ containerRef: { current: null }, width: 1200, mounted: true }),
  };
});

vi.mock('../services/dashboardsService', () => ({
  fetchDashboards: vi.fn(),
  createDashboard: vi.fn(),
  deleteDashboard: vi.fn(),
  fetchDashboard: vi.fn(),
  updateDashboard: vi.fn(),
}));

import { fetchDashboards } from '../services/dashboardsService';

const mockedFetch = fetchDashboards as ReturnType<typeof vi.fn>;

function makeDashboard(overrides: Partial<Dashboard>): Dashboard {
  return {
    id: 1,
    userId: 1,
    name: 'Dashboard',
    description: null,
    layout: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardsPage />
    </MemoryRouter>,
  );
}

describe('DashboardsPage', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it('muestra estado vacío cuando no hay dashboards', async () => {
    mockedFetch.mockResolvedValueOnce([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/no tienes dashboards/i)).toBeInTheDocument();
    });
  });

  it('renderiza la lista con dos dashboards', async () => {
    mockedFetch.mockResolvedValueOnce([
      makeDashboard({ id: 1, name: 'Ventas 2026' }),
      makeDashboard({ id: 2, name: 'Marketing' }),
    ]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Ventas 2026')).toBeInTheDocument();
    });
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });
});
