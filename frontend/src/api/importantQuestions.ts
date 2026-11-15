import api from './client';
import {
  QUESTIONS_CATALOGUE,
  SUBJECT_CATEGORIES,
  TOPIC_MOCK_TESTS,
  type AnyQuestion,
  type MCQQuestion,
  type ShortAnswerQuestion,
  type LongAnswerQuestion,
  type SubjectCategory,
  type QuestionCategory,
  type MockTestMeta,
} from '../data/questionsData';

export type {
  AnyQuestion,
  MCQQuestion,
  ShortAnswerQuestion,
  LongAnswerQuestion,
  SubjectCategory,
  QuestionCategory,
  MockTestMeta,
};

export { QUESTIONS_CATALOGUE, SUBJECT_CATEGORIES, TOPIC_MOCK_TESTS };

export interface ImportantQuestion {
  id: string;
  subject_id: string;
  unit_number: number;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  note_id?: string;
  note_slug?: string;
  created_at?: string;
  subject_name?: string;
  // Extended fields
  type?: QuestionCategory;
  marks?: number;
  options?: [string, string, string, string];
  correct_answer?: number;
  explanation?: string;
  model_answer?: any;
  is_pyq?: boolean;
  exam_details?: {
    examName: string;
    year: number;
    session?: string;
    paper?: string;
  };
}

/** Convert a catalog question to an ImportantQuestion object for API compatibility */
export const mapCatalogueToImportantQuestion = (q: AnyQuestion): ImportantQuestion => {
  return {
    id: q.id,
    subject_id: q.subject,
    unit_number: q.unit,
    topic: q.topic,
    difficulty: q.difficulty,
    question: q.question,
    note_slug: q.noteSlug,
    subject_name: q.subjectName,
    type: q.type,
    marks: 'marks' in q ? q.marks : undefined,
    options: 'options' in q ? q.options : undefined,
    correct_answer: 'correctAnswer' in q ? q.correctAnswer : undefined,
    explanation: 'explanation' in q ? q.explanation : undefined,
    model_answer: 'modelAnswer' in q ? q.modelAnswer : undefined,
    is_pyq: q.isPYQ,
    exam_details: q.examDetails,
  };
};

export const DEFAULT_IMPORTANT_QUESTIONS: ImportantQuestion[] =
  QUESTIONS_CATALOGUE.map(mapCatalogueToImportantQuestion);

export const getImportantQuestions = async (params?: {
  subject?: string;
  subject_id?: string;
  unit?: number;
  topic?: string;
  difficulty?: string;
}): Promise<ImportantQuestion[]> => {
  try {
    const res = await api.get('/important-questions', { params });
    if (Array.isArray(res.data) && res.data.length > 0) {
      // Merge backend questions with rich catalogue questions if catalogue has more items
      const backendIds = new Set(res.data.map((item: any) => String(item.id)));
      const fallbackQuestions = DEFAULT_IMPORTANT_QUESTIONS.filter(
        (q) => !backendIds.has(q.id)
      );
      return [...res.data, ...fallbackQuestions];
    }
    return DEFAULT_IMPORTANT_QUESTIONS;
  } catch (err) {
    console.warn('Backend API /important-questions unavailable; using static catalogue fallback:', err);
    return DEFAULT_IMPORTANT_QUESTIONS;
  }
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
