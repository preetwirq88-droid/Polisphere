import React from 'react';
import { Link } from 'react-router-dom';
import { Subject } from '../../api/subjects';

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-lg hover:border-secondary transition-all flex flex-col justify-between"
    >
      <div>
        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-md group-hover:bg-secondary group-hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[24px]">{subject.icon || 'menu_book'}</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs group-hover:text-secondary transition-colors">
          {subject.name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-md">
          {subject.description}
        </p>
      </div>

      <div className="pt-sm border-t border-outline-variant/60 flex items-center justify-between font-label-md text-label-md text-secondary">
        <span>{subject.units ? `${subject.units.length} Modules / Units` : 'Browse Content'}</span>
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </div>
    </Link>
  );
};
