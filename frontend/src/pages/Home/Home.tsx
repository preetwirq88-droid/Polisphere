import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '../../api/subjects';
import { getNotes } from '../../api/notes';
import { getThinkers } from '../../api/thinkers';
import { SubjectCard } from '../../components/SubjectCard/SubjectCard';
import { NoteCard } from '../../components/NoteCard/NoteCard';
import { ThinkerCard } from '../../components/ThinkerCard/ThinkerCard';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: subjects = [], isLoading: isSubjLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const { data: notes = [], isLoading: isNotesLoading } = useQuery({
    queryKey: ['notes-home'],
    queryFn: () => getNotes(),
  });

  const { data: thinkers = [], isLoading: isThinkersLoading } = useQuery({
    queryKey: ['thinkers-home'],
    queryFn: getThinkers,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/exam-prep/important-questions?topic=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-xl pb-xl">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-surface-container-low to-surface border-b border-outline-variant py-xl px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-7 space-y-md">
            <div className="inline-flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded-full text-secondary font-label-md text-caption">
              <span className="material-symbols-outlined text-[16px]">school</span>
              Academic Excellence Platform
            </div>
            
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Master Political Science with Rigorous Clarity
            </h1>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Curated study notes, comparative matrix breakdowns, thinker biographies, and filterable question banks designed for modern political theory scholars.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl p-2 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] focus-within:border-secondary transition-colors">
                <span className="material-symbols-outlined text-secondary ml-3 mr-2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics e.g. Rousseau, General Will, Harm Principle..."
                  className="w-full bg-transparent border-none text-on-surface font-body-md focus:outline-none placeholder:text-outline"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-md py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Suggestion Pills */}
            <div className="flex items-center gap-2 flex-wrap text-caption font-caption text-on-surface-variant pt-2">
              <span className="font-semibold text-primary">Popular:</span>
              {['Rousseau: General Will', 'J.S. Mill: Harm Principle', 'Ambedkar: Caste', 'Social Contract Matrix'].map((tag) => (
                <Link
                  key={tag}
                  to={`/notes/rousseau-general-will`}
                  className="bg-surface-container px-2.5 py-1 rounded hover:bg-surface-container-high transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-outline-variant aspect-[4/3] bg-surface-container">
              <img
                src="/assets/hero-desk.png"
                alt="Political Science Desk"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid Section */}
      <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Core Academic Subjects</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Explore comprehensive subject modules aligned with university syllabi.</p>
          </div>
          <Link to="/subjects" className="text-secondary font-label-md text-label-md flex items-center hover:underline">
            View All Subjects <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
          </Link>
        </div>

        {isSubjLoading ? (
          <div className="text-center py-xl text-on-surface-variant">Loading core subjects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Notes Section */}
      <section className="bg-surface-container-low py-xl border-y border-outline-variant">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Featured Academic Notes</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">In-depth theoretical analyses with sticky outline navigation and comparison matrices.</p>
            </div>
            <Link to="/subjects/modern-political-philosophy" className="text-secondary font-label-md text-label-md flex items-center hover:underline">
              Browse All Notes <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
            </Link>
          </div>

          {isNotesLoading ? (
            <div className="text-center py-xl text-on-surface-variant">Loading academic notes...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Thinkers Teaser Section */}
      <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Influential Political Thinkers</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Key contributions, seminal texts, and critical philosophical legacies.</p>
          </div>
          <Link to="/thinkers" className="text-secondary font-label-md text-label-md flex items-center hover:underline">
            View All Thinkers <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
          </Link>
        </div>

        {isThinkersLoading ? (
          <div className="text-center py-xl text-on-surface-variant">Loading thinkers database...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
            {thinkers.map((thinker) => (
              <ThinkerCard key={thinker.id} thinker={thinker} />
            ))}
          </div>
        )}
      </section>

      {/* Exam Prep Banner */}
      <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-primary text-white rounded-xl p-md md:p-xl flex flex-col md:flex-row items-center justify-between gap-gutter shadow-xl">
          <div className="space-y-sm max-w-xl">
            <span className="bg-secondary-container text-white px-3 py-1 rounded text-caption font-label-md uppercase tracking-wider">
              Exam Preparation Bank
            </span>
            <h3 className="font-headline-md text-headline-md text-white">Filterable Important Questions Bank</h3>
            <p className="font-body-md text-body-md text-surface-variant">
              Practice top exam questions categorized by Subject, Unit, Topic, and Difficulty level with linked answer notes.
            </p>
          </div>
          <Link
            to="/exam-prep/important-questions"
            className="h-[48px] px-lg bg-secondary text-white font-label-md text-label-md rounded-lg hover:bg-secondaryContainer transition-colors flex items-center justify-center whitespace-nowrap"
          >
            Access Question Bank
          </Link>
        </div>
      </section>
    </div>
  );
};
