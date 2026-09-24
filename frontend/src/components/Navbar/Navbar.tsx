import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchBarModal } from '../SearchBar/SearchBarModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAdminAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) =>
    isActive(path)
      ? 'text-secondary font-bold border-b-2 border-secondary pb-[2px] font-label-md text-label-md'
      : 'text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md';

  const mobileNavLinkClass = (path: string) =>
    isActive(path)
      ? 'block px-4 py-3 text-secondary font-bold bg-surface-container rounded-lg font-label-md text-[15px]'
      : 'block px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors font-label-md text-[15px]';

  return (
    <>
      <nav className="bg-surface/95 backdrop-blur-md border-b border-outline-variant sticky top-0 z-40 w-full shadow-sm">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-3.5 flex justify-between items-center">

          {/* Brand */}
          <Link
            to="/"
            className="font-bold tracking-tight text-primary flex items-center gap-2.5 text-[20px] font-headline-sm"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-white text-[18px]">public</span>
            </div>
            POLISPHERE
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-7">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/subjects" className={navLinkClass('/subjects')}>Subjects</Link>
            <Link to="/thinkers" className={navLinkClass('/thinkers')}>Thinkers</Link>
            <Link to="/exam-prep/important-questions" className={navLinkClass('/exam-prep/important-questions')}>
              Questions
            </Link>
            <Link to="/exam-prep/pyqs" className={navLinkClass('/exam-prep/pyqs')}>PYQs</Link>
            <Link to="/resources" className={navLinkClass('/resources')}>Resources</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-all p-2 rounded-full flex items-center"
              title="Search"
              id="navbar-search-btn"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center h-[38px] px-4 bg-secondary text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity text-[13px]"
                >
                  Admin Portal
                </Link>
                <button
                  onClick={logout}
                  className="text-on-surface-variant hover:text-error transition-colors p-2 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/subjects"
                  id="navbar-explore-btn"
                  className="inline-flex items-center gap-1.5 h-[38px] px-5 bg-primary text-white font-label-md text-label-md rounded-lg hover:bg-primary-container transition-colors text-[13px] font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  Explore
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              id="navbar-mobile-menu-btn"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-outline-variant bg-surface px-margin-mobile py-4 space-y-1 shadow-lg">
            <Link to="/" className={mobileNavLinkClass('/')} onClick={() => setIsMobileOpen(false)}>Home</Link>
            <Link to="/subjects" className={mobileNavLinkClass('/subjects')} onClick={() => setIsMobileOpen(false)}>Subjects</Link>
            <Link to="/thinkers" className={mobileNavLinkClass('/thinkers')} onClick={() => setIsMobileOpen(false)}>Thinkers</Link>
            <Link to="/exam-prep/important-questions" className={mobileNavLinkClass('/exam-prep/important-questions')} onClick={() => setIsMobileOpen(false)}>Important Questions</Link>
            <Link to="/exam-prep/pyqs" className={mobileNavLinkClass('/exam-prep/pyqs')} onClick={() => setIsMobileOpen(false)}>PYQs</Link>
            <Link to="/resources" className={mobileNavLinkClass('/resources')} onClick={() => setIsMobileOpen(false)}>Resources</Link>
            <div className="pt-3 border-t border-outline-variant mt-2">
              {isAuthenticated ? (
                <div className="flex gap-2">
                  <Link to="/admin" className="flex-1 text-center py-2.5 bg-secondary text-white rounded-lg font-label-md text-[14px] font-semibold" onClick={() => setIsMobileOpen(false)}>Admin Portal</Link>
                  <button onClick={() => { logout(); setIsMobileOpen(false); }} className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-lg font-label-md text-[14px]">Logout</button>
                </div>
              ) : (
                <Link to="/subjects" className="block text-center py-2.5 bg-primary text-white rounded-lg font-label-md text-[14px] font-semibold" onClick={() => setIsMobileOpen(false)}>Explore Subjects</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {isSearchOpen && <SearchBarModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};
