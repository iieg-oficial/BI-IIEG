import api from '../../../services/api';
import type {
  Dashboard,
  DashboardBlock,
  DashboardCreate,
  DashboardUpdate,
} from '../../../types/dashboards';

export async function fetchDashboards(): Promise<Dashboard[]> {
  const response = await api.get('/dashboards');
  return (response.data as Record<string, unknown>[]).map(mapDashboard);
}

export async function fetchDashboard(id: number): Promise<Dashboard> {
  const response = await api.get(`/dashboards/${id}`);
  return mapDashboard(response.data as Record<string, unknown>);
}

export async function createDashboard(data: DashboardCreate): Promise<Dashboard> {
  const response = await api.post('/dashboards', {
    name: data.name,
    description: data.description ?? null,
    layout: (data.layout ?? []).map(mapBlockToPayload),
  });
  return mapDashboard(response.data as Record<string, unknown>);
}

export async function updateDashboard(
  id: number,
  data: DashboardUpdate,
): Promise<Dashboard> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.layout !== undefined) payload.layout = data.layout.map(mapBlockToPayload);
  const response = await api.put(`/dashboards/${id}`, payload);
  return mapDashboard(response.data as Record<string, unknown>);
}

export async function deleteDashboard(id: number): Promise<void> {
  await api.delete(`/dashboards/${id}`);
}

function mapBlockToPayload(block: DashboardBlock): Record<string, unknown> {
  return {
    id: block.id,
    type: block.type,
    x: block.x,
    y: block.y,
    w: block.w,
    h: block.h,
    chartId: block.chartId,
    markdown: block.markdown,
  };
}

function mapBlock(raw: Record<string, unknown>): DashboardBlock {
  return {
    id: raw.id as string,
    type: raw.type as DashboardBlock['type'],
    x: raw.x as number,
    y: raw.y as number,
    w: raw.w as number,
    h: raw.h as number,
    chartId: (raw.chartId as number | null | undefined) ?? null,
    markdown: (raw.markdown as string | null | undefined) ?? null,
  };
}

function mapDashboard(data: Record<string, unknown>): Dashboard {
  const rawLayout = (data.layout as Record<string, unknown>[] | null | undefined) ?? [];
  return {
    id: data.id as number,
    userId: data.user_id as number,
    name: data.name as string,
    description: (data.description as string | null | undefined) ?? null,
    layout: rawLayout.map(mapBlock),
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}
