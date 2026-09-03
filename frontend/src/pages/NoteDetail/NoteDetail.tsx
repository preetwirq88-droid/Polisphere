import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNoteBySlug, getNotes } from '../../api/notes';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { TableOfContents } from '../../components/TableOfContents/TableOfContents';
import { ComparisonTable } from '../../components/ComparisonTable/ComparisonTable';
import { QuoteBox } from '../../components/Callouts/QuoteBox';
import { DefinitionBox } from '../../components/Callouts/DefinitionBox';

export const NoteDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', slug],
    queryFn: () => getNoteBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: allNotes = [] } = useQuery({
    queryKey: ['notes-related'],
    queryFn: () => getNotes(),
  });

  const relatedNotes = allNotes.filter((n) => n.id !== note?.id).slice(0, 3);

  if (isLoading) {
    return <div className="text-center py-xl text-on-surface-variant">Loading note analysis...</div>;
  }

  if (!note) {
    return (
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Note Not Found</h2>
        <Link to="/subjects" className="text-secondary font-label-md hover:underline">
          Return to Subjects
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg">
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Table of Contents */}
        <TableOfContents sections={note.sections} hasComparison={!!note.comparison_table} />

        {/* Center Column: Main Note Content */}
        <article className="col-span-1 lg:col-span-6 bg-surface border border-outline-variant rounded-xl p-md md:p-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] space-y-lg">
          <Breadcrumb
            items={[
              { label: 'Subjects', url: '/subjects' },
              { label: note.subject_name || 'Subject', url: `/subjects/${note.subject_name?.toLowerCase().replace(/\s+/g, '-')}` },
              { label: `Unit ${note.unit_number}` },
              { label: note.title },
            ]}
          />

          {/* Header */}
          <header className="border-b border-outline-variant pb-md">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-sm">
              {note.title}
            </h1>
            <div className="flex items-center gap-sm flex-wrap text-caption font-caption text-on-surface-variant">
              <span className="bg-surface-container px-2.5 py-1 rounded">Unit {note.unit_number}</span>
              <span className="bg-surface-container px-2.5 py-1 rounded">{note.reading_time_minutes} Min Read</span>
              <span className="bg-surface-container-high px-2.5 py-1 rounded capitalize font-semibold text-primary">
                {note.difficulty} Level
              </span>
            </div>
          </header>

          {/* Sections Rendered */}
          {note.sections.map((sec, idx) => (
            <section key={sec.anchor} id={sec.anchor} className="space-y-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {sec.heading}
              </h2>

              {/* Render callouts if Rousseau section */}
              {sec.anchor === 'introduction' && slug?.includes('rousseau') && (
                <QuoteBox
                  quote="Each of us puts his person and all his power in common under the supreme direction of the general will, and, in our corporate capacity, we receive each member as an indivisible part of the whole."
                  author="Jean-Jacques Rousseau"
                  source="The Social Contract (1762)"
                />
              )}

              {sec.anchor === 'meaning' && slug?.includes('rousseau') && (
                <DefinitionBox
                  title="CORE DEFINITION"
                  definition="The General Will is the will of the citizens directed towards the common good. It is fundamentally distinct from the 'Will of All' (the aggregate of private individual self-interests)."
                />
              )}

              <div className="font-body-md text-body-md text-on-surface leading-relaxed space-y-3 whitespace-pre-line">
                {sec.body}
              </div>
            </section>
          ))}

          {/* Render Comparison Table if exists */}
          {note.comparison_table && (
            <ComparisonTable data={note.comparison_table} />
          )}
        </article>

        {/* Right Column: Actions Rail & Related Notes */}
        <aside className="col-span-1 lg:col-span-3 space-y-lg">
          {/* Actions Rail */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm sticky top-[100px] space-y-sm">
            <h4 className="font-label-md text-label-md text-primary mb-2 uppercase tracking-wider">
              Actions
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-full py-2.5 px-3 rounded-lg border font-label-md text-sm flex items-center justify-center gap-2 transition-colors ${
                  isBookmarked
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isBookmarked ? 'bookmark_added' : 'bookmark'}
                </span>
                {isBookmarked ? 'Bookmarked' : 'Bookmark Note'}
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container font-label-md text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                Print Article
              </button>

              <button
                onClick={handleShare}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container font-label-md text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
                Share Link
              </button>
            </div>

            {/* Related Notes Rail */}
            <div className="pt-md border-t border-outline-variant">
              <h4 className="font-label-md text-label-md text-primary mb-sm uppercase tracking-wider">
                Related Notes
              </h4>
              <div className="space-y-sm">
                {relatedNotes.map((rn) => (
                  <Link
                    key={rn.id}
                    to={`/notes/${rn.slug}`}
                    className="block p-3 rounded-lg border border-outline-variant hover:border-secondary transition-colors bg-surface-container-lowest"
                  >
                    <span className="font-label-md text-on-surface font-medium block line-clamp-2">
                      {rn.title}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant block mt-1">
                      Unit {rn.unit_number} &bull; {rn.reading_time_minutes} Min Read
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
