import React from 'react';
import { Link } from 'react-router-dom';
import { Thinker } from '../../api/thinkers';

interface ThinkerCardProps {
  thinker: Thinker;
}

export const ThinkerCard: React.FC<ThinkerCardProps> = ({ thinker }) => {
  return (
    <Link
      to={`/thinkers/${thinker.slug}`}
      className="group bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:border-secondary hover:shadow-lg transition-all flex flex-col"
    >
      <div className="h-64 bg-surface-container overflow-hidden relative">
        <img
          src={thinker.portrait_url}
          alt={thinker.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-md">
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
