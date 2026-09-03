import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getThinkerBySlug } from '../../api/thinkers';
import { getNotes } from '../../api/notes';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { NoteCard } from '../../components/NoteCard/NoteCard';

export const ThinkerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: thinker, isLoading: isThinkerLoading } = useQuery({
    queryKey: ['thinker', slug],
    queryFn: () => getThinkerBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: allNotes = [] } = useQuery({
    queryKey: ['notes-all'],
    queryFn: () => getNotes(),
  });

  if (isThinkerLoading) {
    return <div className="text-center py-xl text-on-surface-variant">Loading thinker profile...</div>;
  }

  if (!thinker) {
    return (
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Thinker Profile Not Found</h2>
        <Link to="/thinkers" className="text-secondary font-label-md hover:underline">
          Return to Thinkers Directory
        </Link>
      </div>
    );
  }

  const relatedNotes = allNotes.filter(
    (n) => n.slug.includes(slug?.replace('-page', '') || '') || n.keywords.some((k) => thinker.name.toLowerCase().includes(k))
  );

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Thinkers', url: '/thinkers' }, { label: thinker.name }]} />

      {/* Hero Section */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md md:p-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="md:col-span-4">
          <div className="h-80 rounded-xl overflow-hidden bg-surface-container border border-outline-variant shadow-md">
            <img
              src={thinker.portrait_url}
              alt={thinker.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="md:col-span-8 space-y-md">
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded text-caption font-label-md uppercase tracking-wider font-bold">
            {thinker.contribution}
          </span>
          
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
            {thinker.name}
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {thinker.bio}
          </p>

          <div className="pt-sm border-t border-outline-variant">
            <h4 className="font-label-md text-label-md text-primary mb-2 uppercase tracking-wider">
              Seminal / Key Works
            </h4>
            <div className="flex flex-wrap gap-2">
              {thinker.key_works.map((work, idx) => (
                <span key={idx} className="bg-surface-container px-3 py-1.5 rounded text-sm text-on-surface font-medium border border-outline-variant/60">
                  {work}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Notes & Analyses */}
      <div className="space-y-md">
        <div className="border-b border-outline-variant pb-2">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Analysis & Notes on {thinker.name}
          </h2>
        </div>

        {relatedNotes.length === 0 ? (
          <div className="p-md bg-surface-container-low rounded-xl text-on-surface-variant">
            Explore notes under Modern Political Philosophy and Indian Political Thought.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {relatedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
