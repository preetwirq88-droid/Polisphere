import api from './client';

export interface Unit {
  unit_number: number;
  title: str;
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  units: Unit[];
  created_at?: string;
  updated_at?: string;
}

export const getSubjects = async (): Promise<Subject[]> => {
  const res = await api.get('/subjects');
  return res.data;
};

export const getSubjectBySlug = async (slug: string): Promise<Subject> => {
  const res = await api.get(`/subjects/${slug}`);
  return res.data;
};

// Admin CRUD
export const adminGetSubjects = async (): Promise<Subject[]> => {
  const res = await api.get('/admin/subjects');
  return res.data;
};

export const adminCreateSubject = async (data: Partial<Subject>): Promise<Subject> => {
  const res = await api.post('/admin/subjects', data);
  return res.data;
};

export const adminUpdateSubject = async (id: string, data: Partial<Subject>): Promise<Subject> => {
  const res = await api.put(`/admin/subjects/${id}`, data);
  return res.data;
};

export const adminDeleteSubject = async (id: string): Promise<void> => {
  await api.delete(`/admin/subjects/${id}`);
};
