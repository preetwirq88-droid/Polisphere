import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@polisphere.app');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-xl bg-surface-container-low">
      <div className="bg-surface border border-outline-variant rounded-xl p-md md:p-xl shadow-xl w-full max-w-md space-y-md">
        <div className="text-center space-y-1">
          <Link to="/" className="font-headline-sm text-headline-sm font-bold text-primary block">
            POLISPHERE
          </Link>
          <h2 className="font-headline-md text-headline-md text-on-surface">Admin Dashboard Login</h2>
          <p className="font-body-md text-caption text-on-surface-variant">
            Content Management Access & Controls
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm border border-error/30 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-md">
          <div className="space-y-1">
            <label className="font-caption text-caption text-on-surface-variant font-semibold block">
              Admin Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-secondary"
              placeholder="admin@polisphere.app"
            />
          </div>

          <div className="space-y-1">
            <label className="font-caption text-caption text-on-surface-variant font-semibold block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-secondary"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] bg-primary text-white font-label-md text-label-md rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="pt-sm border-t border-outline-variant text-center">
          <p className="text-caption text-outline">
            Default Seed Credentials:<br />
            <code className="text-primary font-mono font-semibold">admin@polisphere.app</code> / <code className="text-primary font-mono font-semibold">AdminPass123!</code>
          </p>
        </div>
      </div>
    </div>
  );
};
