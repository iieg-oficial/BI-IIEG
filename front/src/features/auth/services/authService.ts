import api from '../../../services/api';
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '../../../types/auth';

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post('/auth/login', {
    email: data.email,
    password: data.password,
  });
  return {
    accessToken: response.data.access_token,
    tokenType: response.data.token_type,
  };
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await api.post('/auth/register', {
    email: data.email,
    password: data.password,
    full_name: data.fullName,
  });
  return mapUser(response.data);
}

export async function getMe(): Promise<User> {
  const response = await api.get('/auth/me');
  return mapUser(response.data);
}

function mapUser(data: Record<string, unknown>): User {
  return {
    id: data.id as number,
    email: data.email as string,
    fullName: data.full_name as string,
    createdAt: data.created_at as string,
  };
}
