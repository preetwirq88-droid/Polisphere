import api from './client';

export interface Unit {
  unit_number: number;
  title: string;
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

// ── Complete 12-subject catalogue aligned with Homepage ──────────────────────
export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'political-theory',
    slug: 'political-theory',
    name: 'Political Theory',
    description: 'State, sovereignty, liberty, justice & ideology',
    icon: 'gavel',
    order: 1,
    units: [
      { unit_number: 1, title: 'State, Sovereignty & Power' },
      { unit_number: 2, title: 'Liberty, Equality & Justice' },
      { unit_number: 3, title: 'Rights, Citizenship & Democracy' },
    ],
  },
  {
    id: 'indian-political-thought',
    slug: 'indian-political-thought',
    name: 'Indian Political Thought',
    description: 'Gandhi, Ambedkar, Nehru & classical traditions',
    icon: 'account_balance',
    order: 2,
    units: [
      { unit_number: 1, title: 'Classical & Ancient Traditions' },
      { unit_number: 2, title: 'Modern Thinkers: Gandhi & Tagore' },
      { unit_number: 3, title: 'Ambedkar, Social Justice & Constitutionalism' },
    ],
  },
  {
    id: 'western-political-thought',
    slug: 'western-political-thought',
    name: 'Western Political Thought',
    description: 'Plato to Marx — key thinkers & concepts',
    icon: 'public',
    order: 3,
    units: [
      { unit_number: 1, title: 'Classical Greek Thought: Plato & Aristotle' },
      { unit_number: 2, title: 'Social Contract: Hobbes, Locke & Rousseau' },
      { unit_number: 3, title: 'Modern & Critical Thought: Mill & Marx' },
    ],
  },
  {
    id: 'indian-government-and-politics',
    slug: 'indian-government-and-politics',
    name: 'Indian Government & Politics',
    description: 'Constitution, federalism, elections & institutions',
    icon: 'flag',
    order: 4,
    units: [
      { unit_number: 1, title: 'Constitutional Foundations & Philosophy' },
      { unit_number: 2, title: 'Federalism & Institutional Machinery' },
      { unit_number: 3, title: 'Electoral Politics, Parties & Social Movements' },
    ],
  },
  {
    id: 'comparative-politics',
    slug: 'comparative-politics',
    name: 'Comparative Politics',
    description: 'Political systems, regimes & frameworks',
    icon: 'compare',
    order: 5,
    units: [
      { unit_number: 1, title: 'Approaches to Comparative Politics' },
      { unit_number: 2, title: 'Regimes, Democracies & Authoritarianism' },
      { unit_number: 3, title: 'Electoral Systems & Political Representation' },
    ],
  },
  {
    id: 'international-relations',
    slug: 'international-relations',
    name: 'International Relations',
    description: 'Realism, liberalism, diplomacy & global order',
    icon: 'language',
    order: 6,
    units: [
      { unit_number: 1, title: 'Theories of International Relations' },
      { unit_number: 2, title: 'Cold War to Contemporary Global Order' },
      { unit_number: 3, title: 'Global Political Economy & Security' },
    ],
  },
  {
    id: 'public-administration',
    slug: 'public-administration',
    name: 'Public Administration',
    description: 'Bureaucracy, governance & policy implementation',
    icon: 'corporate_fare',
    order: 7,
    units: [
      { unit_number: 1, title: 'Theories of Administrative Organisation' },
      { unit_number: 2, title: 'Public Policy Making & Implementation' },
      { unit_number: 3, title: 'Good Governance, Accountability & Citizen Charters' },
    ],
  },
  {
    id: 'constitution-and-political-institutions',
    slug: 'constitution-and-political-institutions',
    name: 'Constitution & Institutions',
    description: 'Parliament, judiciary, federalism & amendments',
    icon: 'library_books',
    order: 8,
    units: [
      { unit_number: 1, title: 'Preamble, Fundamental Rights & Directive Principles' },
      { unit_number: 2, title: 'Union Executive, Parliament & Supreme Court' },
      { unit_number: 3, title: 'Constitutional Amendments & Judicial Review' },
    ],
  },
  {
    id: 'human-rights',
    slug: 'human-rights',
    name: 'Human Rights',
    description: 'UDHR, UN mechanisms & rights frameworks',
    icon: 'diversity_3',
    order: 9,
    units: [
      { unit_number: 1, title: 'Concepts & Generations of Human Rights' },
      { unit_number: 2, title: 'International Human Rights Instruments & UDHR' },
      { unit_number: 3, title: 'Human Rights in India & Institutional Protection' },
    ],
  },
  {
    id: 'global-politics',
    slug: 'global-politics',
    name: 'Global Politics',
    description: 'Globalisation, security & world order post-1990',
    icon: 'travel_explore',
    order: 10,
    units: [
      { unit_number: 1, title: 'Globalisation: Dimensions & Debates' },
      { unit_number: 2, title: 'Global Environmental & Climate Politics' },
      { unit_number: 3, title: 'Contemporary Security, Conflict & Peacebuilding' },
    ],
  },
  {
    id: 'ugc-net-political-science',
    slug: 'ugc-net-political-science',
    name: 'UGC NET Political Science',
    description: 'Unit-wise syllabus coverage for UGC NET exam',
    icon: 'school',
    order: 11,
    units: [
      { unit_number: 1, title: 'Unit 1-3: Political Theory & Thinkers' },
      { unit_number: 2, title: 'Unit 4-6: Comparative Politics & IR' },
      { unit_number: 3, title: 'Unit 7-10: Indian Polity, Institutions & Public Policy' },
    ],
  },
  {
    id: 'mcqs-practice-tests',
    slug: 'mcqs-practice-tests',
    name: 'MCQs & Practice Tests',
    description: 'Topic-wise MCQs with answers and explanations',
    icon: 'quiz',
    order: 12,
    units: [
      { unit_number: 1, title: 'Political Theory & Thinkers Practice Bank' },
      { unit_number: 2, title: 'Indian Constitution & Government MCQs' },
      { unit_number: 3, title: 'International Relations & Global Affairs Drills' },
    ],
  },
];

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const res = await api.get('/subjects');
    if (Array.isArray(res.data) && res.data.length > 0) {
      // Merge backend subjects with any default subjects not yet in the DB
      const apiSlugs = new Set(res.data.map((s: Subject) => s.slug));
      const remaining = DEFAULT_SUBJECTS.filter((s) => !apiSlugs.has(s.slug));
      return [...res.data, ...remaining];
    }
    return DEFAULT_SUBJECTS;
  } catch (err) {
    console.warn('Backend API /subjects unavailable; using static catalogue fallback:', err);
    return DEFAULT_SUBJECTS;
  }
};

export const getSubjectBySlug = async (slug: string): Promise<Subject> => {
  try {
    const res = await api.get(`/subjects/${slug}`);
    return res.data;
  } catch (err) {
    const fallback = DEFAULT_SUBJECTS.find((s) => s.slug === slug);
    if (fallback) return fallback;
    throw err;
  }
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
