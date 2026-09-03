import api from './client';

export interface ImportantQuestion {
  id: string;
  subject_id: string;
  unit_number: number;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  note_id?: string;
  created_at?: string;
  subject_name?: string;
}

export const getImportantQuestions = async (params?: { subject?: string; subject_id?: string; unit?: number; topic?: string; difficulty?: string }): Promise<ImportantQuestion[]> => {
  const res = await api.get('/important-questions', { params });
  return res.data;
};

// Admin CRUD
export const adminGetImportantQuestions = async (): Promise<ImportantQuestion[]> => {
  const res = await api.get('/admin/important-questions');
  return res.data;
};

export const adminCreateImportantQuestion = async (data: Partial<ImportantQuestion>): Promise<ImportantQuestion> => {
  const res = await api.post('/admin/important-questions', data);
  return res.data;
};

export const adminUpdateImportantQuestion = async (id: string, data: Partial<ImportantQuestion>): Promise<ImportantQuestion> => {
  const res = await api.put(`/admin/important-questions/${id}`, data);
  return res.data;
};

export const adminDeleteImportantQuestion = async (id: string): Promise<void> => {
  await api.delete(`/admin/important-questions/${id}`);
};
