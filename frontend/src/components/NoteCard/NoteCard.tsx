import React from 'react';
import { Link } from 'react-router-dom';
import type { Note } from '../../api/notes';

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const getExcerpt = () => {
    if (note.sections && note.sections.length > 0) {
      return note.sections[0].body.replace(/[*_#]/g, '').slice(0, 160) + '...';
    }
    return 'Comprehensive analysis and study notes...';
  };

  return (
    <Link
      to={`/notes/${note.slug}`}
      className="group bg-surface border border-outline-variant rounded-xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:border-secondary transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-sm flex-wrap">
          <span className="bg-surface-container px-2.5 py-1 rounded text-on-surface-variant font-caption text-caption">
            Unit {note.unit_number}
          </span>
          <div className="flex items-center gap-2">
            {note.status === 'in_progress' && (
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-caption font-semibold">
                In Progress
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-caption font-semibold capitalize ${
              note.difficulty === 'advanced' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-primary'
            }`}>
              {note.difficulty}
            </span>
          </div>
        </div>

        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs group-hover:text-secondary transition-colors">
          {note.title}
        </h3>

        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-md">
          {getExcerpt()}
        </p>
      </div>

      <div className="pt-sm border-t border-outline-variant/60 flex items-center justify-between text-caption font-caption text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          {note.reading_time_minutes || 10} Min Read
        </span>
        <span className="text-secondary font-label-md text-label-md flex items-center group-hover:translate-x-1 transition-transform">
          Read Note <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
        </span>
      </div>
    </Link>
  );
};
