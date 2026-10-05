import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '../../api/subjects';
import { SubjectCard } from '../../components/SubjectCard/SubjectCard';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

export const SubjectListing: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects-list-page'],
    queryFn: getSubjects,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return subjects;
    const q = search.toLowerCase();
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [subjects, search]);

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Subjects' }]} />

      {/* Page Header */}
      <div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-xs">
          Political Science Subjects
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Browse full academic courses and unit breakdowns across modern philosophy, theory,
          Indian thought, IR, comparative politics, and public administration.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
          search
        </span>
        <input
          type="text"
          id="subjects-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subjects…"
          className="w-full pl-10 pr-10 h-[44px] bg-surface border border-outline-variant rounded-xl text-sm font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Results info */}
      {!isLoading && search && (
        <p className="text-caption font-caption text-on-surface-variant -mt-2">
          {filtered.length} subject{filtered.length !== 1 ? 's' : ''} matching &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-xl text-center space-y-sm">
          <span className="material-symbols-outlined text-[48px] text-outline block">search_off</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">No subjects found</p>
          <button
            onClick={() => setSearch('')}
            className="text-secondary font-label-md hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter stagger animate-fade-in-up">
          {filtered.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};
