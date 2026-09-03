import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getThinkers } from '../../api/thinkers';
import { ThinkerCard } from '../../components/ThinkerCard/ThinkerCard';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

export const ThinkerListing: React.FC = () => {
  const { data: thinkers = [], isLoading } = useQuery({
    queryKey: ['thinkers-list-page'],
    queryFn: getThinkers,
  });

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Thinkers' }]} />

      <div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-xs">
          Political Thinkers & Philosophers
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Comprehensive profiles, philosophical achievements, primary texts, and linked analyses of influential political thinkers.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-xl text-on-surface-variant">Loading thinkers directory...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
          {thinkers.map((thinker) => (
            <ThinkerCard key={thinker.id} thinker={thinker} />
          ))}
        </div>
      )}
    </div>
  );
};
