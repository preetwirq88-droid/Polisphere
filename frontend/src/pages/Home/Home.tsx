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
      navigate(`/exam-prep/important-questions?topic=${encodeURIComponent(searchQuery)}`);
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
              to="/subjects/modern-political-philosophy"
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
