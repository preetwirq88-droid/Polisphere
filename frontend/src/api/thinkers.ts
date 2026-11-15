import api from './client';
import { THINKER_PROFILES, type ThinkerProfileData } from '../data/thinkerProfiles';

export interface Thinker {
  id: string;
  slug: string;
  name: string;
  lifespan?: string;
  era?: string;
  region?: string;
  tradition?: string;
  portrait_url: string;
  contribution: string;
  key_works: string[];
  bio: string;
  profile?: ThinkerProfileData;
  related_note_ids: string[];
  related_subject_ids: string[];
  created_at?: string;
  updated_at?: string;
}

// ── Complete Political Thinkers catalogue aligned with Homepage ──────────────
export const DEFAULT_THINKERS: Thinker[] = [
  {
    id: 'plato',
    slug: 'plato',
    name: 'Plato',
    lifespan: 'c. 428–348 BCE',
    era: 'Classical Antiquity',
    region: 'Athens, Ancient Greece',
    tradition: 'Classical Political Philosophy / Idealism',
    portrait_url: '/images/thinkers/plato.jpg',
    contribution: 'Classical Political Philosophy & Ideal State',
    key_works: [
      'The Republic (c. 375 BCE)',
      'The Statesman',
      'The Laws',
      'Apology',
    ],
    bio: 'Plato (c. 428–348 BCE) was an ancient Greek philosopher and founder of the Academy in Athens. Revered as the father of Western political philosophy, his masterwork The Republic explores justice, the tripartite soul, the Allegory of the Cave, and the concept of rule by Philosopher-Kings.',
    profile: THINKER_PROFILES['plato'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'political-theory'],
  },
  {
    id: 'aristotle',
    slug: 'aristotle',
    name: 'Aristotle',
    lifespan: '384–322 BCE',
    era: 'Classical Antiquity',
    region: 'Stagira / Athens, Ancient Greece',
    tradition: 'Classical Political Science & Empiricism',
    portrait_url: '/images/thinkers/aristotle.jpg',
    contribution: 'Constitutional Theory & The Master Science',
    key_works: [
      'Politics (c. 335 BCE)',
      'Nicomachean Ethics',
      'Constitution of the Athenians',
    ],
    bio: 'Aristotle (384–322 BCE) was an ancient Greek philosopher and polymath who studied under Plato. Defining politics as the "master science" and humanity as a "political animal" (zoon politikon), he empirically classified 158 constitutions to identify forms of rule and stability in the polis.',
    profile: THINKER_PROFILES['aristotle'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'comparative-politics'],
  },
  {
    id: 'niccolo-machiavelli',
    slug: 'niccolo-machiavelli',
    name: 'Niccolò Machiavelli',
    lifespan: '1469–1527',
    era: 'Renaissance',
    region: 'Florence, Italy',
    tradition: 'Political Realism & Civic Republicanism',
    portrait_url: '/images/thinkers/niccolo-machiavelli.jpg',
    contribution: 'Realist Statecraft & Autonomy of Politics',
    key_works: [
      'The Prince (1532)',
      'Discourses on Livy (1531)',
      'The Art of War (1521)',
    ],
    bio: 'Niccolò Machiavelli (1469–1527) was a Florentine diplomat and political theorist during the Renaissance. Often called the founder of modern political science, he emancipated politics from Christian morality, analyzing power, virtù, and fortuna in state survival and governance.',
    profile: THINKER_PROFILES['niccolo-machiavelli'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'international-relations'],
  },
  {
    id: 'thomas-hobbes',
    slug: 'thomas-hobbes',
    name: 'Thomas Hobbes',
    lifespan: '1588–1679',
    era: 'Early Modern Enlightenment',
    region: 'Westport / Derbyshire, England',
    tradition: 'Social Contract & Political Realism',
    portrait_url: '/images/thinkers/thomas-hobbes.jpg',
    contribution: 'Social Contract & Absolute Sovereignty',
    key_works: [
      'Leviathan (1651)',
      'De Cive (1642)',
      'Elements of Law (1640)',
    ],
    bio: 'Thomas Hobbes (1588–1679) was an English philosopher who pioneered modern social contract theory. In Leviathan, he argued that life in a pre-political state of nature is "solitary, poor, nasty, brutish, and short," justifying an absolute sovereign to maintain peace and order.',
    profile: THINKER_PROFILES['thomas-hobbes'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'political-theory'],
  },
  {
    id: 'john-locke',
    slug: 'john-locke',
    name: 'John Locke',
    lifespan: '1632–1704',
    era: 'Enlightenment',
    region: 'Wrington, Somerset, England',
    tradition: 'Classical Liberalism & Constitutionalism',
    portrait_url: '/images/thinkers/john-locke.jpg',
    contribution: 'Natural Rights & Limited Government',
    key_works: [
      'Two Treatises of Government (1689)',
      'An Essay Concerning Human Understanding (1689)',
      'A Letter Concerning Toleration (1689)',
    ],
    bio: 'John Locke (1632–1704) was an English Enlightenment philosopher hailed as the father of modern liberalism. He asserted that human beings possess inalienable natural rights to life, liberty, and estate, with government legitimacy resting solely on the consent of the governed.',
    profile: THINKER_PROFILES['john-locke'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'political-theory'],
  },
  {
    id: 'jean-jacques-rousseau',
    slug: 'jean-jacques-rousseau',
    name: 'Jean-Jacques Rousseau',
    lifespan: '1712–1778',
    era: 'Enlightenment / Pre-Romanticism',
    region: 'Geneva, Switzerland / France',
    tradition: 'Democratic Theory & Popular Sovereignty',
    portrait_url: '/images/thinkers/jean-jacques-rousseau.jpg',
    contribution: 'General Will & Popular Sovereignty',
    key_works: [
      'The Social Contract (1762)',
      'Discourse on the Origin of Inequality (1755)',
      'Emile, or On Education (1762)',
    ],
    bio: 'Jean-Jacques Rousseau (1712–1778) was a Genevan philosopher whose ideas profoundly shaped the French Revolution and democratic theory. He argued that true freedom is found in obedience to the "General Will" of a self-governing political community.',
    profile: THINKER_PROFILES['jean-jacques-rousseau'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'political-theory'],
  },
  {
    id: 'john-stuart-mill',
    slug: 'john-stuart-mill',
    name: 'John Stuart Mill',
    lifespan: '1806–1873',
    era: 'Victorian Era (19th Century)',
    region: 'London, England / Avignon, France',
    tradition: 'Utilitarianism & Liberal Democracy',
    portrait_url: '/images/thinkers/john-stuart-mill.jpg',
    contribution: 'Harm Principle & Utilitarian Liberty',
    key_works: [
      'On Liberty (1859)',
      'Utilitarianism (1861)',
      'Considerations on Representative Government (1861)',
      'The Subjection of Women (1869)',
    ],
    bio: 'John Stuart Mill (1806–1873) was an English philosopher and political economist. In On Liberty, he formulated the celebrated Harm Principle—arguing the only justification for state coercion is preventing harm to others—while pioneering liberal feminism and defense of free expression.',
    profile: THINKER_PROFILES['john-stuart-mill'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'political-theory'],
  },
  {
    id: 'karl-marx',
    slug: 'karl-marx',
    name: 'Karl Marx',
    lifespan: '1818–1883',
    era: '19th Century Industrial Era',
    region: 'Trier, Prussia / London, England',
    tradition: 'Scientific Socialism & Historical Materialism',
    portrait_url: '/images/thinkers/karl-marx.jpg',
    contribution: 'Historical Materialism & Class Struggle',
    key_works: [
      'The Communist Manifesto (1848)',
      'Das Kapital (1867)',
      'The German Ideology (1845)',
      'Economic and Philosophic Manuscripts of 1844',
    ],
    bio: 'Karl Marx (1818–1883) was a German philosopher, political theorist, and revolutionary socialist. His materialist conception of history demonstrated that societal development is propelled by class conflicts arising from economic modes of production.',
    profile: THINKER_PROFILES['karl-marx'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'political-theory'],
  },
  {
    id: 'mahatma-gandhi',
    slug: 'mahatma-gandhi',
    name: 'Mahatma Gandhi',
    lifespan: '1869–1948',
    era: '20th Century Anti-Colonial Era',
    region: 'Porbandar, Gujarat / New Delhi, India',
    tradition: 'Non-Violence (Ahimsa) & Moral Politics',
    portrait_url: '/images/thinkers/mahatma-gandhi.jpg',
    contribution: 'Satyagraha & Non-violent Resistance',
    key_works: [
      'Hind Swaraj (1909)',
      'The Story of My Experiments with Truth (1927)',
      'Constructive Programme (1941)',
    ],
    bio: 'Mohandas Karamchand Gandhi (1869–1948) was an Indian lawyer and anti-colonial leader who pioneered Satyagraha—mass civil resistance rooted in truth and absolute non-violence (Ahimsa). His ideals of Sarvodaya, Swaraj, and decentralized village republics transformed 20th-century political philosophy.',
    profile: THINKER_PROFILES['mahatma-gandhi'],
    related_note_ids: [],
    related_subject_ids: ['indian-political-thought', 'political-theory'],
  },
  {
    id: 'b-r-ambedkar',
    slug: 'b-r-ambedkar',
    name: 'B. R. Ambedkar',
    lifespan: '1891–1956',
    era: '20th Century Modern Era',
    region: 'Mhow, Madhya Pradesh / New Delhi, India',
    tradition: 'Constitutional Democracy & Social Justice',
    portrait_url: '/images/thinkers/b-r-ambedkar.jpg',
    contribution: 'Constitutional Democracy & Annihilation of Caste',
    key_works: [
      'Annihilation of Caste (1936)',
      'States and Minorities (1947)',
      'The Untouchables (1948)',
      'The Buddha and His Dhamma (1957)',
    ],
    bio: 'Bhimrao Ramji Ambedkar (1891–1956) was an Indian jurist, economist, and founding father of modern India who served as the Chairman of the Constitution Drafting Committee. He championed constitutional morality, dalit liberation, and radical social democracy.',
    profile: THINKER_PROFILES['b-r-ambedkar'],
    related_note_ids: [],
    related_subject_ids: ['indian-political-thought', 'constitution-and-political-institutions'],
  },
  {
    id: 'john-rawls',
    slug: 'john-rawls',
    name: 'John Rawls',
    lifespan: '1921–2002',
    era: 'Contemporary 20th Century',
    region: 'Baltimore, Maryland / Massachusetts, USA',
    tradition: 'Justice as Fairness & Liberal Egalitarianism',
    portrait_url: '/images/thinkers/john-rawls.jpg',
    contribution: 'Justice as Fairness & The Veil of Ignorance',
    key_works: [
      'A Theory of Justice (1971)',
      'Political Liberalism (1993)',
      'The Law of Peoples (1999)',
      'Justice as Fairness: A Restatement (2001)',
    ],
    bio: 'John Rawls (1921–2002) was an American moral and political philosopher whose A Theory of Justice revitalized liberal normative philosophy. Through the thought experiment of the "Original Position" behind a "Veil of Ignorance," he derived principles of equal basic liberties and the Difference Principle.',
    profile: THINKER_PROFILES['john-rawls'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'political-theory'],
  },
  {
    id: 'kautilya',
    slug: 'kautilya',
    name: 'Kautilya (Chanakya)',
    lifespan: 'c. 375–283 BCE',
    era: 'Ancient Classical India',
    region: 'Takshashila / Pataliputra, Ancient India',
    tradition: 'Arthashastra & Political Realism',
    portrait_url: '/images/thinkers/kautilya.jpg',
    contribution: 'Arthashastra & Realist Statecraft',
    key_works: [
      'Arthashastra (c. 300 BCE)',
      'Chanakya Niti',
    ],
    bio: 'Kautilya, also known as Chanakya (c. 375–283 BCE), was an ancient Indian statesman, philosopher, and chief advisor to Emperor Chandragupta Maurya. His Arthashastra is a foundational treatise on statecraft, espionage, economic administration, and the Mandala foreign policy theory.',
    profile: THINKER_PROFILES['kautilya'],
    related_note_ids: [],
    related_subject_ids: ['indian-political-thought', 'international-relations'],
  },
  {
    id: 'mary-wollstonecraft',
    slug: 'mary-wollstonecraft',
    name: 'Mary Wollstonecraft',
    lifespan: '1759–1797',
    era: 'Age of Enlightenment & Revolution',
    region: 'London, England / Paris, France',
    tradition: 'Feminist Political Theory & Republicanism',
    portrait_url: '/images/thinkers/mary-wollstonecraft.jpg',
    contribution: "Feminist Political Philosophy & Women's Rights",
    key_works: [
      'A Vindication of the Rights of Woman (1792)',
      'A Vindication of the Rights of Men (1790)',
    ],
    bio: 'Mary Wollstonecraft (1759–1797) was an English philosopher and writer celebrated as a pioneer of feminist political thought. She challenged the patriarchal social contract, advocating for equal education and political citizenship for women.',
    profile: THINKER_PROFILES['mary-wollstonecraft'],
    related_note_ids: [],
    related_subject_ids: ['western-political-thought', 'human-rights'],
  },
];

