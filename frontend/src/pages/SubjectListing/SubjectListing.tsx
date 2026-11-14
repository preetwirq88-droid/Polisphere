import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjects, DEFAULT_SUBJECTS } from '../../api/subjects';
import { SubjectCard } from '../../components/SubjectCard/SubjectCard';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

export const SubjectListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';
  const [search, setSearch] = useState(queryFromUrl);

  // Sync search state if URL ?q= parameter changes (e.g., from header search)
  useEffect(() => {
    setSearch(queryFromUrl);
  }, [queryFromUrl]);

  const { data: subjects = DEFAULT_SUBJECTS, isLoading, isError, refetch } = useQuery({
    queryKey: ['subjects-list-page'],
    queryFn: getSubjects,
    initialData: DEFAULT_SUBJECTS,
  });

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchParams({}, { replace: true });
  };

  const filtered = useMemo(() => {
    const list = Array.isArray(subjects) && subjects.length > 0 ? subjects : DEFAULT_SUBJECTS;
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
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
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search subjects — Theory, IR, Constitution…"
          className="w-full pl-10 pr-10 h-[44px] bg-surface border border-outline-variant rounded-xl text-sm font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
        />
        {search && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Results summary counter */}
      {search && (
        <p className="text-caption font-caption text-on-surface-variant -mt-2">
          {filtered.length} subject{filtered.length !== 1 ? 's' : ''} matching &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Subject Cards Grid */}
      {isLoading && subjects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : isError && subjects.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-xl text-center space-y-sm">
          <span className="material-symbols-outlined text-[48px] text-error block">wifi_off</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Unable to load subjects</p>
          <p className="font-body-md text-on-surface-variant text-sm">
            Could not retrieve the subjects catalogue. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-xl text-center space-y-sm">
          <span className="material-symbols-outlined text-[48px] text-outline block">search_off</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">No subjects found</p>
          <p className="font-body-md text-on-surface-variant text-sm">
            No subjects match &ldquo;{search}&rdquo;. Try another topic name or clear your search filter.
          </p>
          <button
            onClick={handleClearSearch}
            className="text-secondary font-label-md hover:underline font-semibold"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger animate-fade-in-up">
          {filtered.map((subject) => (
            <SubjectCard key={subject.id || subject.slug} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};
