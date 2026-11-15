import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getThinkerBySlug, getThinkers, DEFAULT_THINKERS } from '../../api/thinkers';
import { THINKER_PROFILES, type ThinkerProfileData } from '../../data/thinkerProfiles';
import { getNotes } from '../../api/notes';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { NoteCard } from '../../components/NoteCard/NoteCard';
import { ThinkerCard } from '../../components/ThinkerCard/ThinkerCard';

/* ── Table of Contents Sections ─────────────────────────────────────────── */
interface SectionNav {
  id: string;
  label: string;
  icon: string;
}

const SECTIONS: SectionNav[] = [
  { id: 'introduction', label: '1. Introduction', icon: 'menu_book' },
  { id: 'early-life', label: '2. Early Life & Background', icon: 'history_edu' },
  { id: 'political-ideas', label: '3. Political Ideas', icon: 'psychology' },
  { id: 'books-writings', label: '4. Important Books', icon: 'auto_stories' },
  { id: 'contributions', label: '5. Major Contributions', icon: 'military_tech' },
  { id: 'quotes', label: '6. Famous Quotes', icon: 'format_quote' },
  { id: 'criticism', label: '7. Criticism', icon: 'balance' },
  { id: 'legacy', label: '8. Legacy & Importance', icon: 'public' },
];

