import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjectBySlug } from '../../api/subjects';
import { getNotes } from '../../api/notes';
import { getThinkers } from '../../api/thinkers';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { NoteCard } from '../../components/NoteCard/NoteCard';
import { FilterPanel } from '../../components/FilterPanel/FilterPanel';

export const SubjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: subject, isLoading: isSubjLoading } = useQuery({
    queryKey: ['subject', slug],
    queryFn: () => getSubjectBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['notes-subject', slug, difficultyFilter, statusFilter],
    queryFn: () =>
      getNotes({
        subject_slug: slug,
        difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        status_filter: statusFilter !== 'all' ? statusFilter : undefined,
      }),
    enabled: !!slug,
  });

  const { data: allThinkers = [] } = useQuery({
    queryKey: ['thinkers'],
    queryFn: getThinkers,
  });

  const relatedThinkers = allThinkers.filter(
    (t) => subject && t.related_subject_ids.includes(subject.id)
  );

  if (isSubjLoading) {
    return <div className="text-center py-xl text-on-surface-variant">Loading subject details...</div>;
  }

  if (!subject) {
    return (
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Subject Not Found</h2>
        <Link to="/subjects" className="text-secondary font-label-md hover:underline">
          Return to All Subjects
        </Link>
      </div>
    );
  }

  // Group notes by unit number
  const unitsMap = new Map<number, typeof notes>();
  subject.units.forEach((u) => unitsMap.set(u.unit_number, []));
  notes.forEach((n) => {
    const list = unitsMap.get(n.unit_number) || [];
    list.push(n);
    unitsMap.set(n.unit_number, list);
  });

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Subjects', url: '/subjects' }, { label: subject.name }]} />

      {/* Header */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md md:p-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3 mb-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">{subject.icon || 'school'}</span>
          </div>
          <span className="font-label-md text-caption uppercase text-secondary font-bold tracking-wider">
            Academic Subject
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-sm">
          {subject.name}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          {subject.description}
        </p>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        title="Quick Filters"
        filters={[
          {
            key: 'difficulty',
            label: 'Difficulty Level',
            value: difficultyFilter,
            options: [
              { label: 'All Levels', value: 'all' },
              { label: 'Introductory', value: 'introductory' },
              { label: 'Advanced', value: 'advanced' },
            ],
          },
          {
            key: 'status',
            label: 'Content Status',
            value: statusFilter,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Published', value: 'published' },
              { label: 'In Progress', value: 'in_progress' },
            ],
          },
        ]}
        onChange={(k, v) => {
          if (k === 'difficulty') setDifficultyFilter(v);
          if (k === 'status') setStatusFilter(v);
        }}
        onReset={() => {
          setDifficultyFilter('all');
          setStatusFilter('all');
        }}
      />

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left/Center Column: Units and Notes */}
        <div className="lg:col-span-8 space-y-xl">
          {subject.units.map((unit) => {
            const unitNotes = unitsMap.get(unit.unit_number) || [];
            return (
              <div key={unit.unit_number} className="space-y-md">
                <div className="flex items-center gap-3 border-b border-outline-variant pb-2">
                  <span className="bg-primary text-white font-label-md text-caption px-2.5 py-1 rounded">
                    Unit {unit.unit_number}
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    {unit.title}
                  </h2>
                </div>

                {unitNotes.length === 0 ? (
                  <p className="font-body-md text-on-surface-variant italic py-4">
                    No notes matching the current filter in this unit.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    {unitNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Sidebar: Thinkers in this Subject */}
        <aside className="lg:col-span-4 space-y-md">
          <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">groups</span>
              Thinkers in this Subject
            </h3>
            <p className="font-caption text-caption text-on-surface-variant mb-md">
              Key philosophers and political theorists studied within this syllabus module.
            </p>

            {relatedThinkers.length === 0 ? (
              <p className="text-caption text-on-surface-variant italic">No linked thinker profiles yet.</p>
            ) : (
              <div className="space-y-sm">
                {relatedThinkers.map((t) => (
                  <Link
                    key={t.id}
                    to={`/thinkers/${t.slug}`}
                    className="p-3 rounded-lg border border-outline-variant hover:border-secondary transition-colors flex items-center gap-3 bg-surface-container-lowest"
                  >
                    <img
                      src={t.portrait_url}
                      alt={t.name}
                      className="w-12 h-12 rounded-lg object-cover bg-surface-container"
                    />
                    <div>
                      <span className="font-label-md text-on-surface font-semibold block">{t.name}</span>
                      <span className="font-caption text-caption text-on-surface-variant block">{t.contribution}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
