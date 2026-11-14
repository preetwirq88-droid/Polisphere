import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getThinkers, DEFAULT_THINKERS } from '../../api/thinkers';
import { ThinkerCard } from '../../components/ThinkerCard/ThinkerCard';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

export const ThinkerListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';
  const traditionFromUrl = searchParams.get('tradition') || 'all';

  const [search, setSearch] = useState(queryFromUrl);
  const [selectedContribution, setSelectedContribution] = useState(traditionFromUrl);

  // Sync search state if URL ?q= or ?tradition= parameters change
  useEffect(() => {
    setSearch(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    setSelectedContribution(traditionFromUrl);
  }, [traditionFromUrl]);

  const { data: thinkers = DEFAULT_THINKERS, isLoading, isError, refetch } = useQuery({
    queryKey: ['thinkers-list-page'],
    queryFn: getThinkers,
    initialData: DEFAULT_THINKERS,
  });

  const handleSearchChange = (val: string) => {
    setSearch(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleContributionChange = (val: string) => {
    setSelectedContribution(val);
    const newParams = new URLSearchParams(searchParams);
    if (val !== 'all') {
      newParams.set('tradition', val);
    } else {
      newParams.delete('tradition');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedContribution('all');
    setSearchParams({}, { replace: true });
  };

  // Derive unique contribution labels for filter
  const contributionOptions = useMemo(() => {
    const list = Array.isArray(thinkers) && thinkers.length > 0 ? thinkers : DEFAULT_THINKERS;
    const unique = Array.from(new Set(list.map((t) => t.contribution).filter(Boolean)));
    return unique.sort();
  }, [thinkers]);

  const filtered = useMemo(() => {
    let list = Array.isArray(thinkers) && thinkers.length > 0 ? thinkers : DEFAULT_THINKERS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.contribution.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q) ||
          (t.key_works || []).some((w) => w.toLowerCase().includes(q)) ||
          t.slug.toLowerCase().includes(q)
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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, contribution, key works…"
            className="w-full pl-10 pr-4 h-[44px] bg-surface border border-outline-variant rounded-xl text-sm font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
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
            onChange={(e) => handleContributionChange(e.target.value)}
            className="appearance-none pl-9 pr-10 h-[44px] bg-surface border border-outline-variant rounded-xl text-sm font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors min-w-[200px] cursor-pointer"
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
            onClick={handleResetFilters}
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
          {isLoading && thinkers.length === 0 ? 'Loading thinkers…' : `${filtered.length} Thinker${filtered.length !== 1 ? 's' : ''} Found`}
        </h2>
        {filtered.length > 0 && (
          <span className="text-caption text-on-surface-variant font-caption">
            Comprehensive Directory
          </span>
        )}
      </div>

      {/* Grid */}
      {isLoading && thinkers.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : isError && thinkers.length === 0 ? (
        <div className="bg-surface border border-error/30 rounded-xl p-xl text-center space-y-sm">
          <span className="material-symbols-outlined text-[48px] text-error block">wifi_off</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Could not load thinkers</p>
          <p className="font-body-md text-on-surface-variant">
            The server could not be reached. Please check your connection or try again.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 mt-2 h-[40px] px-md bg-secondary text-white rounded-lg font-label-md text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-xl text-center space-y-sm">
          <span className="material-symbols-outlined text-[48px] text-outline block">person_search</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">No thinkers match your search</p>
          <p className="font-body-md text-on-surface-variant">
            No thinkers found matching &ldquo;{search}&rdquo;. Try another search term or{' '}
            <button
              onClick={handleResetFilters}
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
            <ThinkerCard key={thinker.id || thinker.slug} thinker={thinker} />
          ))}
        </div>
      )}

    </div>
  );
};
