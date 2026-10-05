import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getThinkerBySlug, getThinkers } from '../../api/thinkers';
import { getNotes } from '../../api/notes';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { NoteCard } from '../../components/NoteCard/NoteCard';
import { ThinkerCard } from '../../components/ThinkerCard/ThinkerCard';

/* ── Helpers ──────────────────────────────────────────────────────────── */

/** Pick a consistent accent colour from the thinker's contribution label */
const contributionColour = (contribution: string) => {
  const s = contribution.toLowerCase();
  if (s.includes('liberal')) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  if (s.includes('marx') || s.includes('socialist')) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  if (s.includes('conserv')) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  if (s.includes('contract') || s.includes('natural')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  if (s.includes('utilit')) return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
  if (s.includes('idealist') || s.includes('hegel')) return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
  return { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20' };
};

/** Break bio into logical "idea" chunks (split by sentence groups) */
const extractIdeas = (bio: string): string[] => {
  const sentences = bio.match(/[^.!?]+[.!?]+/g) ?? [];
  const ideas: string[] = [];
  let chunk = '';
  sentences.forEach((s, i) => {
    chunk += s.trim() + ' ';
    if ((i + 1) % 2 === 0 || i === sentences.length - 1) {
      const trimmed = chunk.trim();
      if (trimmed) ideas.push(trimmed);
      chunk = '';
    }
  });
  return ideas.slice(0, 4); // max 4 cards
};

/** Map short idea text to a relevant icon */
const ideaIcon = (idea: string) => {
  const t = idea.toLowerCase();
  if (t.includes('state') || t.includes('sovereign') || t.includes('government')) return 'account_balance';
  if (t.includes('liberty') || t.includes('freedom') || t.includes('rights')) return 'shield_person';
  if (t.includes('social contract') || t.includes('contract')) return 'handshake';
  if (t.includes('class') || t.includes('labour') || t.includes('proletariat') || t.includes('capital')) return 'factory';
  if (t.includes('will') || t.includes('general')) return 'groups';
  if (t.includes('nature') || t.includes('natural')) return 'eco';
  if (t.includes('justice') || t.includes('moral') || t.includes('ethics')) return 'balance';
  if (t.includes('power') || t.includes('authority')) return 'bolt';
  if (t.includes('religion') || t.includes('church')) return 'church';
  if (t.includes('revolution') || t.includes('change')) return 'autorenew';
  return 'psychology';
};

/* ── Component ────────────────────────────────────────────────────────── */
export const ThinkerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const heroRef = useRef<HTMLDivElement>(null);

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

  // Parallax-lite: subtle portrait movement on scroll
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleScroll = () => {
      const scroll = window.scrollY;
      const img = hero.querySelector<HTMLImageElement>('.portrait-img');
      if (img) img.style.transform = `scale(1.04) translateY(${scroll * 0.04}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thinker]);

  /* ── Loading ── */
  if (isThinkerLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="animate-pulse space-y-lg">
          <div className="h-6 w-40 bg-surface-container rounded" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-4 h-96 bg-surface-container rounded-2xl" />
            <div className="md:col-span-8 space-y-md pt-4">
              <div className="h-4 w-32 bg-surface-container rounded" />
              <div className="h-12 w-3/4 bg-surface-container rounded" />
              <div className="h-4 w-full bg-surface-container rounded" />
              <div className="h-4 w-5/6 bg-surface-container rounded" />
              <div className="h-4 w-4/6 bg-surface-container rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!thinker) {
    return (
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <span className="material-symbols-outlined text-[64px] text-outline mb-md block">person_off</span>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Thinker Profile Not Found</h2>
        <Link to="/thinkers" className="text-secondary font-label-md hover:underline flex items-center gap-1 justify-center">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Thinkers Directory
        </Link>
      </div>
    );
  }

  /* ── Derived data ── */
  const accent = contributionColour(thinker.contribution);
  const ideas = extractIdeas(thinker.bio);

  // Related notes: prefer explicit IDs, fall back to slug/keyword match
  const relatedNotes = thinker.related_note_ids?.length
    ? allNotes.filter((n) => thinker.related_note_ids.includes(n.id))
    : allNotes.filter(
        (n) =>
          n.slug.includes(slug?.replace(/-page$/, '') ?? '') ||
          n.keywords?.some((k) => thinker.name.toLowerCase().includes(k.toLowerCase()))
      );

  const otherThinkers = allThinkers.filter((t) => t.slug !== slug).slice(0, 3);

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-2xl">
      <Breadcrumb
        items={[
          { label: 'Home', url: '/' },
          { label: 'Thinkers', url: '/thinkers' },
          { label: thinker.name },
        ]}
      />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-[0px_8px_40px_rgba(15,23,42,0.10)] animate-fade-in"
      >
        {/* Background accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-secondary/5 pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Portrait */}
          <div className="md:col-span-4 relative h-72 md:h-auto min-h-[360px] overflow-hidden bg-surface-container">
            <img
              src={thinker.portrait_url}
              alt={thinker.name}
              className="portrait-img w-full h-full object-cover object-top transition-transform duration-700"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                const parent = el.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center bg-surface-container-high gap-4">
                    <span class="material-symbols-outlined text-[80px] text-outline">person</span>
                    <span class="text-on-surface-variant font-label-md text-sm">${thinker.name}</span>
                  </div>`;
                }
              }}
            />
            {/* Gradient overlay on portrait */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-surface/40" />

            {/* Mobile name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-md md:hidden">
              <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${accent.bg} ${accent.text} ${accent.border}`}>
                {thinker.contribution}
              </span>
              <h1 className="font-display-lg text-[28px] text-white mt-2 leading-tight drop-shadow-lg">
                {thinker.name}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8 p-lg md:p-xl flex flex-col justify-center gap-md">
            {/* Contribution badge – desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${accent.bg} ${accent.text} ${accent.border}`}>
                <span className="material-symbols-outlined text-[14px]">history_edu</span>
                {thinker.contribution}
              </span>
            </div>

            <h1 className="hidden md:block font-display-lg text-display-lg-mobile md:text-[52px] md:leading-[1.1] text-on-surface tracking-tight">
              {thinker.name}
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed line-clamp-3">
              {thinker.bio}
            </p>

            {/* Key Works */}
            {thinker.key_works?.length > 0 && (
              <div>
                <h4 className="font-label-md text-[11px] text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">menu_book</span>
                  Seminal Works
                </h4>
                <div className="flex flex-wrap gap-2">
                  {thinker.key_works.map((work, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-container hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-lg text-sm text-on-surface font-medium border border-outline-variant/60"
                    >
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA strip */}
            <div className="pt-sm border-t border-outline-variant flex items-center gap-3 flex-wrap">
              <Link
                to="/thinkers"
                className="inline-flex items-center gap-1.5 text-secondary font-label-md text-sm hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                All Thinkers
              </Link>
              <span className="text-outline-variant">·</span>
              <Link
                to="/exam-prep/important-questions"
                className="inline-flex items-center gap-1.5 text-primary font-label-md text-sm hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">quiz</span>
                Exam Questions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BIO EXPANDED (full paragraph) ═══════════════════════════════ */}
      <section className="bg-surface border border-outline-variant rounded-2xl p-lg md:p-xl shadow-sm animate-fade-in-up">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-secondary">person</span>
          Biography & Philosophical Significance
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-[1.85] whitespace-pre-line">
          {thinker.bio}
        </p>
      </section>

      {/* ══ KEY IDEAS CARDS ══════════════════════════════════════════════ */}
      {ideas.length > 0 && (
        <section className="space-y-md animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-secondary">lightbulb</span>
              Core Philosophical Ideas
            </h2>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-gutter stagger`}>
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="animate-fade-in-up bg-surface border border-outline-variant rounded-xl p-md shadow-sm hover:shadow-md hover:border-secondary/40 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-secondary">{ideaIcon(idea)}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pt-0.5">{idea}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ KEY WORKS DETAIL ═════════════════════════════════════════════ */}
      {thinker.key_works?.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-outline-variant/60 rounded-2xl p-lg md:p-xl">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-secondary">auto_stories</span>
              Primary Texts & Key Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter stagger">
              {thinker.key_works.map((work, idx) => (
                <div
                  key={idx}
                  className="animate-fade-in-up bg-surface rounded-xl border border-outline-variant p-md flex items-center gap-3 hover:shadow-md hover:border-secondary/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-primary">import_contacts</span>
                  </div>
                  <span className="font-body-md text-sm text-on-surface font-medium leading-snug">{work}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ RELATED NOTES ════════════════════════════════════════════════ */}
      <section className="space-y-md animate-fade-in-up">
        <div className="border-b border-outline-variant pb-3 flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
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
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-outline mb-3 block">article</span>
            <p className="font-body-md text-on-surface-variant mb-md">
              No notes directly linked to {thinker.name} yet.
            </p>
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 h-[40px] px-md bg-secondary text-white rounded-lg font-label-md text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Explore All Notes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter stagger">
            {relatedNotes.map((note) => (
              <div key={note.id} className="animate-fade-in-up">
                <NoteCard note={note} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══ EXPLORE MORE THINKERS ════════════════════════════════════════ */}
      {otherThinkers.length > 0 && (
        <section className="space-y-md animate-fade-in-up">
          <div className="border-b border-outline-variant pb-3 flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-secondary">diversity_3</span>
              Explore More Thinkers
            </h2>
            <Link
              to="/thinkers"
              className="text-secondary font-label-md text-sm hover:underline flex items-center gap-1"
            >
              View all
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter stagger">
            {otherThinkers.map((t) => (
              <div key={t.id} className="animate-fade-in-up">
                <ThinkerCard thinker={t} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
