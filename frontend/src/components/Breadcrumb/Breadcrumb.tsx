import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-on-surface-variant font-caption text-caption mb-md space-x-2 flex-wrap">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            )}
            {isLast || !item.url ? (
              <span className="text-on-surface font-medium">{item.label}</span>
            ) : (
              <Link to={item.url} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
