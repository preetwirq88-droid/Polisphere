import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  QUESTIONS_CATALOGUE,
  SUBJECT_CATEGORIES,
  TOPIC_MOCK_TESTS,
  type MCQQuestion,
  type ShortAnswerQuestion,
  type LongAnswerQuestion,
  type MockTestMeta,
} from '../../data/questionsData';
import { getImportantQuestions } from '../../api/importantQuestions';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

interface ImportantQuestionsProps {
  initialCategory?: 'all' | 'mcq' | 'short' | 'long' | 'pyq' | 'mock-tests';
}

export const ImportantQuestions: React.FC<ImportantQuestionsProps> = ({ initialCategory }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Determine initial tab from props, URL path (/exam-prep/pyqs), or query param (?tab=...)
  const determineInitialTab = (): 'all' | 'mcq' | 'short' | 'long' | 'pyq' | 'mock-tests' => {
    if (initialCategory) return initialCategory;
    if (location.pathname.includes('/exam-prep/pyqs')) return 'pyq';
    const paramTab = searchParams.get('tab');
    if (paramTab === 'mcq' || paramTab === 'short' || paramTab === 'long' || paramTab === 'pyq' || paramTab === 'mock-tests') {
      return paramTab;
    }
    return 'all';
  };

  const [activeTab, setActiveTab] = useState<'all' | 'mcq' | 'short' | 'long' | 'pyq' | 'mock-tests'>(determineInitialTab);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get('subject') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(searchParams.get('difficulty') || 'all');
  const [selectedMarks, setSelectedMarks] = useState<string>(searchParams.get('marks') || 'all');

  // MCQ Practice Session State
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [submittedMcqs, setSubmittedMcqs] = useState<Record<string, boolean>>({});
  const [mcqScore, setMcqScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Expand/Collapse state for Descriptive Model Answers
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  // Active Mock Test State
  const [activeMockTest, setActiveMockTest] = useState<MockTestMeta | null>(null);
  const [mockCurrentIndex, setMockCurrentIndex] = useState<number>(0);
  const [mockUserAnswers, setMockUserAnswers] = useState<Record<number, number>>({});
  const [mockSubmitted, setMockSubmitted] = useState<boolean>(false);
  const [mockTimeRemaining, setMockTimeRemaining] = useState<number>(0);

  // Sync tab if URL changes
  useEffect(() => {
    if (location.pathname.includes('/exam-prep/pyqs')) {
      setActiveTab('pyq');
    }
  }, [location.pathname]);

  // Live Countdown Timer for Active Mock Test
  useEffect(() => {
    if (!activeMockTest || mockSubmitted) return;

    if (mockTimeRemaining <= 0) {
      setMockSubmitted(true);
      return;
    }

    const intervalId = setInterval(() => {
      setMockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setMockSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeMockTest, mockSubmitted, mockTimeRemaining]);

  const formatMMSS = (totalSeconds: number): string => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch backend questions (gracefully falls back to static catalogue)
  const { data: _apiQuestions } = useQuery({
    queryKey: ['important-questions-fetch'],
    queryFn: () => getImportantQuestions(),
  });

  // Handle Tab Change
  const handleTabChange = (tab: 'all' | 'mcq' | 'short' | 'long' | 'pyq' | 'mock-tests') => {
    setActiveTab(tab);
    // When switching to MCQ or Mock Tests, clear incompatible marks filter
    if (tab === 'mcq' || tab === 'mock-tests') {
      setSelectedMarks('all');
    }
    const newParams = new URLSearchParams(searchParams);
    if (tab !== 'all') {
      newParams.set('tab', tab);
    } else {
      newParams.delete('tab');
    }
    if (tab === 'mcq' || tab === 'mock-tests') {
      newParams.delete('marks');
    }
    setSearchParams(newParams, { replace: true });
  };

  // Handle Search Change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams, { replace: true });
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedDifficulty('all');
    setSelectedMarks('all');
    setSearchParams({});
  };

  // MCQ Option Select
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submittedMcqs[questionId]) return; // locked after submission
    setMcqAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // MCQ Submit Answer
  const handleSubmitAnswer = (question: MCQQuestion) => {
    const selected = mcqAnswers[question.id];
    if (selected === undefined) return;
    setSubmittedMcqs((prev) => ({ ...prev, [question.id]: true }));
    const isCorrect = selected === question.correctAnswer;
    setMcqScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  // Reset MCQ Practice Score
  const handleResetScore = () => {
    setMcqAnswers({});
    setSubmittedMcqs({});
    setMcqScore({ correct: 0, total: 0 });
  };

  // Toggle Model Answer View
  const toggleModelAnswer = (questionId: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Filter questions based on active tab, search, and dropdown filters
  const filteredQuestions = useMemo(() => {
    return QUESTIONS_CATALOGUE.filter((q) => {
      // Tab filter
      if (activeTab === 'mcq' && q.type !== 'mcq') return false;
      if (activeTab === 'short' && q.type !== 'short') return false;
      if (activeTab === 'long' && q.type !== 'long') return false;
      if (activeTab === 'pyq' && !q.isPYQ) return false;

      // Subject filter
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;

      // Difficulty filter
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;

      // Marks filter (for short / long questions)
      if (selectedMarks !== 'all') {
        const marksNum = parseInt(selectedMarks, 10);
        if ('marks' in q && q.marks !== marksNum) return false;
        if (!('marks' in q)) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesSubject = q.subjectName.toLowerCase().includes(query);
        const matchesExplanation = 'explanation' in q && q.explanation.toLowerCase().includes(query);
        const matchesExam = q.examDetails && q.examDetails.examName.toLowerCase().includes(query);
        if (!matchesQuestion && !matchesTopic && !matchesSubject && !matchesExplanation && !matchesExam) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, selectedSubject, selectedDifficulty, selectedMarks, searchQuery]);

  // Mock Test Questions
  const mockQuestions: MCQQuestion[] = useMemo(() => {
    if (!activeMockTest) return [];
    return activeMockTest.questionIds
      .map((id) => QUESTIONS_CATALOGUE.find((q) => q.id === id))
      .filter((q): q is MCQQuestion => !!q && q.type === 'mcq');
  }, [activeMockTest]);

  // Mock Test Score
  const mockScore = useMemo(() => {
    let correct = 0;
    mockQuestions.forEach((q, idx) => {
      if (mockUserAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  }, [mockQuestions, mockUserAnswers]);

  const handleStartMockTest = (test: MockTestMeta) => {
    setActiveMockTest(test);
    setMockCurrentIndex(0);
    setMockUserAnswers({});
    setMockSubmitted(false);
    setMockTimeRemaining(test.durationMinutes * 60);
  };

  const handleEndMockTest = () => {
    setActiveMockTest(null);
    setMockCurrentIndex(0);
    setMockUserAnswers({});
    setMockSubmitted(false);
    setMockTimeRemaining(0);
  };

  const handleSubmitMockTest = () => {
    if (mockSubmitted) return;
    setMockSubmitted(true);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      <Breadcrumb
        items={[
          { label: 'Home', url: '/' },
          { label: 'Exam Prep', url: '/exam-prep/important-questions' },
          { label: activeTab === 'pyq' ? 'Previous Year Questions (PYQs)' : 'Questions Bank' },
        ]}
      />

      {/* ══ HEADER ═════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full border border-secondary/20 mb-2">
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            Academic Practice &amp; Exam Preparation
          </div>
          <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
            Political Science Question Bank
          </h1>
          <p className="font-body-lg text-base text-on-surface-variant max-w-3xl mt-2">
            Filterable practice questions across MCQs, Short Answers (2–5 marks), Long Answers (10–15 marks), authentic PYQs, and topic-wise mock tests.
          </p>
        </div>

        {/* Score tracker pill if MCQs attempted */}
        {mcqScore.total > 0 && (
          <div className="bg-surface-container-low border border-secondary/30 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-secondary tracking-wider">
                Practice Session
              </div>
              <div className="font-headline-sm text-xl font-bold text-on-surface">
                Score: {mcqScore.correct} / {mcqScore.total}
                <span className="text-xs font-normal text-on-surface-variant ml-2">
                  ({Math.round((mcqScore.correct / mcqScore.total) * 100)}%)
                </span>
              </div>
            </div>
            <button
              onClick={handleResetScore}
              className="text-xs text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 border border-outline-variant px-2.5 py-1.5 rounded-lg"
              title="Reset practice score"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset
            </button>
          </div>
        )}
      </div>

      {/* ══ CATEGORY TABS ══════════════════════════════════════════════════ */}
      <div className="bg-surface border border-outline-variant rounded-2xl p-2 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 'all', label: 'All Questions', icon: 'apps' },
            { id: 'mcq', label: 'MCQs (Practice)', icon: 'check_circle' },
            { id: 'short', label: 'Short Answer (2–5 Marks)', icon: 'article' },
            { id: 'long', label: 'Long Answer (10–15 Marks)', icon: 'menu_book' },
            { id: 'pyq', label: 'Previous Year (PYQs)', icon: 'verified' },
            { id: 'mock-tests', label: 'Topic Mock Tests', icon: 'timer' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ MOCK TESTS VIEW ════════════════════════════════════════════════ */}
      {activeTab === 'mock-tests' ? (
        activeMockTest ? (
          /* Active Mock Test Runner */
          <div className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant pb-4 flex-wrap gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  {activeMockTest.badge} &bull; {activeMockTest.subjectName}
                </span>
                <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
                  {activeMockTest.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {!mockSubmitted && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono transition-colors shadow-sm ${
                      mockTimeRemaining <= 60
                        ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                        : 'bg-surface-container text-primary border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
                    <span>Time Left: {formatMMSS(mockTimeRemaining)}</span>
                  </div>
                )}
                <button
                  onClick={handleEndMockTest}
                  className="text-xs font-semibold px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant"
                >
                  Exit Mock Test
                </button>
              </div>
            </div>

            {/* Test Runner or Result Card */}
            {!mockSubmitted ? (
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>
                    Question {mockCurrentIndex + 1} of {mockQuestions.length}
                  </span>
                  <span>
                    {Object.keys(mockUserAnswers).length} answered
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full transition-all duration-300"
                    style={{
                      width: `${((mockCurrentIndex + 1) / mockQuestions.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question item */}
                {mockQuestions[mockCurrentIndex] && (
                  <div className="space-y-4">
                    <p className="font-body-lg text-lg text-on-surface font-medium leading-relaxed">
                      {mockCurrentIndex + 1}. {mockQuestions[mockCurrentIndex].question}
                    </p>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {mockQuestions[mockCurrentIndex].options.map((opt, optIdx) => {
                        const isSelected = mockUserAnswers[mockCurrentIndex] === optIdx;
                        const optionLabels = ['A', 'B', 'C', 'D'];
                        return (
                          <button
                            key={optIdx}
                            onClick={() =>
                              setMockUserAnswers((prev) => ({
                                ...prev,
                                [mockCurrentIndex]: optIdx,
                              }))
                            }
                            className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                              isSelected
                                ? 'bg-secondary/10 border-secondary text-on-surface font-semibold'
                                : 'bg-surface-container-lowest border-outline-variant hover:border-secondary/40 text-on-surface-variant'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                isSelected ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface'
                              }`}
                            >
                              {optionLabels[optIdx]}
                            </span>
                            <span className="text-sm pt-0.5">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Navigation & Submit buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                  <button
                    disabled={mockCurrentIndex === 0}
                    onClick={() => setMockCurrentIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-surface-container"
                  >
                    Previous
                  </button>

                  {mockCurrentIndex < mockQuestions.length - 1 ? (
                    <button
                      onClick={() =>
                        setMockCurrentIndex((prev) => Math.min(mockQuestions.length - 1, prev + 1))
                      }
                      className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-secondary transition-colors"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitMockTest}
                      disabled={mockSubmitted}
                      className="px-6 py-2 bg-secondary text-white rounded-xl text-xs font-semibold hover:opacity-90 shadow-md disabled:opacity-50"
                    >
                      Submit Mock Test
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Scorecard & Detailed Review */
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 text-center space-y-2 shadow-lg">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                      Mock Test Complete
                    </span>
                    {mockTimeRemaining === 0 && (
                      <span className="text-[11px] bg-red-500/40 text-amber-200 px-2.5 py-0.5 rounded-full font-semibold border border-amber-300/30">
                        Time Expired &bull; Auto-Submitted
                      </span>
                    )}
                  </div>
                  <div className="text-4xl font-headline-md font-bold">
                    {mockScore} / {mockQuestions.length}
                  </div>
                  <p className="text-white/80 text-sm">
                    Accuracy: {Math.round((mockScore / mockQuestions.length) * 100)}% &bull;{' '}
                    {mockScore >= mockQuestions.length * 0.75
                      ? 'Outstanding performance!'
                      : 'Good effort! Review the explanations below to strengthen weak areas.'}
                  </p>
                  <div className="pt-3 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setMockUserAnswers({});
                        setMockCurrentIndex(0);
                        setMockSubmitted(false);
                        if (activeMockTest) {
                          setMockTimeRemaining(activeMockTest.durationMinutes * 60);
                        }
                      }}
                      className="px-4 py-2 bg-amber-400 text-primary rounded-xl text-xs font-bold hover:bg-amber-300 transition-colors"
                    >
                      Retake Test
                    </button>
                    <button
                      onClick={handleEndMockTest}
                      className="px-4 py-2 bg-white/20 text-white rounded-xl text-xs font-semibold hover:bg-white/30"
                    >
                      Choose Another Test
                    </button>
                  </div>
                </div>

                {/* Review all questions */}
                <div className="space-y-4">
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                    Detailed Question Review &amp; Explanations
                  </h3>
                  {mockQuestions.map((q, idx) => {
                    const userChoice = mockUserAnswers[idx];
                    const isCorrect = userChoice === q.correctAnswer;
                    const optionLabels = ['A', 'B', 'C', 'D'];
                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-2xl border ${
                          isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                        } space-y-3`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                            }`}
                          >
                            {isCorrect ? '✓' : '✗'}
                          </span>
                          <span className="text-xs font-bold text-on-surface">
                            Question {idx + 1}
                          </span>
                        </div>
                        <p className="font-semibold text-sm text-on-surface">{q.question}</p>
                        <div className="text-xs space-y-1">
                          <div className="text-on-surface-variant">
                            Your answer:{' '}
                            <span className="font-bold text-on-surface">
                              {userChoice !== undefined
                                ? `${optionLabels[userChoice]}. ${q.options[userChoice]}`
                                : 'Not Attempted'}
                            </span>
                          </div>
                          <div className="text-emerald-700 font-bold">
                            Correct answer: {optionLabels[q.correctAnswer]}. {q.options[q.correctAnswer]}
                          </div>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-outline-variant/60 text-xs text-on-surface-variant leading-relaxed">
                          <strong className="text-primary block mb-1">Explanation:</strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mock Test Selection Catalog */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h2 className="font-headline-sm text-xl md:text-2xl font-bold text-on-surface">
                Topic-Wise Mock Test Drills
              </h2>
              <span className="text-xs text-on-surface-variant">
                Timed practice with immediate scores &amp; answer keys
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOPIC_MOCK_TESTS.map((test) => (
                <div
                  key={test.id}
                  className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 bg-secondary/10 text-secondary rounded-full">
                        {test.badge}
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {test.durationMinutes} mins
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-lg font-bold text-on-surface leading-snug">
                      {test.title}
                    </h3>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-outline-variant/60 flex items-center justify-between">
                    <span className="text-xs text-outline font-medium">
                      {test.questionIds.length} MCQs
                    </span>
                    <button
                      onClick={() => handleStartMockTest(test)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-secondary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      Start Mock Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* ══ MAIN QUESTIONS DIRECTORY VIEW ════════════════════════════════ */
        <div className="space-y-6">
          {/* Search & Filters Bar */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search questions by topic, keyword, thinker, or syllabus unit..."
                className="w-full pl-10 pr-10 h-[46px] bg-surface-container-low border border-outline-variant rounded-xl text-sm font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                activeTab === 'mcq' ? 'md:grid-cols-3' : 'md:grid-cols-4'
              } gap-3`}
            >
              {/* Subject Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Subject Category
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full h-[40px] px-3 bg-surface border border-outline-variant rounded-xl text-xs font-body-md text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="all">All 8 Subject Categories</option>
                  {SUBJECT_CATEGORIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full h-[40px] px-3 bg-surface border border-outline-variant rounded-xl text-xs font-body-md text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Marks Filter (Short / Long) - only visible on relevant descriptive question tabs */}
              {activeTab !== 'mcq' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Marks Weightage
                  </label>
                  <select
                    value={selectedMarks}
                    onChange={(e) => setSelectedMarks(e.target.value)}
                    className="w-full h-[40px] px-3 bg-surface border border-outline-variant rounded-xl text-xs font-body-md text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="all">All Marks</option>
                    <option value="2">2 Marks (Short)</option>
                    <option value="4">4 Marks (Short)</option>
                    <option value="5">5 Marks (Short)</option>
                    <option value="10">10 Marks (Long)</option>
                    <option value="12">12 Marks (Long)</option>
                    <option value="15">15 Marks (Long)</option>
                  </select>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full h-[40px] px-4 border border-outline-variant text-on-surface-variant rounded-xl text-xs font-semibold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count Header */}
          <div className="flex items-center justify-between border-b border-outline-variant pb-2">
            <h2 className="font-headline-sm text-xl font-bold text-on-surface">
              {filteredQuestions.length} Question{filteredQuestions.length !== 1 ? 's' : ''} Found
            </h2>
            <span className="text-xs text-on-surface-variant">
              Academic Curated Archive &bull; Polisphere
            </span>
          </div>

          {/* Empty State */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-surface border border-outline-variant rounded-2xl p-12 text-center space-y-3">
              <span className="material-symbols-outlined text-[48px] text-outline block">
                help_outline
              </span>
              <p className="font-headline-sm text-lg font-bold text-on-surface">
                No questions match your current filter selection
              </p>
              <p className="font-body-md text-xs text-on-surface-variant max-w-md mx-auto">
                Try searching for broader keywords or reset the filters to browse the complete question bank.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 bg-secondary text-white text-xs font-semibold rounded-xl hover:opacity-90"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Questions Cards List */
            <div className="space-y-5">
              {filteredQuestions.map((q, qIndex) => {
                const isExpanded = !!expandedAnswers[q.id];

                return (
                  <article
                    key={q.id}
                    className="bg-surface border border-outline-variant rounded-2xl p-5 md:p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.04)] hover:border-secondary/40 transition-colors space-y-4"
                  >
                    {/* Card Meta Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Question number */}
                        <span className="px-2.5 py-1 bg-primary text-white font-bold rounded-lg">
                          Q{qIndex + 1}
                        </span>

                        {/* Question Type Badge */}
                        <span
                          className={`px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider text-[11px] ${
                            q.type === 'mcq'
                              ? 'bg-blue-100 text-blue-800'
                              : q.type === 'short'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {q.type === 'mcq'
                            ? 'MCQ'
                            : q.type === 'short'
                            ? `Short (${(q as ShortAnswerQuestion).marks} Marks)`
                            : `Long (${(q as LongAnswerQuestion).marks} Marks)`}
                        </span>

                        {/* Subject Badge */}
                        <span className="px-2.5 py-1 bg-surface-container text-on-surface font-medium rounded-lg border border-outline-variant/60">
                          {q.subjectName}
                        </span>

                        {/* Topic */}
                        <span className="px-2.5 py-1 bg-surface-container-low text-secondary font-medium rounded-lg">
                          Topic: {q.topic}
                        </span>
                      </div>

                      {/* Right Meta: Difficulty & Verified PYQ Badge */}
                      <div className="flex items-center gap-2">
                        {q.isPYQ && q.examDetails && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300">
                            <span className="material-symbols-outlined text-[15px]">verified</span>
                            {q.examDetails.examName} {q.examDetails.year}
                          </span>
                        )}

                        <span
                          className={`px-2.5 py-1 rounded-lg capitalize font-semibold text-[11px] ${
                            q.difficulty === 'advanced'
                              ? 'bg-red-100 text-red-800'
                              : q.difficulty === 'intermediate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {q.difficulty} Level
                        </span>
                      </div>
                    </div>

                    {/* Question Text */}
                    <h3 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface leading-snug">
                      {q.question}
                    </h3>

                    {/* ── MCQ Option Selector ── */}
                    {q.type === 'mcq' && (
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const selectedOption = mcqAnswers[q.id];
                            const isSubmitted = submittedMcqs[q.id];
                            const isSelected = selectedOption === optIdx;
                            const isCorrectOption = q.correctAnswer === optIdx;
                            const optionLabels = ['A', 'B', 'C', 'D'];

                            let buttonStyle = 'bg-surface-container-lowest border-outline-variant hover:border-secondary/40 text-on-surface-variant';
                            if (isSubmitted) {
                              if (isCorrectOption) {
                                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                              } else if (isSelected && !isCorrectOption) {
                                buttonStyle = 'bg-red-50 border-red-500 text-red-900 font-semibold';
                              }
                            } else if (isSelected) {
                              buttonStyle = 'bg-secondary/10 border-secondary text-on-surface font-semibold';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleSelectOption(q.id, optIdx)}
                                className={`text-left p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${buttonStyle}`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                    isSubmitted && isCorrectOption
                                      ? 'bg-emerald-600 text-white'
                                      : isSubmitted && isSelected && !isCorrectOption
                                      ? 'bg-red-600 text-white'
                                      : isSelected
                                      ? 'bg-secondary text-white'
                                      : 'bg-surface-container text-on-surface'
                                  }`}
                                >
                                  {optionLabels[optIdx]}
                                </span>
                                <span className="text-sm pt-0.5">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Submit / Status Button */}
                        <div className="flex items-center justify-between pt-2">
                          {!submittedMcqs[q.id] ? (
                            <button
                              disabled={mcqAnswers[q.id] === undefined}
                              onClick={() => handleSubmitAnswer(q)}
                              className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl disabled:opacity-40 hover:bg-secondary transition-colors"
                            >
                              Check Answer
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              {mcqAnswers[q.id] === q.correctAnswer ? (
                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                  Correct Answer!
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                                  Incorrect. Option {['A', 'B', 'C', 'D'][q.correctAnswer]} is correct.
                                </span>
                              )}
                            </div>
                          )}

                          {q.noteSlug && (
                            <Link
                              to={`/notes/${q.noteSlug}`}
                              className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                            >
                              Read Reference Note
                              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                            </Link>
                          )}
                        </div>

                        {/* Explanation Card (revealed after submission) */}
                        {submittedMcqs[q.id] && (
                          <div className="bg-surface-container-low border-l-4 border-secondary p-4 rounded-r-xl space-y-1.5 animate-fade-in">
                            <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                              Explanation &amp; Conceptual Context:
                            </span>
                            <p className="font-body-md text-xs sm:text-sm text-on-surface leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Short Answer Model Section ── */}
                    {q.type === 'short' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
                          <span className="font-medium">
                            Expected Length: {(q as ShortAnswerQuestion).expectedWordCount}
                          </span>
                          <button
                            onClick={() => toggleModelAnswer(q.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                            {isExpanded ? 'Hide Model Answer' : 'View Model Answer'}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="bg-surface-container-low border border-outline-variant/70 rounded-xl p-5 space-y-3 animate-fade-in">
                            <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                              Model Answer ({(q as ShortAnswerQuestion).marks} Marks):
                            </div>
                            <p className="font-body-md text-sm text-on-surface leading-relaxed">
                              {(q as ShortAnswerQuestion).modelAnswer.summary}
                            </p>
                            <ul className="space-y-1.5 pl-1">
                              {(q as ShortAnswerQuestion).modelAnswer.keyPoints.map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-on-surface leading-relaxed">
                                  <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">
                                    arrow_right
                                  </span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                            {(q as ShortAnswerQuestion).modelAnswer.examTip && (
                              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                                <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">
                                  tips_and_updates
                                </span>
                                <div>
                                  <strong>Exam Tip:</strong> {(q as ShortAnswerQuestion).modelAnswer.examTip}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Long Answer Model Section ── */}
                    {q.type === 'long' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
                          <span className="font-medium">
                            Expected Length: {(q as LongAnswerQuestion).expectedWordCount}
                          </span>
                          <button
                            onClick={() => toggleModelAnswer(q.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                            {isExpanded ? 'Hide Essay Answer' : 'View Structured Essay Answer'}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="bg-surface-container-low border border-outline-variant/70 rounded-2xl p-5 md:p-6 space-y-4 animate-fade-in">
                            <div className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[18px]">menu_book</span>
                              Comprehensive Model Answer ({(q as LongAnswerQuestion).marks} Marks):
                            </div>

                            {/* Introduction */}
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                                Introduction &amp; Theoretical Context:
                              </h4>
                              <p className="font-body-md text-sm text-on-surface leading-relaxed">
                                {(q as LongAnswerQuestion).modelAnswer.introduction}
                              </p>
                            </div>

                            {/* Sections with Headings & Points */}
                            <div className="space-y-3 pt-1">
                              {(q as LongAnswerQuestion).modelAnswer.sections.map((sec, sIdx) => (
                                <div key={sIdx} className="space-y-1.5">
                                  <h4 className="text-xs sm:text-sm font-bold text-on-surface">
                                    {sec.heading}
                                  </h4>
                                  <ul className="space-y-1 pl-1">
                                    {sec.points.map((pt, pIdx) => (
                                      <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                                        <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">
                                          check_circle
                                        </span>
                                        <span>{pt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>

                            {/* Critical Evaluation */}
                            <div className="bg-surface p-4 rounded-xl border border-outline-variant/60 space-y-1">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">balance</span>
                                Scholarly Critique &amp; Counterarguments:
                              </h4>
                              <p className="font-body-md text-xs sm:text-sm text-on-surface leading-relaxed">
                                {(q as LongAnswerQuestion).modelAnswer.criticalEvaluation}
                              </p>
                            </div>

                            {/* Conclusion */}
                            <div className="space-y-1 pt-1">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                                Conclusion &amp; Contemporary Significance:
                              </h4>
                              <p className="font-body-md text-sm text-on-surface leading-relaxed">
                                {(q as LongAnswerQuestion).modelAnswer.conclusion}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══ SUBJECT EXPLORATION FOOTER ═══════════════════════════════════ */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 space-y-4">
        <h3 className="font-headline-sm text-lg font-bold text-on-surface">
          Explore Questions by Subject Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUBJECT_CATEGORIES.map((subj) => (
            <button
              key={subj.id}
              onClick={() => {
                setSelectedSubject(subj.id);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedSubject === subj.id
                  ? 'border-secondary bg-secondary/10'
                  : 'border-outline-variant hover:border-secondary/50 bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-secondary mb-1">
                {subj.icon}
              </span>
              <span className="text-xs font-semibold text-on-surface leading-tight">
                {subj.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
