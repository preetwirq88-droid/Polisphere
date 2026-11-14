import React from 'react';
import { Link } from 'react-router-dom';
import type { Thinker } from '../../api/thinkers';

interface ThinkerCardProps {
  thinker: Thinker;
}

export const ThinkerCard: React.FC<ThinkerCardProps> = ({ thinker }) => {
  const [imageError, setImageError] = React.useState(false);
  const portrait = thinker.portrait_url || `/images/thinkers/${thinker.slug}.jpg`;

  return (
    <Link
      to={`/thinkers/${thinker.slug}`}
      id={`thinker-card-${thinker.slug}`}
      className="group bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:border-secondary hover:shadow-lg transition-all flex flex-col"
    >
      <div className="h-64 bg-surface-container overflow-hidden relative flex items-center justify-center">
        {/* Fallback silhouette if image fails or is absent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/5 flex flex-col items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[64px] text-secondary/40 select-none">
            account_circle
          </span>
          <span className="text-on-surface-variant font-label-md text-xs select-none">
            {thinker.name}
          </span>
        </div>

        {!imageError && portrait && (
          <img
            src={portrait}
            alt={`Portrait of ${thinker.name}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 relative z-10"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-md z-20 pointer-events-none">
          <span className="text-white font-caption text-caption bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded">
            {thinker.contribution}
          </span>
        </div>
      </div>

      <div className="p-md flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs group-hover:text-secondary transition-colors">
            {thinker.name}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-sm">
            {thinker.bio}
          </p>
        </div>

        <div className="pt-sm border-t border-outline-variant/60 flex items-center justify-between text-secondary font-label-md text-label-md">
          <span>Explore Thinker</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
};
