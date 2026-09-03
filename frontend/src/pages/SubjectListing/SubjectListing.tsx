import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '../../api/subjects';
import { SubjectCard } from '../../components/SubjectCard/SubjectCard';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

export const SubjectListing: React.FC = () => {
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects-list-page'],
    queryFn: getSubjects,
  });

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Subjects' }]} />

      <div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-xs">
          Political Science Subjects
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Browse full academic courses and unit breakdowns across modern philosophy, theory, Indian thought, IR, comparative politics, and public administration.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-xl text-on-surface-variant">Loading academic subjects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};
