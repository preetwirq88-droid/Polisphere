import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchBarModal } from '../SearchBar/SearchBarModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, logout } = useAdminAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) =>
    isActive(path)
      ? "text-secondary font-bold border-b-2 border-secondary font-label-md text-label-md pb-[2px]"
      : "text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md";

  return (
    <>
      <nav className="bg-surface border-b border-outline-variant sticky top-0 z-40 w-full">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center">
          {/* Brand Logo */}
          <Link to="/" className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary flex items-center gap-2">
            POLISPHERE
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-gutter">
            <Link to="/" class={navLinkClass('/')}>Home</Link>
            <Link to="/subjects" class={navLinkClass('/subjects')}>Subjects</Link>
            <Link to="/thinkers" class={navLinkClass('/thinkers')}>Thinkers</Link>
            <Link to="/exam-prep/important-questions" class={navLinkClass('/exam-prep/important-questions')}>Important Questions</Link>
            <Link to="/exam-prep/pyqs" class={navLinkClass('/exam-prep/pyqs')}>PYQs</Link>
            <Link to="/resources" class={navLinkClass('/resources')}>Resources</Link>
          </div>

          {/* Actions & Search */}
          <div className="flex items-center space-x-sm">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-on-surface-variant hover:text-secondary transition-all p-2 rounded-full hover:bg-surface-container flex items-center"
              title="Search POLISPHERE"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center h-[40px] px-3 bg-secondary text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity"
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
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center justify-center h-[44px] px-4 border border-secondary text-secondary font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && <SearchBarModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};
