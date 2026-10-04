import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNotes } from '../../api/notes';
import { getThinkers } from '../../api/thinkers';
import { NoteCard } from '../../components/NoteCard/NoteCard';
import { ThinkerCard } from '../../components/ThinkerCard/ThinkerCard';

// ── Static subject catalogue shown even before API loads ──────────────────────
const STATIC_SUBJECTS = [
  { icon: 'gavel', label: 'Political Theory', slug: 'political-theory', color: 'from-blue-900 to-blue-700', desc: 'State, sovereignty, liberty, justice & ideology' },
  { icon: 'account_balance', label: 'Indian Political Thought', slug: 'indian-political-thought', color: 'from-orange-800 to-orange-600', desc: 'Gandhi, Ambedkar, Nehru & classical traditions' },
  { icon: 'public', label: 'Western Political Thought', slug: 'western-political-thought', color: 'from-indigo-900 to-indigo-700', desc: 'Plato to Marx — key thinkers & concepts' },
  { icon: 'flag', label: 'Indian Government & Politics', slug: 'indian-government-and-politics', color: 'from-green-900 to-green-700', desc: 'Constitution, federalism, elections & institutions' },
  { icon: 'compare', label: 'Comparative Politics', slug: 'comparative-politics', color: 'from-purple-900 to-purple-700', desc: 'Political systems, regimes & frameworks' },
  { icon: 'language', label: 'International Relations', slug: 'international-relations', color: 'from-teal-900 to-teal-700', desc: 'Realism, liberalism, diplomacy & global order' },
  { icon: 'corporate_fare', label: 'Public Administration', slug: 'public-administration', color: 'from-slate-800 to-slate-600', desc: 'Bureaucracy, governance & policy implementation' },
  { icon: 'library_books', label: 'Constitution & Institutions', slug: 'constitution-and-political-institutions', color: 'from-red-900 to-red-700', desc: 'Parliament, judiciary, federalism & amendments' },
  { icon: 'diversity_3', label: 'Human Rights', slug: 'human-rights', color: 'from-pink-900 to-pink-700', desc: 'UDHR, UN mechanisms & rights frameworks' },
  { icon: 'travel_explore', label: 'Global Politics', slug: 'global-politics', color: 'from-cyan-900 to-cyan-700', desc: 'Globalisation, security & world order post-1990' },
  { icon: 'school', label: 'UGC NET Political Science', slug: 'ugc-net-political-science', color: 'from-amber-800 to-amber-600', desc: 'Unit-wise syllabus coverage for UGC NET exam' },
  { icon: 'quiz', label: 'MCQs & Practice Tests', slug: 'mcqs-practice-tests', color: 'from-emerald-900 to-emerald-700', desc: 'Topic-wise MCQs with answers and explanations' },
];

const POPULAR_TOPICS = [
  { label: 'Rousseau: General Will', to: '/notes/rousseau-general-will', icon: 'psychology' },
  { label: 'J.S. Mill: Harm Principle', to: '/thinkers/john-stuart-mill', icon: 'person' },
  { label: 'Ambedkar & Caste', to: '/thinkers/b-r-ambedkar', icon: 'balance' },
  { label: 'Social Contract Theory', to: '/exam-prep/important-questions?topic=Social+Contract', icon: 'handshake' },
  { label: 'Rawls: Theory of Justice', to: '/exam-prep/important-questions?topic=Rawls', icon: 'gavel' },
  { label: 'Indian Federalism', to: '/exam-prep/important-questions?topic=Federalism', icon: 'flag' },
  { label: 'Realism vs Liberalism', to: '/exam-prep/important-questions?topic=Realism', icon: 'compare_arrows' },
  { label: 'Fundamental Rights', to: '/exam-prep/important-questions?topic=Fundamental+Rights', icon: 'library_books' },
];

const STATS = [
  { value: '12+', label: 'Core Subjects', icon: 'menu_book' },
  { value: '50+', label: 'Study Notes', icon: 'description' },
  { value: '30+', label: 'Political Thinkers', icon: 'people' },
  { value: '500+', label: 'Practice Questions', icon: 'quiz' },
];

