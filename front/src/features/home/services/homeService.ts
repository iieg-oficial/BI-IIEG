import api from '../../../services/api';

export async function getHomeData(): Promise<unknown> {
  const response = await api.get('/home');
  return response.data;
}
