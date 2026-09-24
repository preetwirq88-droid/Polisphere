import React from 'react';
import { Link } from 'react-router-dom';
import type { Subject } from '../../api/subjects';

interface SubjectCardProps {
  subject: Subject;
}

const COLOR_CLASSES = [
  'from-blue-900 to-blue-700',
  'from-indigo-900 to-indigo-700',
  'from-purple-900 to-purple-700',
  'from-green-900 to-green-700',
  'from-teal-900 to-teal-700',
  'from-orange-800 to-orange-600',
  'from-red-900 to-red-700',
  'from-slate-800 to-slate-600',
  'from-amber-800 to-amber-600',
  'from-cyan-900 to-cyan-700',
  'from-emerald-900 to-emerald-700',
  'from-pink-900 to-pink-700',
];

// Deterministic color from slug
const getColor = (slug: string) => {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  return COLOR_CLASSES[Math.abs(hash) % COLOR_CLASSES.length];
};

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const color = getColor(subject.slug || subject.name);

  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <span className="material-symbols-outlined text-white text-[22px]">
            {subject.icon || 'menu_book'}
          </span>
        </div>

        <h3 className="font-semibold text-[16px] text-on-surface mb-2 leading-snug group-hover:text-secondary transition-colors">
          {subject.name}
        </h3>

        <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed flex-1 line-clamp-3">
          {subject.description}
        </p>

        <div className="mt-4 pt-4 border-t border-outline-variant/60 flex items-center justify-between">
          <span className="text-[12px] text-outline font-label-md">
            {subject.units ? `${subject.units.length} Units` : 'Browse Content'}
          </span>
          <span className="inline-flex items-center gap-1 text-secondary font-label-md text-[13px] font-semibold">
            Explore
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-200">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};
