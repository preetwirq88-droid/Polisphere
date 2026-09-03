import api from './client';

export interface SearchResultItem {
  id: string;
  title?: string;
  name?: string;
  slug: string;
  icon?: string;
  contribution?: string;
  portrait_url?: string;
  difficulty?: string;
}

export interface SearchResults {
  query: string;
  notes: SearchResultItem[];
  thinkers: SearchResultItem[];
  subjects: SearchResultItem[];
}

export const searchAll = async (query: string): Promise<SearchResults> => {
  const res = await api.get('/search', { params: { q: query } });
  return res.data;
};
