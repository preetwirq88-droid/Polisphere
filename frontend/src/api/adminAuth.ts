import api from './client';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  admin_name: string;
  admin_email: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export const adminLogin = async (email: string, password: str): Promise<LoginResponse> => {
  const res = await api.post('/admin/login', { email, password });
  return res.data;
};

export const getAdminProfile = async (): Promise<AdminProfile> => {
  const res = await api.get('/admin/me');
  return res.data;
};
