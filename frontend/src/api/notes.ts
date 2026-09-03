import api from './client';

export interface NoteSection {
  anchor: string;
  heading: string;
  body: string;
}

export interface ComparisonRow {
  label: string;
  values: string[];
}

export interface ComparisonTable {
  title: string;
  columns: string[];
  rows: ComparisonRow[];
}

export interface Note {
  id: string;
  slug: string;
  title: string;
  subject_id: string;
  unit_number: number;
  difficulty: 'introductory' | 'advanced';
  status: 'draft' | 'in_progress' | 'published';
  breadcrumb_trail: string[];
  sections: NoteSection[];
  comparison_table?: ComparisonTable;
  related_note_ids: string[];
  reading_time_minutes: number;
  keywords: string[];
  created_at?: string;
  updated_at?: string;
  subject_name?: string;
}

export const getNotes = async (params?: { subject_id?: string; subject_slug?: string; difficulty?: string; status_filter?: string }): Promise<Note[]> => {
  const res = await api.get('/notes', { params });
  return res.data;
};

export const getNoteBySlug = async (slug: string): Promise<Note> => {
  const res = await api.get(`/notes/${slug}`);
  return res.data;
};

// Admin CRUD
export const adminGetNotes = async (): Promise<Note[]> => {
  const res = await api.get('/admin/notes');
  return res.data;
};

export const adminCreateNote = async (data: Partial<Note>): Promise<Note> => {
  const res = await api.post('/admin/notes', data);
  return res.data;
};

export const adminUpdateNote = async (id: string, data: Partial<Note>): Promise<Note> => {
  const res = await api.put(`/admin/notes/${id}`, data);
  return res.data;
};

export const adminDeleteNote = async (id: string): Promise<void> => {
  await api.delete(`/admin/notes/${id}`);
};
