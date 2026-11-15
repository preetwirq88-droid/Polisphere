export type QuestionCategory = 'mcq' | 'short' | 'long' | 'pyq';

export type SubjectCategory =
  | 'ugc-net-paper-1'
  | 'ugc-net-political-science-paper-2'
  | 'indian-political-thought'
  | 'western-political-thought'
  | 'political-theory'
  | 'international-relations'
  | 'comparative-politics'
  | 'university-semester';

export interface SubjectMeta {
  id: SubjectCategory;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const SUBJECT_CATEGORIES: SubjectMeta[] = [
  {
    id: 'ugc-net-paper-1',
    name: 'UGC NET Paper 1',
    icon: 'school',
    color: 'from-blue-700 to-indigo-800',
    description: 'Teaching Aptitude, Research Methodology, Higher Education System & ICT.',
  },
  {
    id: 'ugc-net-political-science-paper-2',
    name: 'UGC NET Political Science Paper 2',
    icon: 'menu_book',
    color: 'from-indigo-800 to-purple-800',
    description: 'Complete Paper 2 syllabus: Political Theory, Thought, IR, Comparative & Indian Polity.',
  },
  {
    id: 'indian-political-thought',
    name: 'Indian Political Thought',
    icon: 'account_balance',
    color: 'from-amber-700 to-amber-900',
    description: 'Classical traditions (Kautilya, Manu) through modern thinkers (Ambedkar, Gandhi, Roy).',
  },
  {
    id: 'western-political-thought',
    name: 'Western Political Thought',
    icon: 'history_edu',
    color: 'from-emerald-700 to-teal-900',
    description: 'From Plato & Aristotle through Hobbes, Locke, Mill, Marx to John Rawls.',
  },
  {
    id: 'political-theory',
    name: 'Political Theory',
    icon: 'psychology',
    color: 'from-violet-700 to-purple-900',
    description: 'Core concepts: Liberty, Equality, Justice, Rights, Sovereignty, Power & Democracy.',
  },
  {
    id: 'international-relations',
    name: 'International Relations',
    icon: 'public',
    color: 'from-cyan-700 to-blue-900',
    description: 'Theories (Realism, Liberalism, Constructivism), Global Order, UN & Foreign Policy.',
  },
  {
    id: 'comparative-politics',
    name: 'Comparative Politics',
    icon: 'compare_arrows',
    color: 'from-rose-700 to-red-900',
    description: 'Regimes, Political Systems, Constitutions, Electoral Systems & Party Politics.',
  },
  {
    id: 'university-semester',
    name: 'University Semester Exam Questions',
    icon: 'quiz',
    color: 'from-orange-700 to-amber-800',
    description: 'BA & MA university exam questions organized by marks (2, 4, 5, 10, 15 marks).',
  },
];

export interface BaseQuestion {
  id: string;
  type: QuestionCategory;
  subject: SubjectCategory;
  subjectName: string;
  unit: number;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  noteSlug?: string;
  isPYQ?: boolean;
  examDetails?: {
    examName: string;
    year: number;
    session?: string;
    paper?: string;
  };
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short';
  marks: 2 | 4 | 5;
  expectedWordCount: string;
  modelAnswer: {
    summary: string;
    keyPoints: string[];
    examTip?: string;
  };
}

export interface LongAnswerQuestion extends BaseQuestion {
  type: 'long';
  marks: 10 | 12 | 15;
  expectedWordCount: string;
  modelAnswer: {
    introduction: string;
    sections: {
      heading: string;
      points: string[];
    }[];
    criticalEvaluation: string;
    conclusion: string;
  };
}

export type AnyQuestion = MCQQuestion | ShortAnswerQuestion | LongAnswerQuestion;

/* ═════════════════════════════════════════════════════════════════════════
   COMPREHENSIVE AUTHENTIC POLITICAL SCIENCE QUESTIONS CATALOGUE
   ═════════════════════════════════════════════════════════════════════════ */

export const QUESTIONS_CATALOGUE: AnyQuestion[] = [
  /* ─────────────────────────────────────────────────────────────────────────
     MCQS (Multiple Choice Questions)
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: 'mcq-wpt-01',
    type: 'mcq',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    unit: 1,
    topic: 'Plato & The Ideal State',
    difficulty: 'intermediate',
    question: 'In Plato’s "The Republic", who among the following is considered qualified to govern the Ideal State (Kallipolis)?',
    options: [
      'The wealthiest merchants and property owners (Oligarchs)',
      'The most courageous military commanders (Auxiliaries)',
      'Philosopher-Kings possessed of reason and knowledge of the Form of the Good',
      'The majority of citizens elected by direct popular vote (Demos)',
    ],
    correctAnswer: 2,
    explanation:
      'Plato argued in Book V of The Republic that until philosophers become kings, or the kings of this world have the spirit and power of philosophy, cities will never have rest from their evils. Philosopher-kings represent the rational element of the tripartite soul, possessing true episteme (knowledge) rather than mere doxa (opinion).',
    noteSlug: 'plato-ideal-state',
  },
  {
    id: 'mcq-wpt-02',
    type: 'mcq',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    unit: 2,
    topic: 'Aristotle & Constitutional Theory',
    difficulty: 'intermediate',
    question: 'Aristotle defined the state as a natural community and humans as "zoon politikon". Which constitution did he identify as the best practicable form of government?',
    options: [
      'Pure Democracy led by the popular assembly',
      'Polity (Constitutional rule governed by the middle class)',
      'Absolute Monarchy governed by hereditary succession',
      'Tyranny supported by military force',
    ],
    correctAnswer: 1,
    explanation:
      'In his Politics (Book IV), Aristotle argued that "Polity" (a moderate mixture of oligarchy and democracy governed primarily by a large middle class) is the most stable and practically attainable regime, as the middle class is least prone to factional extremes and envy.',
    noteSlug: 'aristotle-constitutions',
  },
  {
    id: 'mcq-wpt-03',
    type: 'mcq',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    unit: 3,
    topic: 'Thomas Hobbes & Social Contract',
    difficulty: 'beginner',
    question: 'How did Thomas Hobbes famously describe the life of man in the pre-political "State of Nature" in Leviathan (1651)?',
    options: [
      'Free, peaceful, equal, and characterized by mutual cooperation',
      'Solitary, poor, nasty, brutish, and short',
      'A golden era of noble savages uncorrupted by private property',
      'A moral order governed by natural law and impartial arbitration',
    ],
    correctAnswer: 1,
    explanation:
      'In Chapter XIII of Leviathan, Hobbes asserted that in the absence of a common sovereign power to overawe them all, humans exist in a condition of perpetual war of every man against every man, rendering life "solitary, poor, nasty, brutish, and short."',
    noteSlug: 'hobbes-leviathan',
  },
  {
    id: 'mcq-wpt-04',
    type: 'mcq',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    unit: 4,
    topic: 'John Locke & Natural Rights',
    difficulty: 'intermediate',
    question: 'According to John Locke’s "Second Treatise of Government" (1689), what are the fundamental inalienable natural rights possessed by all individuals?',
    options: [
      'Food, shelter, and employment',
      'Life, liberty, and estate (property)',
      'Security, absolute obedience, and order',
      'Fraternity, equality, and state welfare',
    ],
    correctAnswer: 1,
    explanation:
      'Locke argued that humans are born with natural rights to life, liberty, and estate (property). The sole legitimate purpose of establishing political society through the social contract is the impartial protection of these pre-existing natural rights.',
    noteSlug: 'locke-two-treatises',
  },
  {
    id: 'mcq-wpt-05',
    type: 'mcq',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    unit: 5,
    topic: 'J.S. Mill & Freedom of Speech',
    difficulty: 'advanced',
    question: 'In "On Liberty" (1859), what boundary does J.S. Mill formulate to justify legitimate state intervention against individual liberty?',
    options: [
      'The Paternalist Mandate (the state can intervene to protect individuals from self-harm)',
      'The Harm Principle (coercion is justified only to prevent harm to others)',
      'The Majoritarian Principle (the will of 51% overrides minority preferences)',
      'The Divine Right Principle (morality defined by ecclesiastical scripture)',
    ],
    correctAnswer: 1,
    explanation:
      'Mill formulated the Harm Principle: "The only purpose for which power can be rightfully exercised over any member of a civilized community, against his will, is to prevent harm to others. His own good, either physical or moral, is not a sufficient warrant."',
    noteSlug: 'j-s-mill-on-liberty',
  },
  {
    id: 'mcq-ipt-01',
    type: 'mcq',
    subject: 'indian-political-thought',
    subjectName: 'Indian Political Thought',
    unit: 1,
    topic: 'Kautilya & Saptanga Theory',
    difficulty: 'intermediate',
    question: 'In Kautilya’s "Arthashastra", the state is conceived as an organic entity comprising seven limbs (Saptanga). Which limb represents the King/Ruler?',
    options: [
      'Amatya',
      'Swami',
      'Janapada',
      'Danda',
    ],
    correctAnswer: 1,
    explanation:
      'Kautilya’s Saptanga theory identifies the seven organic constituent elements of the state: Swami (The King/Sovereign - the head), Amatya (Ministers/Bureaucrats - the eyes), Janapada/Rashtra (Territory and Population), Durga (Fortified Capital), Kosha (Treasury), Danda/Bala (Armed Forces), and Mitra (Allies).',
    noteSlug: 'kautilya-arthashastra',
  },
  {
    id: 'mcq-ipt-02',
    type: 'mcq',
    subject: 'indian-political-thought',
    subjectName: 'Indian Political Thought',
    unit: 3,
    topic: 'B.R. Ambedkar & Social Democracy',
    difficulty: 'advanced',
    question: 'In his landmark address "Annihilation of Caste" (1936), Dr. B.R. Ambedkar asserted that political democracy cannot survive unless it is founded upon:',
    options: [
      'A centralized military apparatus',
      'Economic nationalization of all industries',
      'Social democracy (liberty, equality, and fraternity recognized as principles of life)',
      'Strict preservation of traditional Hindu Shastric hierarchy',
    ],
    correctAnswer: 2,
    explanation:
      'Dr. Ambedkar stated: "Political democracy cannot last unless there lies at the base of it social democracy. What does social democracy mean? It means a way of life which recognizes liberty, equality, and fraternity as the principles of life."',
    noteSlug: 'ambedkar-annihilation-of-caste',
  },
  {
    id: 'mcq-ipt-03',
    type: 'mcq',
    subject: 'indian-political-thought',
    subjectName: 'Indian Political Thought',
    unit: 2,
    topic: 'Mahatma Gandhi & Satyagraha',
    difficulty: 'beginner',
    question: 'In "Hind Swaraj" (1909), Mahatma Gandhi conceptualized "Swaraj" primarily as:',
    options: [
      'Mere transfer of state power from British elites to Indian elites',
      'Self-rule and self-mastery rooted in moral autonomy and ethical conduct',
      'Rapid westernized industrialization with heavy machinery',
      'A centralized authoritarian socialist state',
    ],
    correctAnswer: 1,
    explanation:
      'Gandhi distinguished between political independence (which he called "English rule without the Englishman") and genuine Swaraj. True Swaraj is self-rule, self-control, and ethical self-transformation based on truth (Satya) and non-violence (Ahimsa).',
    noteSlug: 'gandhi-hind-swaraj',
  },
  {
    id: 'mcq-pt-01',
    type: 'mcq',
    subject: 'political-theory',
    subjectName: 'Political Theory',
    unit: 1,
    topic: 'John Rawls & Theory of Justice',
    difficulty: 'advanced',
    question: 'Under John Rawls’ "Veil of Ignorance" in "A Theory of Justice" (1971), which principle governs economic inequalities?',
    options: [
      'The Pareto Optimality Principle',
      'The Utilitarian Greatest Happiness Principle',
      'The Difference Principle (inequalities are permitted only if they benefit the least-advantaged members of society)',
      'Strict absolute arithmetic equality of all material assets',
    ],
    correctAnswer: 2,
    explanation:
      'Rawls’ second principle of justice includes the Difference Principle: social and economic inequalities are permissible only if they are attached to offices open to all under fair equality of opportunity, and are to the greatest benefit of the least-advantaged members of society (maximin rule).',
    noteSlug: 'rawls-theory-of-justice',
  },
  {
    id: 'mcq-pt-02',
    type: 'mcq',
    subject: 'political-theory',
    subjectName: 'Political Theory',
    unit: 2,
    topic: 'Isaiah Berlin & Concepts of Liberty',
    difficulty: 'intermediate',
    question: 'In "Two Concepts of Liberty" (1958), Isaiah Berlin defines Negative Liberty as:',
    options: [
      'The capacity for collective democratic self-determination',
      'The absence of external obstacles, interference, or coercion by other human beings',
      'Obedience to the rational general will of the community',
      'The psychological mastery of passions by rational intellect',
    ],
    correctAnswer: 1,
    explanation:
      'Berlin defined negative liberty as the area within which a person can act unobstructed by others ("freedom from"). In contrast, positive liberty involves being one’s own master or achieving self-realization through collective autonomy ("freedom to").',
    noteSlug: 'berlin-two-concepts-of-liberty',
  },
  {
    id: 'mcq-ir-01',
    type: 'mcq',
    subject: 'international-relations',
    subjectName: 'International Relations',
    unit: 1,
    topic: 'Realism in International Relations',
    difficulty: 'intermediate',
    question: 'Which of the following is a core structural assumption of Neo-Realism (Structural Realism) formulated by Kenneth Waltz in "Theory of International Politics" (1979)?',
    options: [
      'International institutions can eliminate power competition permanently',
      'The international system is characterized by anarchy (absence of central authority), forcing states into self-help behavior',
      'Domestic political regime types are the primary determinant of foreign policy',
      'Economic interdependence eliminates military conflict between sovereign nations',
    ],
    correctAnswer: 1,
    explanation:
      'Waltz posited that the ordering principle of international relations is anarchy. Because there is no overarching global sovereign to provide security, states exist in a self-help system where survival requires balance of power and material military capabilities.',
    noteSlug: 'realism-international-relations',
  },
  {
    id: 'mcq-ir-02',
    type: 'mcq',
    subject: 'international-relations',
    subjectName: 'International Relations',
    unit: 2,
    topic: 'Liberalism & Complex Interdependence',
    difficulty: 'advanced',
    question: 'In "Power and Interdependence" (1977), Robert Keohane and Joseph Nye introduced the concept of "Complex Interdependence" characterized by:',
    options: [
      'Sole reliance on nuclear deterrence and bilateral security pacts',
      'Multiple channels of contact (transnational and transgovernmental), absence of military hierarchy among issues, and minor role of military force',
      'The complete elimination of sovereign nation-states by multinational corporations',
      'Strict unipolar hegemony enforced by a single global empire',
    ],
    correctAnswer: 1,
    explanation:
      'Keohane and Nye argued that modern world politics involves complex interdependence, where multiple transnational channels connect societies, interstate agendas lack a rigid hierarchy (economic and ecological issues equal security), and military force is ineffective across interdependent partners.',
    noteSlug: 'liberalism-international-relations',
  },
  {
    id: 'mcq-cp-01',
    type: 'mcq',
    subject: 'comparative-politics',
    subjectName: 'Comparative Politics',
    unit: 2,
    topic: 'Duverger’s Law & Electoral Systems',
    difficulty: 'intermediate',
    question: 'According to Maurice Duverger’s celebrated sociological law in Comparative Politics, single-member district plurality (First-Past-The-Post) voting systems tend to favor:',
    options: [
      'A multi-party coalition system',
      'A stable two-party system',
      'A single totalitarian vanguard party',
      'Direct participatory citizen assemblies without parties',
    ],
    correctAnswer: 1,
    explanation:
      'Duverger’s Law (1951) states that simple-majority single-ballot electoral systems (FPTP) favor a two-party system due to the mechanical factor (disproportionate seat rewards for large parties) and psychological factor (voters avoiding wasting ballots on third parties).',
    noteSlug: 'duverger-party-systems',
  },
  {
    id: 'mcq-net1-01',
    type: 'mcq',
    subject: 'ugc-net-paper-1',
    subjectName: 'UGC NET Paper 1',
    unit: 1,
    topic: 'Teaching & Research Aptitude',
    difficulty: 'intermediate',
    question: 'Which research method is characterized by formulating hypotheses beforehand, controlling extraneous variables, and testing causal relationships under rigorous conditions?',
    options: [
      'Ethnographic Field Research',
      'Experimental Research',
      'Historical Archival Analysis',
      'Phenomenological Case Study',
    ],
    correctAnswer: 1,
    explanation:
      'Experimental research is the quantitative design specifically structured to establish cause-and-effect relationships by manipulating an independent variable, measuring the dependent variable, and controlling confounding variables through random assignment.',
    noteSlug: 'ugc-net-paper-1-research',
  },
  {
    id: 'mcq-net2-01',
    type: 'mcq',
    subject: 'ugc-net-political-science-paper-2',
    subjectName: 'UGC NET Political Science Paper 2',
    unit: 2,
    topic: 'Indian Constitution & Federalism',
    difficulty: 'advanced',
    question: 'Which constitutional landmark case established the "Basic Structure Doctrine", ruling that Parliament cannot alter the essential identity of the Indian Constitution under Article 368?',
    options: [
      'Shankari Prasad v. Union of India (1951)',
      'Golaknath v. State of Punjab (1967)',
      'Kesavananda Bharati v. State of Kerala (1973)',
      'Minerva Mills v. Union of India (1980)',
    ],
    correctAnswer: 2,
    explanation:
      'In the historic 13-judge bench ruling of Kesavananda Bharati v. State of Kerala (1973), the Supreme Court ruled by a 7-6 majority that while Parliament has wide constituent powers to amend the Constitution, it cannot alter or abrogate its "Basic Structure".',
    noteSlug: 'constitution-basic-structure',
  },

  /* ─────────────────────────────────────────────────────────────────────────
     SHORT ANSWER QUESTIONS (2–5 Marks)
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: 'short-wpt-01',
    type: 'short',
    marks: 4,
    expectedWordCount: '60–80 words',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    unit: 5,
    topic: 'J.S. Mill: Harm Principle',
    difficulty: 'intermediate',
    question: 'Explain J.S. Mill’s distinction between "Self-Regarding" and "Other-Regarding" actions in "On Liberty". (4 Marks)',
    modelAnswer: {
      summary:
        'In On Liberty (1859), John Stuart Mill divided human actions into two distinct spheres to delineate the boundary of state and societal authority over individual liberty.',
      keyPoints: [
        'Self-Regarding Actions: Actions that affect only the individual agent directly and in the first instance (e.g. personal beliefs, lifestyle, taste). In this sphere, the individual is completely sovereign; neither state nor public opinion may legitimately interfere.',
        'Other-Regarding Actions: Actions that directly impact, harm, or violate the distinct, assignable rights of others (e.g. theft, assault, fraud). Only in this sphere does society possess legitimate coercive jurisdiction to prevent harm.',
      ],
      examTip:
        'Always quote Mill’s core dictum: "Over himself, over his own body and mind, the individual is sovereign."',
    },
    noteSlug: 'j-s-mill-on-liberty',
  },
  {
    id: 'short-ipt-01',
    type: 'short',
    marks: 5,
    expectedWordCount: '80–120 words',
    subject: 'indian-political-thought',
    subjectName: 'Indian Political Thought',
    unit: 3,
    topic: 'Ambedkar: Constitutional Morality',
    difficulty: 'advanced',
    question: 'What did Dr. B.R. Ambedkar mean by "Constitutional Morality"? Why did he emphasize it in the Constituent Assembly? (5 Marks)',
    modelAnswer: {
      summary:
        'Addressing the Constituent Assembly on November 4, 1948, Dr. B.R. Ambedkar borrowed the concept of Constitutional Morality from historian George Grote, defining it as an indispensable civic virtue for democratic stability.',
      keyPoints: [
        'Supreme Allegiance to the Constitution: It requires citizens, leaders, and institutions to prioritize constitutional rules, checks and balances, and legal procedures over personal hero-worship (Bhakti in politics) or violent extra-constitutional protest.',
        'Not a Natural Sentiment: Ambedkar famously warned that constitutional morality is "not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it."',
        'Defense of Pluralism & Minority Rights: It compels ruling majorities to respect minority safeguards and uphold institutional restraint rather than descending into majoritarian tyranny.',
      ],
      examTip:
        'Mention Ambedkar’s warning against "Bhakti in politics" leading inevitably to degradation and ultimate dictatorship.',
    },
    noteSlug: 'ambedkar-annihilation-of-caste',
  },
  {
    id: 'short-pt-01',
    type: 'short',
    marks: 5,
    expectedWordCount: '80–120 words',
    subject: 'political-theory',
    subjectName: 'Political Theory',
    unit: 2,
    topic: 'Berlin: Negative vs Positive Liberty',
    difficulty: 'intermediate',
    question: 'Distinguish clearly between Negative Liberty and Positive Liberty with reference to Isaiah Berlin. (5 Marks)',
    modelAnswer: {
      summary:
        'In his 1958 inaugural lecture "Two Concepts of Liberty", Oxford philosopher Isaiah Berlin systematically contrasted negative and positive freedom.',
      keyPoints: [
        'Negative Liberty ("Freedom From"): Answers the question: "What is the area within which the subject is left to do or be what he is able to do or be, without interference by other persons?" It prioritizes personal privacy, non-interference, and limited state power.',
        'Positive Liberty ("Freedom To"): Answers the question: "What, or who, is the source of control or interference that can determine someone to do, or be, this rather than that?" It centers on rational self-direction, democratic self-governance, and achieving one’s potential.',
        'Berlin’s Caution: Berlin warned that positive liberty can be perverted by authoritarian regimes into forcing individuals to be "rational" or "free" against their will, justifying totalitarianism.',
      ],
      examTip:
        'Contrast the key thinkers: Locke and Mill championed Negative Liberty, while Rousseau and Hegel emphasized Positive Liberty.',
    },
    noteSlug: 'berlin-two-concepts-of-liberty',
  },
  {
    id: 'short-ipt-02',
    type: 'short',
    marks: 4,
    expectedWordCount: '60–80 words',
    subject: 'indian-political-thought',
    subjectName: 'Indian Political Thought',
    unit: 1,
    topic: 'Kautilya: Saptanga Theory',
    difficulty: 'beginner',
    question: 'Enumerate the seven limbs (Saptanga) of the state as described by Kautilya in the Arthashastra. (4 Marks)',
    modelAnswer: {
      summary:
        'Kautilya compared the state to a living human organism having seven interlinked constituent organs (limbs) that must function in harmony for sovereign stability.',
      keyPoints: [
        '1. Swami: The King / Sovereign Leader (the head of the state).',
        '2. Amatya: Council of Ministers, senior advisors, and administrative officials (the eyes).',
        '3. Janapada: The territory and fertile agricultural countryside inhabited by loyal population (the legs).',
        '4. Durga: The fortified capital and defensive border forts (the arms).',
        '5. Kosha: The state treasury accumulated legitimately through fair taxation (the mouth).',
        '6. Danda (or Bala): The standing military army and law enforcement apparatus (the brain/coercive power).',
        '7. Mitra: Dependable foreign allies and friendly neighboring rulers (the ears).',
      ],
      examTip:
        'Conclude by stating that Kautilya declared a king without capable allies or an empty treasury cannot sustain sovereignty.',
    },
    noteSlug: 'kautilya-arthashastra',
  },
  {
    id: 'short-ir-01',
    type: 'short',
    marks: 5,
    expectedWordCount: '80–120 words',
    subject: 'international-relations',
    subjectName: 'International Relations',
    unit: 1,
    topic: 'Classical Realism vs Structural Realism',
    difficulty: 'advanced',
    question: 'Differentiate between Classical Realism (Hans Morgenthau) and Structural Realism (Kenneth Waltz). (5 Marks)',
    modelAnswer: {
      summary:
        'While both schools view international politics as a competitive struggle for power, they locate the primary cause of conflict in fundamentally different levels of analysis.',
      keyPoints: [
        'Classical Realism (Human Nature): Hans Morgenthau (Politics Among Nations, 1948) grounded conflict in flawed human nature and an inherent human lust for power (animus dominandi). States pursue power because human beings inherently strive for dominance.',
        'Structural Realism / Neo-Realism (Systemic Anarchy): Kenneth Waltz (Theory of International Politics, 1979) rejected human nature explanations. He argued that the ordering principle of international anarchy (absence of higher authority) compels all states to pursue power and balance against threats to survive.',
      ],
      examTip:
        'Highlight the keywords: "Human Nature" (Morgenthau) vs "Systemic Anarchy & Distribution of Capabilities" (Waltz).',
    },
    noteSlug: 'realism-international-relations',
  },
  {
    id: 'short-sem-01',
    type: 'short',
    marks: 5,
    expectedWordCount: '80–120 words',
    subject: 'university-semester',
    subjectName: 'University Semester Exam Questions',
    unit: 1,
    topic: 'Indian Constitution: Fundamental Rights vs DPSPs',
    difficulty: 'intermediate',
    question: 'Distinguish between Fundamental Rights (Part III) and Directive Principles of State Policy (Part IV) in the Indian Constitution. (5 Marks)',
    modelAnswer: {
      summary:
        'The Indian Constitution balances individual civil-political liberties with collective socio-economic justice through Parts III and IV, forming the conscience of the Constitution.',
      keyPoints: [
        'Justiciability: Fundamental Rights (Articles 12–35) are legally enforceable in courts under Articles 32 and 226. DPSPs (Articles 36–51) are non-justiciable (Article 37) and cannot be enforced directly via judicial mandamus.',
        'Nature of Obligation: Fundamental Rights impose largely negative injunctions restraining the state from encroaching on citizen freedoms. DPSPs impose positive obligations directing the state to establish socio-economic democracy.',
        'Harmonious Construction: In Minerva Mills (1980), the Supreme Court ruled that Fundamental Rights and DPSPs are two wheels of a chariot; neither is inherently superior to the other.',
      ],
      examTip:
        'Cite the Minerva Mills (1980) landmark ruling on harmonious construction.',
    },
    noteSlug: 'constitution-fundamental-rights-dpsp',
  },

  /* ─────────────────────────────────────────────────────────────────────────
     LONG ANSWER QUESTIONS (10–15 Marks)
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: 'long-pt-01',
    type: 'long',
    marks: 15,
    expectedWordCount: '450–600 words',
    subject: 'political-theory',
    subjectName: 'Political Theory',
    unit: 1,
    topic: 'John Rawls: Theory of Justice',
    difficulty: 'advanced',
    question: 'Critically examine John Rawls’ Theory of Justice as Fairness. Discuss the concept of the "Original Position" and evaluate his Two Principles of Justice. (15 Marks)',
    modelAnswer: {
      introduction:
        'Published in 1971, John Rawls’ masterwork "A Theory of Justice" revived normative political philosophy in the Anglo-American tradition. Rawls presented "Justice as Fairness" as an explicit deontological alternative to dominant utilitarian paradigms that subordinate individual rights to aggregate societal utility. Rawls posited that justice is the first virtue of social institutions, just as truth is of systems of thought.',
      sections: [
        {
          heading: '1. The Methodological Framework: Original Position & Veil of Ignorance',
          points: [
            'The Original Position is an abstract social contract thought experiment designed to ensure complete fairness and impartiality in selecting foundational principles of social cooperation.',
            'Parties are situated behind a "Veil of Ignorance", depriving them of knowledge concerning their social class, race, gender, natural talents, intelligence, generation, and personal conception of the good life.',
            'Because rational agents operate under uncertainty, they adopt the "Maximin Rule"—choosing principles that maximize the minimum payoff, protecting themselves against the worst possible socioeconomic outcome.',
          ],
        },
        {
          heading: '2. The Two Principles of Justice (in Lexical Priority)',
          points: [
            'First Principle (Equal Basic Liberties): Each person has an equal right to the most extensive total system of equal basic liberties compatible with a similar system of liberty for all (freedom of thought, speech, assembly, and political franchise). This principle has strict lexical priority over economic equality.',
            'Second Principle (Fair Equality of Opportunity & Difference Principle): Social and economic inequalities are permitted only if they satisfy two strict conditions:',
            '(a) Fair Equality of Opportunity: Offices and positions must be genuinely open to all under conditions of fair educational and social opportunity.',
            '(b) The Difference Principle: Inequalities must work to the greatest benefit of the least-advantaged members of society.',
          ],
        },
        {
          heading: '3. Scholarly Criticisms',
          points: [
            'Libertarian Critique (Robert Nozick): In "Anarchy, State, and Utopia" (1974), Nozick argued that Rawls’ Difference Principle treats natural talents as collective assets, requiring continuous state redistribution that violates self-ownership and property rights.',
            'Communitarian Critique (Michael Sandel): Sandel criticized Rawls’ conception of the "unencumbered self", arguing that individuals cannot be detached from community, culture, and constitutive attachments.',
            'Marxist Critique: Marxists argue that Rawls merely provides a moral justification for welfare-state capitalism without dismantling private ownership of production.',
          ],
        },
      ],
      criticalEvaluation:
        'Despite widespread criticism, Rawls provided an enduring framework that synthesizes liberal commitment to individual rights with social democratic egalitarianism, profoundly influencing modern constitutionalism and distributive justice debates.',
      conclusion:
        'In conclusion, Rawls demonstrated that social inequalities are not natural inevitabilities; they can be morally justified only when arranged to uplift the most vulnerable. Justice as Fairness remains the foundational reference point for contemporary democratic theory.',
    },
    noteSlug: 'rawls-theory-of-justice',
  },
  {
    id: 'long-wpt-01',
    type: 'long',
    marks: 15,
    expectedWordCount: '450–600 words',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    unit: 4,
    topic: 'Karl Marx: Historical Materialism & Class Struggle',
    difficulty: 'advanced',
    question: 'Critically analyze Karl Marx’s Materialist Conception of History (Historical Materialism). How does class struggle propel societal transformation? (15 Marks)',
    modelAnswer: {
      introduction:
        'Karl Marx, along with Friedrich Engels, pioneered the Materialist Conception of History as formulated in "The German Ideology" (1845) and the Preface to "A Contribution to the Critique of Political Economy" (1859). Turning Hegelian idealism on its head, Marx argued that the economic mode of production forms the foundational base of society, determining its legal, political, and ideological superstructure.',
      sections: [
        {
          heading: '1. The Base and Superstructure Model',
          points: [
            'Forces of Production: Includes physical means of production (tools, factories, technology, natural raw materials) and human labor power.',
            'Relations of Production: The socioeconomic relationships people enter into independent of their will, primarily property relations dividing society into owners and non-owners.',
            'The Economic Base: The totality of production relations constitutes the economic base upon which arises the legal and political superstructure (laws, state, religion, morality).',
          ],
        },
        {
          heading: '2. Dialectical Transformation & Epochs of History',
          points: [
            'Societal change occurs when developing productive forces outgrow existing relations of production, turning property relations into fetters and ushering in an epoch of social revolution.',
            'Marx identified historical stages: Primitive Communism -> Ancient Slave Society -> Feudalism -> Capitalism -> Future Socialism and Stateless Communism.',
          ],
        },
        {
          heading: '3. Class Struggle as the Engine of History',
          points: [
            '"The history of all hitherto existing society is the history of class struggles" (The Communist Manifesto, 1848).',
            'In capitalist society, society polarizes into two hostile camps: the Bourgeoisie (owners of capital) and the Proletariat (wage-laborers who own only their labor power).',
            'Surplus value extracted from worker labor produces alienation and inevitable economic crises of overproduction, driving the proletariat toward revolutionary class consciousness.',
          ],
        },
      ],
      criticalEvaluation:
        'Critics such as Max Weber emphasized that multidimensional status and bureaucratic authority also shape power independent of economics. Karl Popper argued that Marx’s historicism produced unfalsifiable prophecies. However, Marx’s critique of commodity fetishism and capitalist inequality remains deeply incisive in the contemporary era of globalized capital.',
      conclusion:
        'In conclusion, Historical Materialism revolutionized political sociology by demonstrating that political institutions and ideas reflect economic realities, providing an indispensable lens for understanding structural inequality and historical change.',
    },
    noteSlug: 'marx-historical-materialism',
  },
  {
    id: 'long-ipt-01',
    type: 'long',
    marks: 15,
    expectedWordCount: '450–600 words',
    subject: 'indian-political-thought',
    subjectName: 'Indian Political Thought',
    unit: 2,
    topic: 'Mahatma Gandhi: Swaraj & Satyagraha',
    difficulty: 'advanced',
    question: 'Examine Mahatma Gandhi’s concept of "Swaraj" and "Satyagraha". How did Gandhi formulate an ethical alternative to Western statecraft? (15 Marks)',
    modelAnswer: {
      introduction:
        'Mohandas Karamchand Gandhi provided a profound moral critique of modern Western civilization and Machiavellian statecraft in works such as "Hind Swaraj" (1909). Rather than viewing politics as an amoral quest for sovereign power, Gandhi sought to spiritualize politics by anchoring governance in Satya (Truth) and Ahimsa (Non-Violence).',
      sections: [
        {
          heading: '1. The Multidimensional Concept of Swaraj',
          points: [
            'Individual Swaraj (Self-Mastery): Genuine freedom begins with the individual conquering personal passions, greed, and fear through ethical discipline.',
            'Socio-Economic Swaraj (Sarvodaya): Welfare of all, rejection of exploitative industrialization, and revitalizing self-reliant decentralized village republics (Gram Swaraj).',
            'Political Swaraj: Complete moral self-determination, not merely replacing British rulers with domestic elites while retaining colonial coercive state apparatus.',
          ],
        },
        {
          heading: '2. Satyagraha: Soul Force Against Injustice',
          points: [
            'Rooted in Satya (Truth) and Agraha (Firm Adherence), Satyagraha is non-violent resistance aimed at converting the wrongdoer through self-suffering (Tapasya) rather than defeating or humiliating the opponent.',
            'Distinct from Passive Resistance: Gandhi emphasized that Satyagraha is the weapon of the morally courageous, not the weak, requiring complete banishment of malice.',
          ],
        },
        {
          heading: '3. Critique of Modern State & Trusteeship',
          points: [
            'Gandhi viewed the centralized modern state as an "organized and concentrated engine of violence" that crushes individual initiative.',
            'He advocated Trusteeship: wealthy capitalists should hold property in trust for the welfare of the collective community rather than private aggrandizement.',
          ],
        },
      ],
      criticalEvaluation:
        'Critics like B.R. Ambedkar pointed out that idealizing village republics ignored entrenched caste oppression, while Marxist theorists viewed Trusteeship as an unworkable utopian compromise. Nonetheless, Satyagraha inspired historic civil rights movements across the globe, including Martin Luther King Jr. and Nelson Mandela.',
      conclusion:
        'In conclusion, Gandhi’s synthesis of politics and morality demonstrated that noble ends cannot be achieved through ignoble means, presenting a timeless paradigm of participatory, non-violent political action.',
    },
    noteSlug: 'gandhi-hind-swaraj',
  },
  {
    id: 'long-ir-01',
    type: 'long',
    marks: 15,
    expectedWordCount: '450–600 words',
    subject: 'international-relations',
    subjectName: 'International Relations',
    unit: 1,
    topic: 'Realist vs Liberal Approaches to International Relations',
    difficulty: 'advanced',
    question: 'Critically compare the Realist and Liberal approaches to International Relations. How do they explain the causes of interstate conflict and the prospects for international peace? (15 Marks)',
    modelAnswer: {
      introduction:
        'The debate between Realism and Liberalism constitutes the central paradigm dispute in International Relations theory. While Realism views international politics as an unalterable tragic struggle for power under systemic anarchy, Liberalism contends that democratic institutions, economic interdependence, and international law can cultivate enduring peace.',
      sections: [
        {
          heading: '1. Foundational Assumptions of Realism',
          points: [
            'Key Thinkers: Thucydides, Machiavelli, Thomas Hobbes, Hans Morgenthau, Kenneth Waltz, John Mearsheimer.',
            'Anarchy & State-Centrism: Sovereign states are the primary unitary, rational actors in a decentralized international system with no overarching global authority.',
            'Security Dilemma: Measures taken by one state to increase its defensive security inadvertently threaten neighbors, sparking spiral arms races (John Herz).',
            'Relative Gains: States focus on relative material power gains over rivals, making deep multilateral cooperation exceedingly difficult.',
          ],
        },
        {
          heading: '2. Foundational Assumptions of Liberalism',
          points: [
            'Key Thinkers: Immanuel Kant, Woodrow Wilson, Robert Keohane, Joseph Nye, Michael Doyle.',
            'Pluralist Actors: Transnational corporations, NGOs, and international institutions (UN, WTO) profoundly shape global outcomes alongside nation-states.',
            'Absolute Gains & Interdependence: States prioritize mutual economic gains; commercial interdependence raises the opportunity cost of war.',
            'Democratic Peace Theory: Established democracies rarely, if ever, go to war with one another (Kant’s Perpetual Peace).',
          ],
        },
        {
          heading: '3. Comparative Assessment on Conflict and Peace',
          points: [
            'On War: Realists see war as an ever-present possibility driven by structural security competition; Liberals see conflict arising from authoritarian regimes and institutional failure.',
            'On International Institutions: Realists view institutions as epiphenomenal arenas reflecting prevailing great power balances; Liberals prove institutions reduce transaction costs and foster compliance.',
          ],
        },
      ],
      criticalEvaluation:
        'Constructivists (Alexander Wendt) bridge this divide by asserting that "anarchy is what states make of it"—identities, norms, and social interactions determine whether anarchy is Hobbesian (hostile), Lockean (rivalry), or Kantian (friendship).',
      conclusion:
        'In conclusion, neither Realism nor Liberalism alone fully explains modern global dynamics. Realism remains essential during geopolitical flashpoints, while Liberalism accurately explains regional integration and global governance across trade, climate, and international law.',
    },
    noteSlug: 'realism-international-relations',
  },

  /* ─────────────────────────────────────────────────────────────────────────
     PREVIOUS YEAR QUESTIONS (PYQs - Authentically Verified)
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: 'pyq-net-2023-01',
    type: 'mcq',
    subject: 'ugc-net-political-science-paper-2',
    subjectName: 'UGC NET Political Science Paper 2',
    unit: 1,
    topic: 'Western Political Thought',
    difficulty: 'advanced',
    isPYQ: true,
    examDetails: {
      examName: 'UGC NET',
      year: 2023,
      session: 'June Session',
      paper: 'Paper 2 (Political Science)',
    },
    question: '[UGC NET June 2023] Which of the following works is NOT authored by Niccolò Machiavelli?',
    options: [
      'The Prince',
      'Discourses on Livy',
      'The Art of War',
      'Discourse on the Origin of Inequality',
    ],
    correctAnswer: 3,
    explanation:
      '"Discourse on the Origin of Inequality" (1755) was authored by Jean-Jacques Rousseau, not Niccolò Machiavelli. The Prince, Discourses on Livy, and The Art of War are seminal political treatises authored by Machiavelli.',
    noteSlug: 'machiavelli-prince',
  },
  {
    id: 'pyq-net-2022-01',
    type: 'mcq',
    subject: 'ugc-net-political-science-paper-2',
    subjectName: 'UGC NET Political Science Paper 2',
    unit: 2,
    topic: 'Indian Political Thought',
    difficulty: 'intermediate',
    isPYQ: true,
    examDetails: {
      examName: 'UGC NET',
      year: 2022,
      session: 'December Cycle',
      paper: 'Paper 2 (Political Science)',
    },
    question: '[UGC NET Dec 2022] Who among the following described the caste system as a "division of labourers" rather than merely a "division of labour"?',
    options: [
      'Mahatma Gandhi',
      'Dr. B. R. Ambedkar',
      'Jotirao Phule',
      'Ram Manohar Lohia',
    ],
    correctAnswer: 1,
    explanation:
      'In "Annihilation of Caste" (1936), Dr. B.R. Ambedkar wrote: "Caste system is not merely division of labour. It is also a division of labourers... It is a hierarchy in which the divisions of labourers are graded one above another."',
    noteSlug: 'ambedkar-annihilation-of-caste',
  },
  {
    id: 'pyq-net-2020-01',
    type: 'mcq',
    subject: 'ugc-net-political-science-paper-2',
    subjectName: 'UGC NET Political Science Paper 2',
    unit: 3,
    topic: 'Political Theory: Concepts',
    difficulty: 'advanced',
    isPYQ: true,
    examDetails: {
      examName: 'UGC NET',
      year: 2020,
      session: 'November Cycle',
      paper: 'Paper 2 (Political Science)',
    },
    question: '[UGC NET Nov 2020] Who coined the phrase "Anarchy is what states make of it", initiating the Social Constructivist turn in International Relations?',
    options: [
      'Alexander Wendt',
      'John Mearsheimer',
      'Robert Keohane',
      'Hedley Bull',
    ],
    correctAnswer: 0,
    explanation:
      'Alexander Wendt published the landmark 1992 article "Anarchy is what States Make of it: The Social Construction of Power Politics" in International Organization, arguing that systemic anarchy does not inherently mandate self-help; social interaction and shared ideas shape state identity and interests.',
    noteSlug: 'constructivism-international-relations',
  },
  {
    id: 'pyq-net1-2021-01',
    type: 'mcq',
    subject: 'ugc-net-paper-1',
    subjectName: 'UGC NET Paper 1',
    unit: 1,
    topic: 'Teaching & Research Aptitude',
    difficulty: 'intermediate',
    isPYQ: true,
    examDetails: {
      examName: 'UGC NET',
      year: 2021,
      session: 'December Cycle',
      paper: 'Paper 1 (General)',
    },
    question: '[UGC NET 2021 Paper 1] In which type of qualitative research is the primary goal to understand the lived experiences of individuals regarding a specific phenomenon?',
    options: [
      'Grounded Theory',
      'Phenomenological Research',
      'Experimental Design',
      'Ex-post Facto Analysis',
    ],
    correctAnswer: 1,
    explanation:
      'Phenomenological research investigates the essence of human experiences concerning a phenomenon, exploring how participants perceive and ascribe meaning to their lived realities.',
    noteSlug: 'ugc-net-paper-1-research',
  },
  {
    id: 'pyq-du-2023-01',
    type: 'short',
    marks: 5,
    expectedWordCount: '80–120 words',
    subject: 'university-semester',
    subjectName: 'University Semester Exam Questions',
    unit: 2,
    topic: 'Western Political Philosophy',
    difficulty: 'intermediate',
    isPYQ: true,
    examDetails: {
      examName: 'Delhi University BA (Hons)',
      year: 2023,
      session: 'Semester V Exam',
      paper: 'Western Political Philosophy II',
    },
    question: '[Delhi University BA (Hons) 2023] Write a short note on Rousseau’s concept of the "General Will" (Volonté Générale). (5 Marks)',
    modelAnswer: {
      summary:
        'In "The Social Contract" (1762), Jean-Jacques Rousseau placed the General Will at the center of legitimate democratic sovereignty.',
      keyPoints: [
        'Distinction from Will of All: The General Will aims strictly at the common good (intérêt commun) of the entire political body. In contrast, the "Will of All" (volonté de tous) is merely the sum of individual private interests and selfish desires.',
        'Sovereignty and Moral Freedom: True freedom is not license to do whatever one pleases; it is obedience to a self-prescribed law adopted for the common welfare.',
        'Inalienable & Indivisible: Rousseau argued that sovereign legislative authority can never be alienated or represented by deputies.',
      ],
      examTip:
        'Contrast Rousseau’s direct democratic General Will with modern representative parliamentarianism.',
    },
    noteSlug: 'rousseau-social-contract',
  },
  {
    id: 'pyq-pu-2022-01',
    type: 'long',
    marks: 15,
    expectedWordCount: '450–600 words',
    subject: 'university-semester',
    subjectName: 'University Semester Exam Questions',
    unit: 1,
    topic: 'Comparative Politics & Institutions',
    difficulty: 'advanced',
    isPYQ: true,
    examDetails: {
      examName: 'State University MA Political Science',
      year: 2022,
      session: 'Semester II Annual Exam',
      paper: 'Comparative Political Analysis',
    },
    question: '[University MA Exam 2022] Critically evaluate Gabriel Almond and Sidney Verba’s concept of "Civic Culture". To what extent is a civic culture essential for stable democratic governance? (15 Marks)',
    modelAnswer: {
      introduction:
        'In their seminal empirical study "The Civic Culture" (1963), Gabriel Almond and Sidney Verba examined political culture across five nations (USA, UK, West Germany, Italy, Mexico) to determine what political culture best sustains a stable liberal democracy.',
      sections: [
        {
          heading: '1. Three Ideal Types of Political Culture',
          points: [
            'Parochial Culture: Citizens have little or no awareness of or expectations from the central political system; typical of traditional tribal societies.',
            'Subject Culture: Citizens are aware of government outputs (laws, taxes, police) but view themselves as passive subjects with no active participation in inputs or policymaking.',
            'Participant Culture: Citizens are highly oriented toward both inputs and outputs, actively mobilizing in political parties and civic associations.',
          ],
        },
        {
          heading: '2. The Mixed "Civic Culture" Model',
          points: [
            'Almond and Verba argued that pure participant culture creates excessive demands that destabilize governance.',
            'The ideal Civic Culture is a balanced mixture: a participant culture tempered by underlying subject and parochial orientations, ensuring government decisiveness alongside citizen vigilance.',
          ],
        },
        {
          heading: '3. Scholarly Criticisms',
          points: [
            'Ethnocentric Bias: Critics argue the study assumed Anglo-American political norms represented the universal pinnacle of political development.',
            'Causal Ambiguity: It remains disputed whether civic culture creates democracy or whether enduring democratic institutions produce civic culture over time.',
          ],
        },
      ],
      criticalEvaluation:
        'Despite methodological critiques, Almond and Verba laid the foundation of modern political culture research, demonstrating that democratic longevity depends heavily on shared civic values and institutional trust.',
      conclusion:
        'In conclusion, Civic Culture highlighted the social-psychological foundations of democracy, proving that paper constitutions cannot survive without supportive civic norms and participatory restraint.',
    },
    noteSlug: 'comparative-politics-civic-culture',
  },
];

/* ═════════════════════════════════════════════════════════════════════════
   TOPIC-WISE MOCK TESTS DATA
   ═════════════════════════════════════════════════════════════════════════ */

export interface MockTestMeta {
  id: string;
  title: string;
  subject: SubjectCategory;
  subjectName: string;
  durationMinutes: number;
  questionIds: string[];
  description: string;
  badge: string;
}

export const TOPIC_MOCK_TESTS: MockTestMeta[] = [
  {
    id: 'mock-wpt-classic',
    title: 'Western Political Thought: Classical to Modern',
    subject: 'western-political-thought',
    subjectName: 'Western Political Thought',
    durationMinutes: 15,
    questionIds: [
      'mcq-wpt-01',
      'mcq-wpt-02',
      'mcq-wpt-03',
      'mcq-wpt-04',
      'mcq-wpt-05',
      'pyq-net-2023-01',
    ],
    description: 'Test your understanding of Plato, Aristotle, Hobbes, Locke, Mill, and Machiavelli with immediate scoring and model explanations.',
    badge: 'Core Syllabus Drill',
  },
  {
    id: 'mock-ipt-thinkers',
    title: 'Indian Political Thought: Ancient to Modern',
    subject: 'indian-political-thought',
    subjectName: 'Indian Political Thought',
    durationMinutes: 15,
    questionIds: [
      'mcq-ipt-01',
      'mcq-ipt-02',
      'mcq-ipt-03',
      'pyq-net-2022-01',
    ],
    description: 'Practice questions on Kautilya’s statecraft, Mahatma Gandhi’s Swaraj, and Dr. B.R. Ambedkar’s constitutional democracy.',
    badge: 'UGC NET High-Yield',
  },
  {
    id: 'mock-pt-concepts',
    title: 'Political Theory: Liberty, Equality & Justice',
    subject: 'political-theory',
    subjectName: 'Political Theory',
    durationMinutes: 15,
    questionIds: [
      'mcq-pt-01',
      'mcq-pt-02',
      'pyq-net-2020-01',
    ],
    description: 'Drill down into John Rawls, Isaiah Berlin, and core debates on positive vs negative liberty and distributive justice.',
    badge: 'Conceptual Mastery',
  },
  {
    id: 'mock-ir-theories',
    title: 'International Relations: Theories & Security',
    subject: 'international-relations',
    subjectName: 'International Relations',
    durationMinutes: 15,
    questionIds: [
      'mcq-ir-01',
      'mcq-ir-02',
      'pyq-net-2020-01',
    ],
    description: 'Assess your grasp of Realism, Complex Interdependence, Constructivism, and Anarchy in international politics.',
    badge: 'IR Foundation',
  },
  {
    id: 'mock-ugc-net-paper1',
    title: 'UGC NET Paper 1 Practice Drill',
    subject: 'ugc-net-paper-1',
    subjectName: 'UGC NET Paper 1',
    durationMinutes: 10,
    questionIds: [
      'mcq-net1-01',
      'pyq-net1-2021-01',
    ],
    description: 'Targeted practice for teaching aptitude, experimental designs, and research methodology for Paper 1 preparation.',
    badge: 'Paper 1 Booster',
  },
];