// ── Political Thinkers ────────────────────────────────────────────────────────
const STATIC_THINKERS = [
  { name: 'Plato', slug: 'plato', desc: 'Founder of political philosophy; theory of justice & the ideal state.', era: 'Ancient Greece', icon: '🏛️' },
  { name: 'Aristotle', slug: 'aristotle', desc: 'Defined politics as the master science; classified constitutions & citizenship.', era: 'Ancient Greece', icon: '⚖️' },
  { name: 'Machiavelli', slug: 'niccolo-machiavelli', desc: 'Pioneered realist statecraft; separated politics from morality in The Prince.', era: 'Renaissance', icon: '🦁' },
  { name: 'Hobbes', slug: 'thomas-hobbes', desc: 'Social contract theorist; envisioned Leviathan & the state of nature.', era: '17th Century', icon: '⚔️' },
  { name: 'Locke', slug: 'john-locke', desc: 'Father of liberalism; natural rights, consent of the governed & limited government.', era: '17th Century', icon: '🔑' },
  { name: 'Rousseau', slug: 'jean-jacques-rousseau', desc: 'General Will theorist; champion of popular sovereignty & direct democracy.', era: '18th Century', icon: '🌿' },
  { name: 'J.S. Mill', slug: 'john-stuart-mill', desc: 'Utilitarian liberal; harm principle, liberty, and representative government.', era: '19th Century', icon: '📖' },
  { name: 'Marx', slug: 'karl-marx', desc: 'Historical materialism; class struggle, capitalism critique & communist theory.', era: '19th Century', icon: '✊' },
  { name: 'Gandhi', slug: 'mahatma-gandhi', desc: 'Non-violence, Satyagraha, Swaraj & critique of modern industrial civilisation.', era: '20th Century', icon: '🕊️' },
  { name: 'Ambedkar', slug: 'b-r-ambedkar', desc: 'Dalit liberation, constitutional democracy & annihilation of caste.', era: '20th Century', icon: '🏅' },
  { name: 'Rawls', slug: 'john-rawls', desc: 'Theory of justice as fairness; veil of ignorance & difference principle.', era: '20th Century', icon: '⚖️' },
];

// ── Study Notes Topics ────────────────────────────────────────────────────────
const STUDY_NOTES_TOPICS = [
  { topic: 'Political Theory', slug: 'political-theory', desc: 'State, sovereignty, power, authority & ideological frameworks.', icon: 'gavel', color: 'from-blue-800 to-blue-600' },
  { topic: 'Justice', slug: 'political-theory', desc: 'Distributive, social & corrective justice across key traditions.', icon: 'balance', color: 'from-violet-800 to-violet-600' },
  { topic: 'Liberty', slug: 'political-theory', desc: 'Positive & negative liberty — Berlin, Mill, Rawls & beyond.', icon: 'lock_open', color: 'from-teal-800 to-teal-600' },
  { topic: 'Equality', slug: 'political-theory', desc: 'Formal, substantive, and egalitarian theories of equality.', icon: 'people', color: 'from-green-800 to-green-600' },
  { topic: 'Rights', slug: 'human-rights', desc: 'Natural rights, human rights, fundamental rights & their sources.', icon: 'diversity_3', color: 'from-pink-800 to-pink-600' },
  { topic: 'Power', slug: 'political-theory', desc: 'Theories of power — Dahl, Lukes, Gramsci & Foucault.', icon: 'bolt', color: 'from-amber-800 to-amber-600' },
  { topic: 'Democracy', slug: 'political-theory', desc: 'Liberal, participatory, deliberative & radical democracy.', icon: 'how_to_vote', color: 'from-indigo-800 to-indigo-600' },
  { topic: 'Citizenship', slug: 'political-theory', desc: 'Civil, political & social citizenship — Marshall, Kymlicka.', icon: 'badge', color: 'from-orange-800 to-orange-600' },
  { topic: 'Indian Political Thought', slug: 'indian-political-thought', desc: 'Classical traditions — Kautilya, Manu — to modern thinkers.', icon: 'account_balance', color: 'from-red-800 to-red-600' },
  { topic: 'International Relations', slug: 'international-relations', desc: 'Realism, liberalism, constructivism & global governance.', icon: 'public', color: 'from-cyan-800 to-cyan-600' },
];