export const getThinkerPortraitUrl = (thinker: { slug?: string; portrait_url?: string }): string => {
  if (
    thinker.portrait_url &&
    !thinker.portrait_url.includes('upload.wikimedia.org') &&
    !thinker.portrait_url.includes('440px-')
  ) {
    return thinker.portrait_url;
  }
  const normalizedSlug = thinker.slug === 'j-s-mill' ? 'john-stuart-mill' : (thinker.slug || '');
  const match = DEFAULT_THINKERS.find((t) => t.slug === thinker.slug || t.slug === normalizedSlug);
  return match?.portrait_url || (thinker.slug ? `/images/thinkers/${thinker.slug}.jpg` : '');
};

export const getThinkers = async (): Promise<Thinker[]> => {
  try {
    const res = await api.get('/thinkers');
    if (Array.isArray(res.data) && res.data.length > 0) {
      const enhancedApiData: Thinker[] = res.data.map((item: Thinker) => {
        const normSlug = item.slug === 'j-s-mill' ? 'john-stuart-mill' : (item.slug || '');
        const fallbackMatch = DEFAULT_THINKERS.find((t) => t.slug === item.slug || t.slug === normSlug);
        return {
          ...fallbackMatch,
          ...item,
          portrait_url: getThinkerPortraitUrl(item),
          profile: item.profile || THINKER_PROFILES[normSlug] || fallbackMatch?.profile,
          lifespan: item.lifespan || fallbackMatch?.lifespan,
          era: item.era || fallbackMatch?.era,
          region: item.region || fallbackMatch?.region,
          tradition: item.tradition || fallbackMatch?.tradition,
        };
      });

      const apiSlugs = new Set(res.data.map((t: Thinker) => t.slug));
      // Normalize alias slugs (e.g. j-s-mill and john-stuart-mill)
      if (apiSlugs.has('j-s-mill')) apiSlugs.add('john-stuart-mill');
      if (apiSlugs.has('john-stuart-mill')) apiSlugs.add('j-s-mill');

      const remainingDefaults = DEFAULT_THINKERS.filter((t) => !apiSlugs.has(t.slug));
      return [...enhancedApiData, ...remainingDefaults];
    }
    return DEFAULT_THINKERS;
  } catch (err) {
    console.warn('Backend API /thinkers unavailable; using static catalogue fallback:', err);
    return DEFAULT_THINKERS;
  }
};

export const getThinkerBySlug = async (slug: string): Promise<Thinker> => {
  const normalizedSlug = slug === 'j-s-mill' ? 'john-stuart-mill' : slug;
  const fallback = DEFAULT_THINKERS.find(
    (t) => t.slug === slug || t.slug === normalizedSlug
  );
  try {
    const res = await api.get(`/thinkers/${slug}`);
    if (res.data) {
      return {
        ...fallback,
        ...res.data,
        portrait_url: getThinkerPortraitUrl(res.data),
        profile: res.data.profile || THINKER_PROFILES[normalizedSlug] || fallback?.profile,
        lifespan: res.data.lifespan || fallback?.lifespan,
        era: res.data.era || fallback?.era,
        region: res.data.region || fallback?.region,
        tradition: res.data.tradition || fallback?.tradition,
      };
    }
    return fallback || res.data;
  } catch (err) {
    if (fallback) return fallback;
    throw err;
  }
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
