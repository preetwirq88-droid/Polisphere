import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetSubjects,
  adminCreateSubject,
  adminDeleteSubject,
} from '../../api/subjects';
import {
  adminGetNotes,
  adminCreateNote,
  adminUpdateNote,
  adminDeleteNote,
} from '../../api/notes';
import {
  adminGetThinkers,
  adminCreateThinker,
  adminDeleteThinker,
} from '../../api/thinkers';
import {
  adminGetImportantQuestions,
  adminCreateImportantQuestion,
  adminDeleteImportantQuestion,
} from '../../api/importantQuestions';

type Tab = 'subjects' | 'notes' | 'thinkers' | 'questions';

export const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('notes');

  // Form states for Modal / Adding
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    slug: '',
    subject_id: '',
    unit_number: 1,
    difficulty: 'introductory' as 'introductory' | 'advanced',
    status: 'published' as 'draft' | 'in_progress' | 'published',
    reading_time_minutes: 10,
    sections: [{ anchor: 'introduction', heading: 'Introduction', body: 'Write analysis content here...' }],
  });

  const [showSubjModal, setShowSubjModal] = useState(false);
  const [subjForm, setSubjForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'school',
  });

  const [showThinkerModal, setShowThinkerModal] = useState(false);
  const [thinkerForm, setThinkerForm] = useState({
    name: '',
    slug: '',
    portrait_url: '/assets/rousseau.png',
    contribution: '',
    bio: '',
    key_works: ['Primary Text (Year)'],
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    subject_id: '',
    unit_number: 1,
    topic: 'Social Contract Theory',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    question: '',
  });

  // Queries
  const { data: subjects = [] } = useQuery({ queryKey: ['admin-subjects'], queryFn: adminGetSubjects });
  const { data: notes = [] } = useQuery({ queryKey: ['admin-notes'], queryFn: adminGetNotes });
  const { data: thinkers = [] } = useQuery({ queryKey: ['admin-thinkers'], queryFn: adminGetThinkers });
  const { data: questions = [] } = useQuery({ queryKey: ['admin-questions'], queryFn: adminGetImportantQuestions });

  // Mutations
  const createNoteMut = useMutation({
    mutationFn: adminCreateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
      setShowNoteModal(false);
    },
  });

  const updateNoteStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'in_progress' | 'published' }) =>
      adminUpdateNote(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-notes'] }),
  });

  const deleteNoteMut = useMutation({
    mutationFn: adminDeleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-notes'] }),
  });

  const createSubjMut = useMutation({
    mutationFn: adminCreateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      setShowSubjModal(false);
    },
  });

  const deleteSubjMut = useMutation({
    mutationFn: adminDeleteSubject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });

  const createThinkerMut = useMutation({
    mutationFn: adminCreateThinker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-thinkers'] });
      setShowThinkerModal(false);
    },
  });

  const deleteThinkerMut = useMutation({
    mutationFn: adminDeleteThinker,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-thinkers'] }),
  });

  const createQuestionMut = useMutation({
    mutationFn: adminCreateImportantQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      setShowQuestionModal(false);
    },
  });

  const deleteQuestionMut = useMutation({
    mutationFn: adminDeleteImportantQuestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-questions'] }),
  });

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">
      {/* Admin Top Header */}
      <div className="bg-primary text-white p-md md:p-xl rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
        <div>
          <span className="bg-secondary-container text-white px-3 py-1 rounded text-caption font-label-md uppercase tracking-wider">
            Single Admin Control Panel
          </span>
          <h1 className="font-headline-md text-headline-md text-white mt-1">
            POLISPHERE Content Management
          </h1>
          <p className="font-body-md text-surface-variant text-sm mt-1">
            Logged in as: <strong className="text-white">{admin?.email}</strong>
          </p>
        </div>
        <button
          onClick={logout}
          className="h-[40px] px-md border border-white/40 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
        >
          Logout Admin
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-outline-variant space-x-gutter overflow-x-auto">
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 font-label-md text-label-md flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'notes' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">article</span>
          Manage Notes ({notes.length})
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`py-3 font-label-md text-label-md flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'subjects' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">school</span>
          Manage Subjects ({subjects.length})
        </button>

        <button
          onClick={() => setActiveTab('thinkers')}
          className={`py-3 font-label-md text-label-md flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'thinkers' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
          Manage Thinkers ({thinkers.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`py-3 font-label-md text-label-md flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'questions' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">quiz</span>
          Important Questions ({questions.length})
        </button>
      </div>

      {/* Tab 1: Manage Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Academic Notes Repository</h2>
            <button
              onClick={() => setShowNoteModal(true)}
              className="h-[44px] px-md bg-secondary text-white font-label-md rounded-lg hover:bg-secondaryContainer transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span> Create New Note
            </button>
          </div>

          <div className="overflow-x-auto border border-outline-variant rounded-xl bg-surface">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-md text-caption uppercase text-primary">
                  <th className="p-3">Title & Slug</th>
                  <th className="p-3">Subject / Unit</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Public Status Toggle</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-body-md text-sm text-on-surface">
                {notes.map((n) => (
                  <tr key={n.id} className="hover:bg-surface-container/30">
                    <td className="p-3 font-medium">
                      {n.title}
                      <span className="block text-caption text-outline font-mono">{n.slug}</span>
                    </td>
                    <td className="p-3">
                      {n.subject_name || 'Subject'} &bull; Unit {n.unit_number}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-caption font-semibold capitalize bg-surface-container-high text-primary">
                        {n.difficulty}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={n.status}
                        onChange={(e) =>
                          updateNoteStatusMut.mutate({
                            id: n.id,
                            status: e.target.value as any,
                          })
                        }
                        className="bg-surface-container-lowest border border-outline-variant rounded p-1 text-xs font-semibold text-on-surface focus:outline-none"
                      >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="in_progress">In Progress Badge</option>
                        <option value="published">Published (Live)</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteNoteMut.mutate(n.id)}
                        className="text-error hover:underline text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Subjects */}
      {activeTab === 'subjects' && (
        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Academic Subjects</h2>
            <button
              onClick={() => setShowSubjModal(true)}
              className="h-[44px] px-md bg-secondary text-white font-label-md rounded-lg hover:bg-secondaryContainer transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span> Create Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {subjects.map((s) => (
              <div key={s.id} className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm space-y-sm">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[24px] text-secondary">{s.icon || 'school'}</span>
                  <button
                    onClick={() => deleteSubjMut.mutate(s.id)}
                    className="text-error hover:underline text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">{s.name}</h3>
                <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">{s.description}</p>
                <div className="text-caption font-caption text-outline">
                  {s.units?.length || 0} Modules configured
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Manage Thinkers */}
      {activeTab === 'thinkers' && (
        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Political Thinkers Directory</h2>
            <button
              onClick={() => setShowThinkerModal(true)}
              className="h-[44px] px-md bg-secondary text-white font-label-md rounded-lg hover:bg-secondaryContainer transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span> Create Thinker Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {thinkers.map((t) => (
              <div key={t.id} className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex items-center gap-3">
                <img src={t.portrait_url} alt={t.name} className="w-14 h-14 rounded-lg object-cover bg-surface-container" />
                <div className="flex-grow">
                  <h4 className="font-label-md text-on-surface font-semibold">{t.name}</h4>
                  <span className="text-caption text-secondary block">{t.contribution}</span>
                </div>
                <button
                  onClick={() => deleteThinkerMut.mutate(t.id)}
                  className="text-error text-xs font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Manage Important Questions */}
      {activeTab === 'questions' && (
        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Important Question Bank</h2>
            <button
              onClick={() => {
                if (subjects.length > 0 && !questionForm.subject_id) {
                  setQuestionForm({ ...questionForm, subject_id: subjects[0].id });
                }
                setShowQuestionModal(true);
              }}
              className="h-[44px] px-md bg-secondary text-white font-label-md rounded-lg hover:bg-secondaryContainer transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span> Add Question
            </button>
          </div>

          <div className="space-y-sm">
            {questions.map((q) => (
              <div key={q.id} className="bg-surface border border-outline-variant rounded-xl p-md flex items-center justify-between gap-md">
                <div>
                  <div className="flex items-center gap-2 text-caption text-on-surface-variant mb-1">
                    <span className="font-bold text-primary">{q.subject_name}</span> &bull; Unit {q.unit_number} &bull; Topic: {q.topic}
                  </div>
                  <p className="font-headline-sm text-base text-on-surface font-semibold">"{q.question}"</p>
                </div>
                <button
                  onClick={() => deleteQuestionMut.mutate(q.id)}
                  className="text-error text-xs font-semibold hover:underline whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Note */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-xl p-xl max-w-xl w-full space-y-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Create New Note</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createNoteMut.mutate({
                  ...noteForm,
                  subject_id: noteForm.subject_id || (subjects[0]?.id || ''),
                });
              }}
              className="space-y-sm"
            >
              <div>
                <label className="text-caption font-semibold text-on-surface block">Title</label>
                <input
                  type="text"
                  required
                  value={noteForm.title}
                  onChange={(e) =>
                    setNoteForm({
                      ...noteForm,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  placeholder="e.g. Hobbes: Leviathan & Social Contract"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">URL Slug</label>
                <input
                  type="text"
                  required
                  value={noteForm.slug}
                  onChange={(e) => setNoteForm({ ...noteForm, slug: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-caption font-semibold text-on-surface block">Subject</label>
                  <select
                    value={noteForm.subject_id || (subjects[0]?.id || '')}
                    onChange={(e) => setNoteForm({ ...noteForm, subject_id: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-caption font-semibold text-on-surface block">Unit Number</label>
                  <input
                    type="number"
                    value={noteForm.unit_number}
                    onChange={(e) => setNoteForm({ ...noteForm, unit_number: parseInt(e.target.value) || 1 })}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-caption font-semibold text-on-surface block">Difficulty</label>
                  <select
                    value={noteForm.difficulty}
                    onChange={(e) => setNoteForm({ ...noteForm, difficulty: e.target.value as any })}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  >
                    <option value="introductory">Introductory</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-caption font-semibold text-on-surface block">Status</label>
                  <select
                    value={noteForm.status}
                    onChange={(e) => setNoteForm({ ...noteForm, status: e.target.value as any })}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  >
                    <option value="published">Published</option>
                    <option value="in_progress">In Progress</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">Section Body</label>
                <textarea
                  rows={4}
                  value={noteForm.sections[0].body}
                  onChange={(e) =>
                    setNoteForm({
                      ...noteForm,
                      sections: [{ ...noteForm.sections[0], body: e.target.value }],
                    })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-sm font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded text-sm font-label-md hover:bg-primary-container"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Subject */}
      {showSubjModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-xl p-xl max-w-md w-full space-y-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Create New Subject</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createSubjMut.mutate({
                  ...subjForm,
                  units: [
                    { unit_number: 1, title: 'Foundations & Concepts' },
                    { unit_number: 2, title: 'Core Theories' },
                  ],
                });
              }}
              className="space-y-sm"
            >
              <div>
                <label className="text-caption font-semibold text-on-surface block">Subject Name</label>
                <input
                  type="text"
                  required
                  value={subjForm.name}
                  onChange={(e) =>
                    setSubjForm({
                      ...subjForm,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">URL Slug</label>
                <input
                  type="text"
                  required
                  value={subjForm.slug}
                  onChange={(e) => setSubjForm({ ...subjForm, slug: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={subjForm.description}
                  onChange={(e) => setSubjForm({ ...subjForm, description: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-sm font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded text-sm font-label-md hover:bg-primary-container"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Question */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-xl p-xl max-w-md w-full space-y-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Add Important Question</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createQuestionMut.mutate({
                  ...questionForm,
                  subject_id: questionForm.subject_id || (subjects[0]?.id || ''),
                });
              }}
              className="space-y-sm"
            >
              <div>
                <label className="text-caption font-semibold text-on-surface block">Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  placeholder="e.g. Critically analyze Rousseau's concept of General Will..."
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">Topic</label>
                <input
                  type="text"
                  required
                  value={questionForm.topic}
                  onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-caption font-semibold text-on-surface block">Subject</label>
                  <select
                    value={questionForm.subject_id || (subjects[0]?.id || '')}
                    onChange={(e) => setQuestionForm({ ...questionForm, subject_id: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-caption font-semibold text-on-surface block">Unit</label>
                  <input
                    type="number"
                    value={questionForm.unit_number}
                    onChange={(e) => setQuestionForm({ ...questionForm, unit_number: parseInt(e.target.value) || 1 })}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-sm font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded text-sm font-label-md hover:bg-primary-container"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Create Thinker */}
      {showThinkerModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-xl p-xl max-w-md w-full space-y-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Create Thinker Profile</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createThinkerMut.mutate(thinkerForm);
              }}
              className="space-y-sm"
            >
              <div>
                <label className="text-caption font-semibold text-on-surface block">Full Name</label>
                <input
                  type="text"
                  required
                  value={thinkerForm.name}
                  onChange={(e) =>
                    setThinkerForm({
                      ...thinkerForm,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  placeholder="e.g. John Locke"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">URL Slug</label>
                <input
                  type="text"
                  required
                  value={thinkerForm.slug}
                  onChange={(e) => setThinkerForm({ ...thinkerForm, slug: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">Core Contribution / Label</label>
                <input
                  type="text"
                  required
                  value={thinkerForm.contribution}
                  onChange={(e) => setThinkerForm({ ...thinkerForm, contribution: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  placeholder="e.g. Classical Liberalism"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">Biography</label>
                <textarea
                  required
                  rows={4}
                  value={thinkerForm.bio}
                  onChange={(e) => setThinkerForm({ ...thinkerForm, bio: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  placeholder="Brief biographical overview and philosophical significance..."
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">Portrait URL</label>
                <input
                  type="text"
                  value={thinkerForm.portrait_url}
                  onChange={(e) => setThinkerForm({ ...thinkerForm, portrait_url: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm font-mono"
                  placeholder="/assets/thinker-name.png"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-on-surface block">Key Works (comma-separated)</label>
                <input
                  type="text"
                  value={thinkerForm.key_works.join(', ')}
                  onChange={(e) =>
                    setThinkerForm({
                      ...thinkerForm,
                      key_works: e.target.value.split(',').map((w) => w.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-sm"
                  placeholder="Two Treatises of Government (1689), An Essay Concerning Human Understanding (1689)"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowThinkerModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-sm font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded text-sm font-label-md hover:bg-primary-container"
                >
                  Save Thinker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