// ── UGC NET Units ─────────────────────────────────────────────────────────────
const UGC_NET_FEATURES = [
  {
    icon: 'layers',
    title: 'Unit-wise Notes',
    desc: 'All 10 units of UGC NET Political Science covered with detailed, exam-focused notes.',
    link: '/subjects/ugc-net-political-science',
    linkLabel: 'Open Notes',
    color: 'from-blue-800 to-blue-600',
  },
  {
    icon: 'history_edu',
    title: 'Previous Year Questions',
    desc: 'Topic-wise PYQs from NET/JRF exams with trend analysis and model answers.',
    link: '/exam-prep/pyqs',
    linkLabel: 'Solve PYQs',
    color: 'from-indigo-800 to-indigo-600',
  },
  {
    icon: 'quiz',
    title: 'MCQ Practice',
    desc: '500+ topic-wise MCQs with explanations — filter by subject, unit & difficulty.',
    link: '/exam-prep/important-questions',
    linkLabel: 'Practice MCQs',
    color: 'from-violet-800 to-violet-600',
  },
  {
    icon: 'flash_on',
    title: 'Quick Revision',
    desc: 'Concise summaries, mind-maps, and key-point flashcards for last-minute prep.',
    link: '/subjects/ugc-net-political-science',
    linkLabel: 'Revise Now',
    color: 'from-amber-700 to-amber-500',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: notes = [], isLoading: isNotesLoading } = useQuery({
    queryKey: ['notes-home'],
    queryFn: () => getNotes(),
  });

  const { data: thinkers = [], isLoading: isThinkersLoading } = useQuery({
    queryKey: ['thinkers-home'],
    queryFn: getThinkers,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/subjects?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="pb-xl">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-[#1a3a8f] py-[96px] px-margin-mobile md:px-margin-desktop">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-white/5 pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-white/90 font-label-md text-caption mb-8 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px]">school</span>
            India's Premier Political Science Learning Platform
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-[42px] md:text-[58px] font-bold text-white leading-[1.05] tracking-tight font-headline-md">
                  POLISPHERE
                </h1>
                <p className="text-[24px] md:text-[32px] font-semibold text-white/80 leading-snug mt-2 font-headline-md">
                  Learn Political Science.{' '}
                  <span className="text-amber-300">Think Beyond the Textbook.</span>
                </p>
              </div>

              <p className="text-white/70 text-[17px] leading-relaxed max-w-lg font-body-md">
                Structured notes on political thinkers, subject-wise study material,
                UGC NET preparation, and a powerful MCQ question bank — built for
                serious political science students.
              </p>

              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="max-w-lg">
                <div className="flex items-center bg-white rounded-xl p-1.5 shadow-2xl">
                  <span className="material-symbols-outlined text-outline ml-3 mr-2 shrink-0">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search — Rousseau, General Will, Federalism…"
                    className="flex-1 bg-transparent border-none text-on-surface font-body-md text-[15px] focus:outline-none placeholder:text-outline min-w-0"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-secondary text-white px-5 py-2.5 rounded-lg font-label-md text-label-md font-semibold hover:bg-primary-container transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/subjects"
                  id="hero-explore-subjects"
                  className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-xl font-semibold font-label-md text-[15px] hover:bg-amber-50 transition-all duration-200 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  Explore Subjects
                </Link>
                <Link
                  to="/exam-prep/important-questions"
                  id="hero-practice-mcqs"
                  className="inline-flex items-center gap-2 bg-amber-400 text-primary px-7 py-3.5 rounded-xl font-semibold font-label-md text-[15px] hover:bg-amber-300 transition-all duration-200 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">quiz</span>
                  Practice MCQs
                </Link>
              </div>
            </div>

            {/* Stats grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/15 transition-colors">
                  <span className="material-symbols-outlined text-amber-300 text-[32px] mb-3 block">{s.icon}</span>
                  <div className="text-[36px] font-bold text-white font-headline-md leading-none">{s.value}</div>
                  <div className="text-white/70 font-body-md text-[14px] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATIC SUBJECT CARDS GRID ─────────────────────────────────────── */}
      <section className="py-[80px] px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2">Academic Curriculum</p>
              <h2 className="font-headline-md text-[36px] md:text-[40px] text-on-surface leading-tight">
                Political Science Subjects
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-3">
                Comprehensive coverage across all major political science disciplines —
                from classical theory to contemporary global politics.
              </p>
            </div>
            <Link
              to="/subjects"
              className="shrink-0 inline-flex items-center gap-2 border border-secondary text-secondary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              View All Subjects
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {STATIC_SUBJECTS.map((subj) => (
              <Link
                key={subj.slug}
                to={`/subjects/${subj.slug}`}
                id={`subject-card-${subj.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Coloured accent bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${subj.color}`} />
                <div className="p-6 flex flex-col flex-1">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-white text-[22px]">{subj.icon}</span>
                  </div>
                  <h3 className="font-semibold text-[16px] text-on-surface mb-2 leading-snug group-hover:text-secondary transition-colors">
                    {subj.label}
                  </h3>
                  <p className="text-on-surface-variant font-body-md text-[13px] leading-relaxed flex-1">
                    {subj.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-secondary font-label-md text-[13px] font-semibold">
                    Explore
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-200">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR TOPICS ───────────────────────────────────────────────── */}
      <section className="py-[64px] px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2">Quick Access</p>
            <h2 className="font-headline-md text-[32px] text-on-surface">Popular Topics</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {POPULAR_TOPICS.map((topic) => (
              <Link
                key={topic.label}
                to={topic.to}
                className="group flex flex-col items-center text-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:border-secondary hover:shadow-lg transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-200">
                  <span className="material-symbols-outlined text-[22px]">{topic.icon}</span>
                </div>
                <span className="text-[13px] font-semibold text-on-surface group-hover:text-secondary transition-colors leading-snug">
                  {topic.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POLITICAL THINKERS ───────────────────────────────────────────── */}
      <section className="py-[80px] px-margin-mobile md:px-margin-desktop bg-surface" id="political-thinkers">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2">Political Philosophy</p>
              <h2 className="font-headline-md text-[36px] md:text-[40px] text-on-surface leading-tight">
                Political Thinkers
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-3">
                Explore the ideas of thinkers who shaped political thought — from ancient Greece to modern India.
              </p>
            </div>
            <Link
              to="/thinkers"
              className="shrink-0 inline-flex items-center gap-2 border border-secondary text-secondary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              View All Thinkers
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {STATIC_THINKERS.map((thinker) => (
              <div
                key={thinker.slug}
                className="group relative bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col card-hover"
              >
                {/* Top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />
                <div className="p-6 flex flex-col flex-1">
                  {/* Era badge + emoji */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[28px] leading-none">{thinker.icon}</span>
                    <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {thinker.era}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[18px] text-on-surface mb-2 group-hover:text-secondary transition-colors">
                    {thinker.name}
                  </h3>
                  <p className="text-on-surface-variant font-body-md text-[13px] leading-relaxed flex-1">
                    {thinker.desc}
                  </p>
                  <Link
                    to={`/thinkers/${thinker.slug}`}
                    id={`thinker-card-${thinker.slug}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-label-md text-[13px] font-semibold hover:bg-secondary transition-colors duration-200 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    Explore
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDY NOTES ──────────────────────────────────────────────────── */}
      <section className="py-[80px] px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y border-outline-variant" id="study-notes">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2">Academic Resources</p>
              <h2 className="font-headline-md text-[36px] md:text-[40px] text-on-surface leading-tight">
                Study Notes
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-3">
                Topic-wise, structured notes covering all major concepts in political science — ready for exam and classroom use.
              </p>
            </div>
            <Link
              to="/subjects"
              className="shrink-0 inline-flex items-center gap-2 border border-secondary text-secondary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              Browse All Topics
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {STUDY_NOTES_TOPICS.map((item) => (
              <div
                key={item.topic}
                className="group relative bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col card-hover"
              >
                {/* Gradient accent top bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${item.color}`} />
                <div className="p-5 flex flex-col flex-1">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-white text-[20px]">{item.icon}</span>
                  </div>
                  <h3 className="font-semibold text-[15px] text-on-surface mb-1.5 group-hover:text-secondary transition-colors leading-snug">
                    {item.topic}
                  </h3>
                  <p className="text-on-surface-variant font-body-md text-[12px] leading-relaxed flex-1">
                    {item.desc}
                  </p>
                  <Link
                    to={`/subjects/${item.slug}`}
                    id={`study-notes-${item.slug}-${item.topic.toLowerCase().replace(/\s+/g, '-')}`}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 bg-surface-container border border-secondary/30 text-secondary px-3 py-2 rounded-lg font-label-md text-[12px] font-semibold hover:bg-secondary hover:text-white transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-[14px]">menu_book</span>
                    Read Notes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UGC NET POLITICAL SCIENCE (PROMINENT) ─────────────────────────── */}
      <section className="py-[80px] px-margin-mobile md:px-margin-desktop bg-surface" id="ugc-net">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-amber-400 text-primary px-4 py-1.5 rounded-full font-label-md font-bold text-[12px] uppercase tracking-wider mb-5">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Exam Preparation
            </span>
            <h2 className="font-headline-md text-[36px] md:text-[48px] font-bold text-on-surface leading-tight mb-4">
              UGC NET{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Political Science
              </span>
            </h2>
            <p className="text-on-surface-variant font-body-md text-[16px] max-w-2xl mx-auto leading-relaxed">
              A complete, structured preparation hub — unit-wise notes, PYQs, MCQ drills, and quick revision tools, all in one place.
            </p>
          </div>

          {/* 4-feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {UGC_NET_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="group relative bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:border-secondary hover:shadow-2xl transition-all duration-300 flex flex-col card-hover"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${feat.color}`} />
                <div className="p-6 flex flex-col flex-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-white text-[24px]">{feat.icon}</span>
                  </div>
                  <h3 className="font-semibold text-[17px] text-on-surface mb-2 group-hover:text-secondary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-on-surface-variant font-body-md text-[13px] leading-relaxed flex-1">
                    {feat.desc}
                  </p>
                  <Link
                    to={feat.link}
                    id={`ugc-net-${feat.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 border border-secondary text-secondary px-4 py-2.5 rounded-xl font-label-md text-[13px] font-semibold hover:bg-secondary hover:text-white transition-colors duration-200"
                  >
                    {feat.linkLabel}
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Start Preparation CTA */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f2167] via-[#173693] to-[#0051d5] p-10 md:p-14 shadow-2xl text-center">
            <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full bg-amber-400/10 pointer-events-none" />
            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: 'layers', label: 'All 10 Units', sub: 'Complete syllabus' },
                  { icon: 'quiz', label: '500+ MCQs', sub: 'Topic-wise practice' },
                  { icon: 'history_edu', label: 'PYQ Analysis', sub: 'Trend-based prep' },
                  { icon: 'flash_on', label: 'Quick Revision', sub: 'Flashcard-style notes' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-amber-300 text-[28px] mb-2 block">{stat.icon}</span>
                    <div className="text-white font-semibold text-[15px]">{stat.label}</div>
                    <div className="text-white/60 text-[12px] mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>
              <h3 className="text-[28px] md:text-[36px] font-bold text-white mb-4 font-headline-md">
                Ready to Crack UGC NET?
              </h3>
              <p className="text-white/70 font-body-md text-[15px] max-w-xl mx-auto mb-8">
                Start your structured preparation today. From unit notes to MCQs to previous year papers — everything is organised for maximum efficiency.
              </p>
              <Link
                to="/subjects/ugc-net-political-science"
                id="ugc-net-start-preparation"
                className="inline-flex items-center gap-3 bg-amber-400 text-primary px-10 py-4 rounded-2xl font-semibold font-label-md text-[16px] hover:bg-amber-300 transition-all duration-200 shadow-lg hover:shadow-amber-400/30 hover:scale-105"
              >
                <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
                Start Preparation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── UGC NET PREPARATION BANNER ────────────────────────────────────── */}
      <section className="py-[72px] px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-[1280px] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f2167] via-[#173693] to-[#0051d5] p-10 md:p-14 shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 bg-amber-400 text-primary px-4 py-1.5 rounded-full font-label-md text-label-md font-bold text-[12px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  UGC NET Preparation
                </span>
                <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight font-headline-md">
                  Crack UGC NET<br />Political Science
                </h2>
                <p className="text-white/70 font-body-md text-[16px] leading-relaxed">
                  Unit-wise syllabus coverage, important questions, previous year question
                  analysis, and topic-wise MCQ drills — everything you need for NET/JRF success.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/subjects/ugc-net-political-science"
                    id="ugc-net-study-notes"
                    className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold font-label-md text-[14px] hover:bg-amber-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    Study Notes
                  </Link>
                  <Link
                    to="/exam-prep/important-questions"
                    id="ugc-net-question-bank"
                    className="inline-flex items-center gap-2 bg-amber-400 text-primary px-6 py-3 rounded-xl font-semibold font-label-md text-[14px] hover:bg-amber-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">quiz</span>
                    Question Bank
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: 'layers', label: 'All 10 Units', sub: 'Complete syllabus' },
                  { icon: 'quiz', label: '500+ MCQs', sub: 'Topic-wise practice' },
                  { icon: 'history_edu', label: 'PYQ Analysis', sub: 'Trend-based prep' },
                  { icon: 'trending_up', label: 'Success Rate', sub: 'Exam-focused approach' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-amber-300 text-[28px] mb-2 block">{item.icon}</span>
                    <div className="text-white font-semibold text-[15px]">{item.label}</div>
                    <div className="text-white/60 text-[12px] mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED NOTES ───────────────────────────────────────────────── */}
      <section className="py-[72px] px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2">Academic Notes</p>
              <h2 className="font-headline-md text-[36px] text-on-surface">Featured Study Notes</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-3">
                In-depth theoretical analyses with structured outlines and comparison matrices.
              </p>
            </div>
            <Link
              to="/subjects"
              className="shrink-0 inline-flex items-center gap-2 border border-secondary text-secondary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              Browse All Notes
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          {isNotesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {notes.slice(0, 6).map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <p className="text-center text-on-surface-variant py-xl font-body-md">Notes loading from database…</p>
          )}
        </div>
      </section>

      {/* ── THINKERS ─────────────────────────────────────────────────────── */}
      <section className="py-[72px] px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2">Political Philosophy</p>
              <h2 className="font-headline-md text-[36px] text-on-surface">Influential Political Thinkers</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-3">
                Biographies, key concepts, and critical analysis of the thinkers who shaped political thought.
              </p>
            </div>
            <Link
              to="/thinkers"
              className="shrink-0 inline-flex items-center gap-2 border border-secondary text-secondary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              View All Thinkers
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          {isThinkersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : thinkers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
              {thinkers.slice(0, 6).map((thinker) => (
                <ThinkerCard key={thinker.id} thinker={thinker} />
              ))}
            </div>
          ) : (
            <p className="text-center text-on-surface-variant py-xl font-body-md">Thinkers loading from database…</p>
          )}
        </div>
      </section>

      {/* ── EXAM PREP / MCQs BANNER ──────────────────────────────────────── */}
      <section className="py-[72px] px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-on-surface rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-2 bg-amber-400 text-primary px-4 py-1.5 rounded-full font-label-md text-[12px] uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[14px]">quiz</span>
                MCQs &amp; Practice Tests
              </span>
              <h2 className="text-[32px] font-bold text-white leading-tight font-headline-md">
                Filterable Question Bank
              </h2>
              <p className="text-white/70 font-body-md text-[16px] leading-relaxed">
                Practice important questions filtered by subject, unit, topic, and difficulty.
                Linked directly to detailed study notes for instant revision.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                to="/exam-prep/important-questions"
                id="exam-prep-access-bank"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-semibold font-label-md text-[15px] hover:bg-[#003bb3] transition-colors shadow-lg whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">quiz</span>
                Access Question Bank
              </Link>
              <Link
                to="/exam-prep/pyqs"
                id="exam-prep-pyqs"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold font-label-md text-[15px] hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">history_edu</span>
                Previous Year Questions
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
