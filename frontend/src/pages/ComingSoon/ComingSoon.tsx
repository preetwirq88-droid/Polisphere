import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

export const ComingSoon: React.FC = () => {
  const location = useLocation();
  const pageTitle = location.pathname.includes('pyq') ? 'Previous Year Questions (PYQs)' : 'Academic Resources & Syllabus';

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: pageTitle }]} />

      <div className="bg-surface border border-outline-variant rounded-xl p-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] text-center space-y-md my-lg max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-surface-container-high text-secondary flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[36px]">hourglass_top</span>
        </div>

        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
          {pageTitle}
        </h1>

        <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded text-caption font-bold uppercase tracking-wider">
          Module Under Editorial Review
        </span>

        <p className="font-body-lg text-body-lg text-on-surface-variant">
          This academic section is currently being compiled by our political science editorial team. In the meantime, explore our finished study notes, core subjects, and important questions bank.
        </p>

        <div className="pt-md flex items-center justify-center gap-md">
          <Link
            to="/subjects"
            className="h-[48px] px-md bg-secondary text-white font-label-md text-label-md rounded-lg hover:bg-secondaryContainer transition-colors flex items-center gap-2"
          >
            Explore All Subjects
          </Link>
          <Link
            to="/exam-prep/important-questions"
            className="h-[48px] px-md border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2"
          >
            Important Questions
          </Link>
        </div>
      </div>
    </div>
  );
};
