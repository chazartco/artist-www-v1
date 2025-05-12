import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth, authenticate } from '../utils/auth';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };
    verifyAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await authenticate(password);
    if (success) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mb-4">
              <Lock className="h-8 w-8 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter the admin password to continue
            </p>
          </div>

          {error && (
            <div className="bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                autoFocus
                required
              />
            </div>
            <button type="submit" className="w-full btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;