export const ThinkerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [imageError, setImageError] = useState(false);

  const normalizedSlug = slug === 'j-s-mill' ? 'john-stuart-mill' : (slug || '');

  // Reset image error when slug changes
  useEffect(() => {
    setImageError(false);
  }, [slug]);

  const { data: thinker, isLoading: isThinkerLoading } = useQuery({
    queryKey: ['thinker', slug],
    queryFn: () => getThinkerBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: allNotes = [] } = useQuery({
    queryKey: ['notes-all'],
    queryFn: () => getNotes(),
  });

  const { data: allThinkers = [] } = useQuery({
    queryKey: ['thinkers-list-page'],
    queryFn: getThinkers,
  });

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  /* ── Loading State ── */
  if (isThinkerLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="animate-pulse space-y-lg">
          <div className="h-6 w-44 bg-surface-container rounded" />
          <div className="bg-surface border border-outline-variant rounded-2xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-48 rounded-2xl bg-surface-container" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-64 bg-surface-container rounded" />
                <div className="h-4 w-48 bg-surface-container rounded" />
                <div className="h-16 w-full bg-surface-container rounded" />
              </div>
            </div>
          </div>
          <div className="h-12 w-full bg-surface-container rounded-xl" />
          <div className="h-64 w-full bg-surface-container rounded-2xl" />
        </div>
      </div>
    );
  }

  /* ── Not Found State ── */
  if (!thinker) {
    return (
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <span className="material-symbols-outlined text-[64px] text-outline mb-md block">person_off</span>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Thinker Profile Not Found</h2>
        <p className="font-body-md text-on-surface-variant mb-lg">
          We couldn't find a political thinker matching &ldquo;{slug}&rdquo;.
        </p>
        <Link
          to="/thinkers"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-label-md text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Thinkers Directory
        </Link>
      </div>
    );
  }

  /* ── Robust Profile Data Resolution ── */
  const staticProfile: ThinkerProfileData | undefined =
    thinker.profile || THINKER_PROFILES[normalizedSlug] || THINKER_PROFILES[thinker.slug];

  const profile: ThinkerProfileData = staticProfile || {
    slug: thinker.slug,
    name: thinker.name,
    lifespan: thinker.lifespan || 'Historical',
    era: thinker.era || 'Political Philosophy',
    region: thinker.region || 'Global',
    tradition: thinker.tradition || thinker.contribution,
    introduction: thinker.bio,
    early_life: {
      birth_and_origins: `${thinker.name} was an influential political thinker whose ideas shaped political theory and governance.`,
      education_and_influences: 'Studied classical texts, history, and contemporary institutions.',
      key_life_events: ['Pioneered foundational concepts in political philosophy.'],
    },
    political_ideas: [
      {
        title: thinker.contribution,
        summary: thinker.bio,
        key_points: ['Formulated seminal arguments in political thought.'],
      },
    ],
    important_books: (thinker.key_works || []).map((w) => ({
      title: w,
      year: 'Seminal Work',
      significance: `A core treatise by ${thinker.name} examining foundational political concepts.`,
    })),
    major_contributions: [thinker.contribution],
    quotes: [],
    criticisms: ['Critiqued and debated by scholars across generations.'],
    legacy_and_importance: ['Continues to form a cornerstone of university and UGC NET political science curricula.'],
  };

  const portraitSrc = thinker.portrait_url || `/images/thinkers/${thinker.slug}.jpg`;

  // Related notes: prefer explicit IDs, fall back to slug/name match
  const relatedNotes = thinker.related_note_ids?.length
    ? allNotes.filter((n) => thinker.related_note_ids.includes(n.id))
    : allNotes.filter(
        (n) =>
          n.slug.includes(slug?.replace(/-page$/, '') ?? '') ||
          n.keywords?.some((k) => thinker.name.toLowerCase().includes(k.toLowerCase()))
      );

  // Other thinkers recommendation
  const otherThinkers = (allThinkers.length > 0 ? allThinkers : DEFAULT_THINKERS)
    .filter((t) => t.slug !== slug && t.slug !== normalizedSlug)
    .slice(0, 3);

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-xl">
      {/* ══ TOP BAR & BREADCRUMB ═════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumb
          items={[
            { label: 'Home', url: '/' },
            { label: 'Political Thinkers', url: '/thinkers' },
            { label: thinker.name },
          ]}
        />
        <Link
          to="/thinkers"
          className="inline-flex items-center gap-2 text-secondary font-label-md text-sm hover:underline self-start sm:self-auto bg-surface border border-outline-variant/80 px-4 py-2 rounded-xl hover:border-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to All Thinkers
        </Link>
      </div>

      {/* ══ HERO BANNER ══════════════════════════════════════════════════ */}
      <header className="relative bg-surface border border-outline-variant rounded-3xl p-6 md:p-10 shadow-[0px_8px_32px_rgba(15,23,42,0.06)] overflow-hidden animate-fade-in">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-gradient-to-bl from-secondary/10 via-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Thinker Portrait */}
          <div className="relative shrink-0 w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-surface-container border-2 border-outline-variant/80 shadow-md">
            {/* Fallback silhouette if image fails */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/5 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[72px] text-secondary/40 select-none">
                account_circle
              </span>
              <span className="text-on-surface-variant font-label-md text-xs select-none">
                {thinker.name}
              </span>
            </div>

            {!imageError && portraitSrc && (
              <img
                src={portraitSrc}
                alt={`Portrait of ${thinker.name}`}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top relative z-10 transition-transform duration-500 hover:scale-105"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Thinker Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            {/* Tags row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full border border-secondary/20">
                <span className="material-symbols-outlined text-[15px]">school</span>
                {profile.tradition || thinker.tradition || thinker.contribution}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface text-xs font-semibold rounded-full border border-outline-variant/60">
                <span className="material-symbols-outlined text-[15px] text-secondary">history</span>
                {profile.era || thinker.era || 'Political Philosophy'}
              </span>
            </div>

            {/* Thinker Name */}
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
              {thinker.name}
            </h1>

            {/* Metadata Pills: Lifespan & Region */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-on-surface-variant">
              <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/50">
                <span className="material-symbols-outlined text-[17px] text-secondary">calendar_month</span>
                <span className="font-medium text-on-surface">{profile.lifespan || thinker.lifespan || 'Historical'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/50">
                <span className="material-symbols-outlined text-[17px] text-secondary">location_on</span>
                <span className="font-medium text-on-surface">{profile.region || thinker.region || 'Global'}</span>
              </div>
            </div>

            {/* Contribution Subtitle */}
            <p className="font-body-md text-base text-on-surface-variant leading-relaxed max-w-3xl pt-1">
              {thinker.contribution}
            </p>

            {/* Quick Links */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => scrollToSection('political-ideas')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-secondary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                Explore Political Ideas
              </button>
              <button
                onClick={() => scrollToSection('books-writings')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high transition-colors border border-outline-variant/70"
              >
                <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                Seminal Works ({profile.important_books.length})
              </button>
              <Link
                to="/exam-prep/important-questions"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high transition-colors border border-outline-variant/70"
              >
                <span className="material-symbols-outlined text-[16px]">quiz</span>
                Exam Questions
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══ TABLE OF CONTENTS / SECTION NAVIGATION ═══════════════════════ */}
      <nav
        aria-label="Profile Sections"
        className="sticky top-4 z-30 bg-surface/95 backdrop-blur-md border border-outline-variant rounded-2xl p-2 shadow-md overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-1.5 min-w-max">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{sec.icon}</span>
                {sec.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ══ SECTION 1: INTRODUCTION (First Readable Section) ══════════════ */}
      <section
        id="introduction"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-4 animate-fade-in"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">menu_book</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 1
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Introduction &amp; Overview
            </h2>
          </div>
        </div>

        <div className="bg-surface-container-low border-l-4 border-secondary p-5 md:p-6 rounded-r-xl">
          <p className="font-body-lg text-lg text-on-surface leading-[1.8] font-normal">
            {profile.introduction}
          </p>
        </div>
      </section>

      {/* ══ SECTION 2: EARLY LIFE AND BACKGROUND ═════════════════════════ */}
      <section
        id="early-life"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">history_edu</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 2
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Early Life &amp; Background
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Birth & Origins */}
          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">home_pin</span>
              Birth &amp; Social Origins
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {profile.early_life.birth_and_origins}
            </p>
          </div>

          {/* Education & Influences */}
          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">school</span>
              Education &amp; Intellectual Influences
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {profile.early_life.education_and_influences}
            </p>
          </div>
        </div>

        {/* Key Life Events Timeline */}
        {profile.early_life.key_life_events?.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">timeline</span>
              Key Biographical Milestones
            </h3>
            <div className="space-y-2.5">
              {profile.early_life.key_life_events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40"
                >
                  <span className="w-6 h-6 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-body-md text-sm text-on-surface leading-relaxed">
                    {event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══ SECTION 3: POLITICAL IDEAS AND PHILOSOPHY ════════════════════ */}
      <section
        id="political-ideas"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">psychology</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 3
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Political Ideas &amp; Philosophy
            </h2>
          </div>
        </div>

        <p className="font-body-md text-sm text-on-surface-variant">
          Core concepts, arguments, and philosophical theories explained in accessible English for university and UGC NET students:
        </p>

        <div className="space-y-5">
          {profile.political_ideas.map((idea, idx) => (
            <article
              key={idx}
              className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-5 md:p-6 hover:border-secondary/40 transition-colors space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-on-surface">
                    {idea.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mt-1">
                    {idea.summary}
                  </p>
                </div>
              </div>

              {idea.key_points?.length > 0 && (
                <div className="pl-11 pt-1 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
                    Key Concepts &amp; Tenets:
                  </span>
                  <ul className="space-y-1.5">
                    {idea.key_points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-sm text-on-surface leading-relaxed">
                        <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ══ SECTION 4: IMPORTANT BOOKS AND WRITINGS ══════════════════════ */}
      <section
        id="books-writings"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">auto_stories</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 4
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Important Books &amp; Writings
            </h2>
          </div>
        </div>

        <p className="font-body-md text-sm text-on-surface-variant">
          Seminal treatises, dialogues, and publications with reliable dates and academic significance:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.important_books.map((book, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 hover:border-secondary/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-base text-on-surface italic">
                    {book.title}
                  </h3>
                  <span className="shrink-0 text-xs font-bold px-2.5 py-0.5 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                    {book.year}
                  </span>
                </div>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {book.significance}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 5: MAJOR CONTRIBUTIONS ════════════════════════════════ */}
      <section
        id="contributions"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">military_tech</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 5
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Major Contributions to Political Thought
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.major_contributions.map((contrib, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-4"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <p className="font-body-md text-sm text-on-surface leading-relaxed">
                {contrib}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 6: FAMOUS QUOTES ═════════════════════════════════════ */}
      <section
        id="quotes"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">format_quote</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 6
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Famous Quotes &amp; Attributions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {profile.quotes.map((item, idx) => (
            <blockquote
              key={idx}
              className="bg-surface-container-low border-l-4 border-primary rounded-r-2xl p-5 flex flex-col justify-between"
            >
              <p className="font-body-lg text-base text-on-surface italic leading-relaxed mb-3">
                &ldquo;{item.quote}&rdquo;
              </p>
              <cite className="font-label-md text-xs font-bold text-secondary not-italic flex items-center gap-1.5 self-end">
                <span className="material-symbols-outlined text-[14px]">book</span>
                {item.source}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ══ SECTION 7: CRITICISM ═════════════════════════════════════════ */}
      <section
        id="criticism"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">balance</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 7
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Scholarly Criticisms &amp; Counterarguments
            </h2>
          </div>
        </div>

        <p className="font-body-md text-sm text-on-surface-variant">
          Critical perspectives and scholarly debates essential for comprehensive analysis and exam preparation:
        </p>

        <div className="space-y-3">
          {profile.criticisms.map((crit, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-4"
            >
              <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0 mt-0.5">
                warning
              </span>
              <p className="font-body-md text-sm text-on-surface leading-relaxed">
                {crit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 8: LEGACY AND IMPORTANCE ═════════════════════════════ */}
      <section
        id="legacy"
        className="scroll-mt-24 bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">public</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block">
              Section 8
            </span>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
              Legacy &amp; Enduring Importance
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.legacy_and_importance.map((leg, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/50 rounded-xl p-4"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary shrink-0 mt-0.5">
                star
              </span>
              <p className="font-body-md text-sm text-on-surface leading-relaxed">
                {leg}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ BOTTOM CTA & RETURN LINK ═════════════════════════════════════ */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-on-surface">
            Continue Exploring Political Thought
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Browse other foundational political theorists or test your understanding with practice questions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/thinkers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-xl font-label-md text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to All Thinkers
          </Link>
          <Link
            to="/exam-prep/important-questions"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container border border-outline-variant text-on-surface rounded-xl font-label-md text-sm hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            Practice MCQs
          </Link>
        </div>
      </div>

      {/* ══ RELATED NOTES ════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-3 flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-headline-sm text-xl md:text-2xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-secondary">article</span>
            Analysis &amp; Notes on {thinker.name}
          </h2>
          {relatedNotes.length > 0 && (
            <Link
              to="/subjects"
              className="text-secondary font-label-md text-sm hover:underline flex items-center gap-1"
            >
              Browse all notes
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          )}
        </div>

        {relatedNotes.length === 0 ? (
          <div className="bg-surface border border-outline-variant rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-[40px] text-outline mb-2 block">article</span>
            <p className="font-body-md text-sm text-on-surface-variant mb-4">
              No notes directly tagged with {thinker.name} yet.
            </p>
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-label-md text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Explore All Subjects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {relatedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </section>

      {/* ══ EXPLORE MORE THINKERS ════════════════════════════════════════ */}
      {otherThinkers.length > 0 && (
        <section className="space-y-4">
          <div className="border-b border-outline-variant pb-3 flex items-center justify-between">
            <h2 className="font-headline-sm text-xl md:text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px] text-secondary">diversity_3</span>
              Explore More Thinkers
            </h2>
            <Link
              to="/thinkers"
              className="text-secondary font-label-md text-sm hover:underline flex items-center gap-1"
            >
              View all 13 thinkers
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
            {otherThinkers.map((t) => (
              <ThinkerCard key={t.id || t.slug} thinker={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
