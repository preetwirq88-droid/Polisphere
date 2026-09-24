import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-on-surface text-white mt-auto">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-[72px] grid grid-cols-1 md:grid-cols-12 gap-10">

        {/* Brand column */}
        <div className="md:col-span-4">
          <Link to="/" className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-white text-[18px]">public</span>
            </div>
            <span className="font-bold text-[20px] tracking-tight text-white font-headline-sm">POLISPHERE</span>
          </Link>
          <p className="text-white/60 font-body-md text-[14px] leading-relaxed max-w-xs mb-6">
            The premier academic learning hub for political science students, researchers,
            and educators across India. Rigorous notes, thinker profiles, and exam resources.
          </p>
          <div className="flex gap-3">
            {['school', 'quiz', 'people'].map((icon) => (
              <div key={icon} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary flex items-center justify-center cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-white/70 hover:text-white text-[18px] transition-colors">{icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="md:col-span-2">
          <h4 className="font-label-md text-label-md text-white/40 uppercase tracking-widest mb-5">Study</h4>
          <ul className="space-y-3">
            {[
              { to: '/subjects', label: 'All Subjects' },
              { to: '/thinkers', label: 'Political Thinkers' },
              { to: '/exam-prep/important-questions', label: 'Question Bank' },
              { to: '/exam-prep/pyqs', label: 'Previous Year Qs' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/60 hover:text-white font-body-md text-[14px] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Subjects */}
        <div className="md:col-span-3">
          <h4 className="font-label-md text-label-md text-white/40 uppercase tracking-widest mb-5">Subjects</h4>
          <ul className="space-y-3">
            {[
              { to: '/subjects/political-theory', label: 'Political Theory' },
              { to: '/subjects/indian-political-thought', label: 'Indian Political Thought' },
              { to: '/subjects/western-political-thought', label: 'Western Political Thought' },
              { to: '/subjects/international-relations', label: 'International Relations' },
              { to: '/subjects/ugc-net-political-science', label: 'UGC NET Prep' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/60 hover:text-white font-body-md text-[14px] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform */}
        <div className="md:col-span-3">
          <h4 className="font-label-md text-label-md text-white/40 uppercase tracking-widest mb-5">Platform</h4>
          <ul className="space-y-3">
            {[
              { to: '/resources', label: 'Syllabus Guide' },
              { to: '/admin/login', label: 'Admin Login' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/60 hover:text-white font-body-md text-[14px] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mini subject cards */}
          <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-amber-300 font-label-md text-[12px] uppercase tracking-wider mb-2 font-bold">UGC NET Ready</p>
            <p className="text-white/70 text-[13px] font-body-md leading-relaxed">
              Complete syllabus coverage with unit-wise notes and MCQs.
            </p>
            <Link
              to="/subjects/ugc-net-political-science"
              className="inline-flex items-center gap-1 mt-3 text-secondary text-[13px] font-semibold hover:underline"
            >
              Start Preparing
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 font-body-md text-[13px]">
            &copy; {new Date().getFullYear()} POLISPHERE Academic Learning Hub. All rights reserved.
          </p>
          <p className="text-white/30 font-body-md text-[12px]">
            Built for political science students across India
          </p>
        </div>
      </div>
    </footer>
  );
};
