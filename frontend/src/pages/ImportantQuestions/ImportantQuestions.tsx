import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getImportantQuestions } from '../../api/importantQuestions';
import { getSubjects } from '../../api/subjects';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { FilterPanel } from '../../components/FilterPanel/FilterPanel';

export const ImportantQuestions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get('subject') || 'all');
  const [selectedUnit, setSelectedUnit] = useState<string>(searchParams.get('unit') || '0');
  const [selectedTopic, setSelectedTopic] = useState<string>(searchParams.get('topic') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(searchParams.get('difficulty') || 'all');

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const { data: questions = [], isLoading, refetch } = useQuery({
    queryKey: ['important-questions', selectedSubject, selectedUnit, selectedTopic, selectedDifficulty],
    queryFn: () =>
      getImportantQuestions({
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        unit: selectedUnit !== '0' ? parseInt(selectedUnit) : undefined,
        topic: selectedTopic !== 'all' ? selectedTopic : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
      }),
  });

  const handleApply = () => {
    const params: Record<string, string> = {};
    if (selectedSubject !== 'all') params.subject = selectedSubject;
    if (selectedUnit !== '0') params.unit = selectedUnit;
    if (selectedTopic !== 'all') params.topic = selectedTopic;
    if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;
    setSearchParams(params);
    refetch();
  };

  const handleReset = () => {
    setSelectedSubject('all');
    setSelectedUnit('0');
    setSelectedTopic('all');
    setSelectedDifficulty('all');
    setSearchParams({});
  };

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Exam Prep' }, { label: 'Important Questions' }]} />

      <div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-xs">
          Important Questions Bank
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Curated exam questions categorized by Subject, Unit, Topic, and Difficulty with direct links to analysis notes.
        </p>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        title="Filter Question Bank"
        filters={[
          {
            key: 'subject',
            label: 'Subject',
            value: selectedSubject,
            options: [
              { label: 'All Subjects', value: 'all' },
              ...subjects.map((s) => ({ label: s.name, value: s.slug })),
            ],
          },
          {
            key: 'unit',
            label: 'Unit / Module',
            value: selectedUnit,
            options: [
              { label: 'All Units', value: '0' },
              { label: 'Unit 1', value: '1' },
              { label: 'Unit 2', value: '2' },
              { label: 'Unit 3', value: '3' },
            ],
          },
          {
            key: 'topic',
            label: 'Topic Keyword',
            value: selectedTopic,
            options: [
              { label: 'All Topics', value: 'all' },
              { label: 'Social Contract Theory', value: 'Social Contract' },
              { label: 'Liberty & Freedom', value: 'Liberty' },
              { label: 'Caste & Social Democracy', value: 'Caste' },
              { label: 'Justice Theories', value: 'Justice' },
            ],
          },
          {
            key: 'difficulty',
            label: 'Difficulty',
            value: selectedDifficulty,
            options: [
              { label: 'All Levels', value: 'all' },
              { label: 'Beginner', value: 'beginner' },
              { label: 'Intermediate', value: 'intermediate' },
              { label: 'Advanced', value: 'advanced' },
            ],
          },
        ]}
        onChange={(k, v) => {
          if (k === 'subject') setSelectedSubject(v);
          if (k === 'unit') setSelectedUnit(v);
          if (k === 'topic') setSelectedTopic(v);
          if (k === 'difficulty') setSelectedDifficulty(v);
        }}
        onApply={handleApply}
        onReset={handleReset}
      />

      {/* Questions Results List */}
      <div className="space-y-md">
        <div className="flex items-center justify-between border-b border-outline-variant pb-2">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Matched Questions ({questions.length})
          </h2>
          <span className="text-caption text-on-surface-variant">Showing active curated items</span>
        </div>

        {isLoading ? (
          <div className="text-center py-xl text-on-surface-variant">Filtering questions...</div>
        ) : questions.length === 0 ? (
          <div className="bg-surface p-xl rounded-xl border border-outline-variant text-center space-y-sm">
            <span className="material-symbols-outlined text-[48px] text-outline">help_outline</span>
            <p className="font-body-md text-on-surface-variant">No questions match the current filter selection.</p>
            <button onClick={handleReset} className="text-secondary font-label-md hover:underline">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-md">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-surface border border-outline-variant rounded-xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] space-y-sm"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap text-caption font-caption text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-white px-2.5 py-0.5 rounded font-medium">
                      Q{idx + 1}
                    </span>
                    <span className="bg-surface-container px-2.5 py-0.5 rounded">
                      {q.subject_name || 'Political Science'} &bull; Unit {q.unit_number}
                    </span>
                    <span className="bg-surface-container-high px-2.5 py-0.5 rounded text-primary font-medium">
                      Topic: {q.topic}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-caption font-semibold capitalize ${
                    q.difficulty === 'advanced'
                      ? 'bg-error-container text-on-error-container'
                      : q.difficulty === 'intermediate'
                      ? 'bg-secondary-fixed text-on-secondary-fixed'
                      : 'bg-surface-container-high text-primary'
                  }`}>
                    {q.difficulty} Level
                  </span>
                </div>

                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  "{q.question}"
                </p>

                <div className="pt-sm border-t border-outline-variant/60 flex items-center justify-between">
                  <span className="text-caption text-outline">Verified Academic Question</span>
                  {q.note_id ? (
                    <Link
                      to="/notes/rousseau-general-will"
                      className="text-secondary font-label-md text-label-md flex items-center gap-1 hover:underline"
                    >
                      Study Reference Note <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  ) : (
                    <span className="text-caption text-on-surface-variant">Notes in preparation</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
