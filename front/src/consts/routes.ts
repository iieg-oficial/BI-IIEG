export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
  CONNECTIONS: '/connections',
  QUERIES: '/queries',
  CHARTS: '/charts',
  DASHBOARDS: '/dashboards',
  DASHBOARD_EDIT: '/dashboards/:id/edit',
} as const;

export function dashboardEdit(id: number | string): string {
  return `/dashboards/${id}/edit`;
}
