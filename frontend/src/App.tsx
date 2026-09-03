import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { SubjectListing } from './pages/SubjectListing/SubjectListing';
import { SubjectDetail } from './pages/SubjectDetail/SubjectDetail';
import { NoteDetail } from './pages/NoteDetail/NoteDetail';
import { ThinkerListing } from './pages/ThinkerListing/ThinkerListing';
import { ThinkerDetail } from './pages/ThinkerDetail/ThinkerDetail';
import { ImportantQuestions } from './pages/ImportantQuestions/ImportantQuestions';
import { ComingSoon } from './pages/ComingSoon/ComingSoon';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRoute } from './routes/AdminRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-background text-on-background">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/subjects" element={<SubjectListing />} />
                <Route path="/subjects/:slug" element={<SubjectDetail />} />
                <Route path="/notes/:slug" element={<NoteDetail />} />
                <Route path="/thinkers" element={<ThinkerListing />} />
                <Route path="/thinkers/:slug" element={<ThinkerDetail />} />
                <Route path="/exam-prep/important-questions" element={<ImportantQuestions />} />
                <Route path="/exam-prep/pyqs" element={<ComingSoon />} />
                <Route path="/resources" element={<ComingSoon />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
