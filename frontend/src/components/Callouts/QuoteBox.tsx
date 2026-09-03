import React from 'react';

interface QuoteBoxProps {
  quote: string;
  author?: string;
  source?: string;
}

export const QuoteBox: React.FC<QuoteBoxProps> = ({ quote, author, source }) => {
  return (
    <blockquote className="bg-surface-container border-l-4 border-secondary p-md my-md rounded-r-lg italic font-body-lg text-body-lg text-on-surface-variant">
      "{quote}"
      {(author || source) && (
        <footer className="mt-2 font-caption text-caption text-on-surface font-semibold not-italic">
          — {author}{source ? `, ${source}` : ''}
        </footer>
      )}
    </blockquote>
  );
};
