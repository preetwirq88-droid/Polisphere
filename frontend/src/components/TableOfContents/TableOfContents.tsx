import React, { useState, useEffect } from 'react';
import type { NoteSection } from '../../api/notes';

interface TableOfContentsProps {
  sections: NoteSection[];
  hasComparison?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ sections, hasComparison }) => {
  const [activeAnchor, setActiveAnchor] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const allAnchors = sections.map((s) => s.anchor);
      if (hasComparison) allAnchors.push('comparison');

      const scrollPosition = window.scrollY + 140;

      for (let i = allAnchors.length - 1; i >= 0; i--) {
        const element = document.getElementById(allAnchors[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveAnchor(allAnchors[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, hasComparison]);

  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-[100px] toc-container overflow-y-auto max-h-[calc(100vh-120px)] pr-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Contents</h3>
        <nav className="flex flex-col space-y-sm border-l border-outline-variant pl-sm">
          {sections.map((section) => {
            const isActive = activeAnchor === section.anchor;
            return (
              <a
                key={section.anchor}
                href={`#${section.anchor}`}
                className={`font-label-md text-label-md transition-colors ${
                  isActive
                    ? "text-secondary font-semibold border-l-2 border-secondary -ml-[17px] pl-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {section.heading}
              </a>
            );
          })}
          {hasComparison && (
            <a
              href="#comparison"
              className={`font-label-md text-label-md transition-colors ${
                activeAnchor === 'comparison'
                  ? "text-secondary font-semibold border-l-2 border-secondary -ml-[17px] pl-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Comparison Matrix
            </a>
          )}
        </nav>
      </div>
    </aside>
  );
};
