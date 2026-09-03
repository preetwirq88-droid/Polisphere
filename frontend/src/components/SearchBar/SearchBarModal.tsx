import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll, SearchResults } from '../../api/search';

interface SearchBarModalProps {
  onClose: () => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchAll(query);
        setResults(res);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search input header */}
        <div className="p-4 border-b border-outline-variant flex items-center gap-3 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-secondary">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, thinkers, subjects (e.g. Rousseau, General Will, Hobbes)..."
            className="w-full bg-transparent border-none text-on-surface font-body-md focus:outline-none placeholder:text-outline"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="text-center py-6 text-on-surface-variant font-label-md">Searching academic repository...</div>
          )}

          {!isLoading && results && (
            <>
              {results.notes.length === 0 && results.thinkers.length === 0 && results.subjects.length === 0 && (
                <div className="text-center py-6 text-on-surface-variant">No academic resources found matching "{query}"</div>
              )}

              {/* Notes */}
              {results.notes.length > 0 && (
                <div>
                  <h4 className="font-label-md text-caption uppercase text-outline mb-2 tracking-wider">Notes & Articles</h4>
                  <div className="space-y-1">
                    {results.notes.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleSelect(`/notes/${n.slug}`)}
                        className="p-3 rounded-lg hover:bg-surface-container cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-outline-variant"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary">article</span>
                          <span className="font-medium text-on-surface">{n.title}</span>
                        </div>
                        {n.difficulty && (
                          <span className="text-caption bg-surface-container-high px-2 py-0.5 rounded capitalize text-on-surface-variant">
                            {n.difficulty}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thinkers */}
              {results.thinkers.length > 0 && (
                <div>
                  <h4 className="font-label-md text-caption uppercase text-outline mb-2 tracking-wider">Political Thinkers</h4>
                  <div className="space-y-1">
                    {results.thinkers.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleSelect(`/thinkers/${t.slug}`)}
                        className="p-3 rounded-lg hover:bg-surface-container cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-secondary">person</span>
                        <div>
                          <span className="font-medium text-on-surface block">{t.name}</span>
                          <span className="text-caption text-on-surface-variant block">{t.contribution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects */}
              {results.subjects.length > 0 && (
                <div>
                  <h4 className="font-label-md text-caption uppercase text-outline mb-2 tracking-wider">Subjects & Modules</h4>
                  <div className="space-y-1">
                    {results.subjects.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelect(`/subjects/${s.slug}`)}
                        className="p-3 rounded-lg hover:bg-surface-container cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-secondary">{s.icon || 'school'}</span>
                        <span className="font-medium text-on-surface">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!query.trim() && (
            <div className="py-4">
              <span className="font-label-md text-caption uppercase text-outline block mb-2 tracking-wider">Popular Searches</span>
              <div className="flex flex-wrap gap-2">
                {['Rousseau General Will', 'Harm Principle', 'Hobbes vs Locke', 'Annihilation of Caste', 'Social Contract'].map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setQuery(pill)}
                    className="bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-lg text-sm text-on-surface-variant transition-colors"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
