import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-outline-variant mt-auto py-xl">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="md:col-span-2">
          <Link to="/" className="font-headline-sm text-headline-sm font-bold text-primary mb-sm block">
            POLISPHERE
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-md">
            The premium academic learning hub for political science students, researchers, and educators. Rigorous notes, thinkers analysis, and exam resources.
          </p>
          <p className="font-caption text-caption text-outline">
            &copy; {new Date().getFullYear()} POLISPHERE Academic Learning Hub. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-primary mb-sm uppercase tracking-wider">Quick Navigation</h4>
          <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
            <li><Link to="/subjects" className="hover:text-secondary transition-colors">All Subjects</Link></li>
            <li><Link to="/thinkers" className="hover:text-secondary transition-colors">Political Thinkers</Link></li>
            <li><Link to="/exam-prep/important-questions" className="hover:text-secondary transition-colors">Important Questions Bank</Link></li>
            <li><Link to="/exam-prep/pyqs" className="hover:text-secondary transition-colors">Previous Year Questions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-primary mb-sm uppercase tracking-wider">Platform & Admin</h4>
          <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
            <li><Link to="/admin/login" className="hover:text-secondary transition-colors">Admin Dashboard Login</Link></li>
            <li><Link to="/resources" className="hover:text-secondary transition-colors">Academic Syllabus Guide</Link></li>
            <li><span className="text-caption text-outline block mt-2">Design Tokens: Academic Prestige</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
