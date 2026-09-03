import api from './client';

export interface Thinker {
  id: string;
  slug: string;
  name: string;
  portrait_url: string;
  contribution: string;
  key_works: string[];
  bio: string;
  related_note_ids: string[];
  related_subject_ids: string[];
  created_at?: string;
  updated_at?: string;
}

export const getThinkers = async (): Promise<Thinker[]> => {
  const res = await api.get('/thinkers');
  return res.data;
};

export const getThinkerBySlug = async (slug: string): Promise<Thinker> => {
  const res = await api.get(`/thinkers/${slug}`);
  return res.data;
};

// Admin CRUD
export const adminGetThinkers = async (): Promise<Thinker[]> => {
  const res = await api.get('/admin/thinkers');
  return res.data;
};

export const adminCreateThinker = async (data: Partial<Thinker>): Promise<Thinker> => {
  const res = await api.post('/admin/thinkers', data);
  return res.data;
};

export const adminUpdateThinker = async (id: string, data: Partial<Thinker>): Promise<Thinker> => {
  const res = await api.put(`/admin/thinkers/${id}`, data);
  return res.data;
};

export const adminDeleteThinker = async (id: string): Promise<void> => {
  await api.delete(`/admin/thinkers/${id}`);
};
