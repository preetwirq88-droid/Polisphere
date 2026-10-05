import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getThinkers } from '../../api/thinkers';
import { ThinkerCard } from '../../components/ThinkerCard/ThinkerCard';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

export const ThinkerListing: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedContribution, setSelectedContribution] = useState('all');

  const { data: thinkers = [], isLoading } = useQuery({
    queryKey: ['thinkers-list-page'],
    queryFn: getThinkers,
  });

  // Derive unique contribution labels for filter
  const contributionOptions = useMemo(() => {
    const unique = Array.from(new Set(thinkers.map((t) => t.contribution).filter(Boolean)));
    return unique.sort();
  }, [thinkers]);

  const filtered = useMemo(() => {
    let list = thinkers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.contribution.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q) ||
          t.key_works.some((w) => w.toLowerCase().includes(q))
      );
    }
    if (selectedContribution !== 'all') {
      list = list.filter((t) => t.contribution === selectedContribution);
    }
    return list;
  }, [thinkers, search, selectedContribution]);

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Thinkers' }]} />

      {/* Page Header */}
      <div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-xs">
          Political Thinkers &amp; Philosophers
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Comprehensive profiles, philosophical achievements, primary texts, and linked analyses of influential political thinkers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            id="thinker-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, contribution, key works…"
            className="w-full pl-10 pr-4 h-[44px] bg-surface border border-outline-variant rounded-xl text-sm font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
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

        {/* Contribution filter */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            filter_list
          </span>
          <select
            id="thinker-contribution-filter"
            value={selectedContribution}
            onChange={(e) => setSelectedContribution(e.target.value)}
            className="appearance-none pl-9 pr-10 h-[44px] bg-surface border border-outline-variant rounded-xl text-sm font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors min-w-[180px] cursor-pointer"
          >
            <option value="all">All Traditions</option>
            {contributionOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Reset button — only show when filters active */}
        {(search || selectedContribution !== 'all') && (
          <button
            onClick={() => { setSearch(''); setSelectedContribution('all'); }}
            className="h-[44px] px-4 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-label-md hover:bg-surface-container transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Reset
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          {isLoading ? 'Loading thinkers…' : `${filtered.length} Thinker${filtered.length !== 1 ? 's' : ''} Found`}
        </h2>
        {!isLoading && filtered.length > 0 && (
          <span className="text-caption text-on-surface-variant font-caption">
            Sorted A–Z by name
          </span>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-xl text-center space-y-sm">
          <span className="material-symbols-outlined text-[48px] text-outline block">person_search</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">No thinkers match your search</p>
          <p className="font-body-md text-on-surface-variant">
            Try a different keyword or{' '}
            <button
              onClick={() => { setSearch(''); setSelectedContribution('all'); }}
              className="text-secondary hover:underline font-semibold"
            >
              reset the filters
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter stagger animate-fade-in-up">
          {filtered.map((thinker) => (
            <ThinkerCard key={thinker.id} thinker={thinker} />
          ))}
        </div>
      )}
    </div>
  );
};
