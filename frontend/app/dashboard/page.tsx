'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskApi } from '../../lib/api';
import { signOut, getCurrentUserId } from '../../lib/better-auth-client';
import { useTheme } from '../../contexts/ThemeContext';

// Define TypeScript interfaces
interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [userId, setUserId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Check if user is authenticated and get user ID on client side
  useEffect(() => {
    const checkAuth = async () => {
      const userId = await getCurrentUserId();

      if (!userId) {
        router.push('/login');
        return;
      }

      setUserId(userId);
    };

    checkAuth();
  }, [router]);

  // Fetch tasks when userId is set
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // Calculate stats when tasks change
  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    setStats({ total, completed, pending });
  }, [tasks]);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      if (userId) {
        const response = await taskApi.getTasks(userId);
        setTasks(response.data);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Use Better Auth client to sign out
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, clear local storage as fallback
      localStorage.removeItem('better-auth-token');
      localStorage.removeItem('user-id');
    } finally {
      router.push('/login');
    }
  };

  if (loading || userId === null) {
    return (
      <div className={`min-h-screen ${
        theme === 'light'
          ? 'bg-gradient-to-br from-white via-purple-50 to-white text-gray-900'
          : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
      } relative overflow-hidden`}>
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 ${
            theme === 'light' ? 'bg-purple-200/20' : 'bg-purple-500/10'
          } rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${
            theme === 'light' ? 'bg-indigo-200/20' : 'bg-indigo-500/10'
          } rounded-full blur-3xl animate-pulse delay-1000`}></div>
        </div>

        {/* Navigation Bar */}
        <nav className={`${
          theme === 'light'
            ? 'bg-white/50 backdrop-blur-xl border-b border-gray-200'
            : 'bg-slate-800/50 backdrop-blur-xl border-b border-white/10'
        } sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse ${
                    theme === 'light' ? 'animate-pulse' : 'animate-pulse'
                  }`}>
                    <span className={`${
                      theme === 'light' ? 'text-white font-bold text-lg' : 'text-white font-bold text-lg'
                    }`}>T</span>
                  </div>
                  <span className={`${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  } text-xl font-bold`}>TaskFlow</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`animate-pulse rounded-full h-12 w-12 bg-gradient-to-r ${
                  theme === 'light' ? 'from-indigo-300/20 to-purple-300/20' : 'from-indigo-500/20 to-purple-500/20'
                }`}></div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center animate-fade-in-up">
                <div className="relative">
                  <div className={`${
                    theme === 'light' ? 'animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900' : 'animate-spin rounded-full h-12 w-12 border-b-2 border-white'
                  } mx-auto`}></div>
                  <div className={`absolute inset-0 animate-ping rounded-full h-12 w-12 border ${
                    theme === 'light' ? 'border-purple-500/50' : 'border-purple-500/50'
                  } mx-auto`}></div>
                </div>
                <p className={`mt-4 text-lg ${
                  theme === 'light' ? 'text-gray-700' : 'text-white/70'
                }`}>Loading your dashboard...</p>
                <div className="mt-2 flex justify-center">
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 ${
                      theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-500'
                    } rounded-full animate-bounce`}></div>
                    <div className={`w-2 h-2 ${
                      theme === 'light' ? 'bg-purple-500' : 'bg-purple-500'
                    } rounded-full animate-bounce delay-100`}></div>
                    <div className={`w-2 h-2 ${
                      theme === 'light' ? 'bg-pink-500' : 'bg-pink-500'
                    } rounded-full animate-bounce delay-200`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'light'
        ? 'bg-gradient-to-br from-white via-purple-50 to-white text-gray-900'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
    } relative overflow-hidden`}>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${
          theme === 'light' ? 'bg-purple-200/20' : 'bg-purple-500/10'
        } rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${
          theme === 'light' ? 'bg-indigo-200/20' : 'bg-indigo-500/10'
        } rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      {/* Navigation Bar */}
      <nav className={`${theme === 'light' ? 'bg-white/50 backdrop-blur-xl border-b border-gray-200' : 'bg-slate-800/50 backdrop-blur-xl border-b border-white/10'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'animate-pulse' : 'animate-pulse'
                }`}>
                  <span className={`${
                    theme === 'light' ? 'text-white font-bold text-lg' : 'text-white font-bold text-lg'
                  }`}>T</span>
                </div>
                <span className={`${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                } text-xl font-bold`}>TaskFlow</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className={`${
                  theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                } transition-colors relative group`}
              >
                Home
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                } transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/about')}
                className={`${
                  theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                } transition-colors relative group`}
              >
                About
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                } transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/support')}
                className={`${
                  theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                } transition-colors relative group`}
              >
                Support
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                } transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/tasks')}
                className={`${
                  theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                } transition-colors relative group`}
              >
                Tasks
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                } transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/profile')}
                className={`${
                  theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                } transition-colors relative group`}
              >
                Profile
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                } transition-all duration-300 group-hover:w-full`}></span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                } transition-all duration-300 relative group`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleLogout}
                className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg ${
                  theme === 'light' ? 'hover:shadow-purple-300' : 'hover:shadow-purple-500/25'
                } transition-all duration-300 transform hover:scale-105`}
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Theme Toggle Button - Mobile */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                } transition-all duration-300 relative group`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                } transition-all duration-300`}
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden ${
              theme === 'light'
                ? 'bg-white/50 backdrop-blur-xl border-t border-gray-200'
                : 'bg-slate-800/50 backdrop-blur-xl border-t border-white/10'
            }`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => {
                    router.push('/');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    router.push('/about');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => {
                    router.push('/support');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Support
                </button>
                <button
                  onClick={() => {
                    router.push('/tasks');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => {
                    router.push('/profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>Dashboard</h1>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-white/70'}`}>Welcome back! Here's your productivity overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${
              theme === 'light'
                ? 'bg-white/50 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/50'
                : 'bg-slate-800/50 backdrop-blur-xl border border-white/10 hover:border-white/20'
            } rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'} text-sm`}>Total Tasks</p>
                  <p className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} animate-pulse`}>{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center animate-bounce">
                  <span className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-xl`}>📋</span>
                </div>
              </div>
            </div>

            <div className={`${
              theme === 'light'
                ? 'bg-white/50 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/50'
                : 'bg-slate-800/50 backdrop-blur-xl border border-white/10 hover:border-white/20'
            } rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'} text-sm`}>Completed</p>
                  <p className="text-3xl font-bold text-green-400 animate-pulse">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center animate-bounce delay-150">
                  <span className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-xl`}>✅</span>
                </div>
              </div>
            </div>

            <div className={`${
              theme === 'light'
                ? 'bg-white/50 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/50'
                : 'bg-slate-800/50 backdrop-blur-xl border border-white/10 hover:border-white/20'
            } rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'} text-sm`}>Pending</p>
                  <p className="text-3xl font-bold text-orange-400 animate-pulse">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center animate-bounce delay-300">
                  <span className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-xl`}>⏳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className={`${
            theme === 'light'
              ? 'bg-white/50 backdrop-blur-xl border border-gray-200/50'
              : 'bg-slate-800/50 backdrop-blur-xl border border-white/10'
          } rounded-2xl p-6 mb-8 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>Weekly Progress</h2>
              <div className="space-y-4">
                {stats.total > 0 && (
                  <div className={`${
                    theme === 'light'
                      ? 'bg-gray-100/50 rounded-xl p-4'
                      : 'bg-slate-700/50 rounded-xl p-4'
                  } relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>Completion Rate</span>
                        <span className={`${theme === 'light' ? 'text-gray-900 font-bold' : 'text-white font-bold'}`}>{Math.round((stats.completed / stats.total) * 100)}%</span>
                      </div>
                      <div className={`w-full ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } rounded-full h-3 overflow-hidden`}>
                        <div
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div className={`${
                  theme === 'light'
                    ? 'bg-gray-100/50 rounded-xl p-4'
                    : 'bg-slate-700/50 rounded-xl p-4'
                } relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>Next Goal</span>
                      <span className={`${theme === 'light' ? 'text-gray-900 font-bold' : 'text-white font-bold'}`}>Complete 5 more tasks</span>
                    </div>
                    <div className={`w-full ${
                      theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                    } rounded-full h-3 overflow-hidden`}>
                      <div className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className={`${
            theme === 'light'
              ? 'bg-white/50 backdrop-blur-xl border border-gray-200/50'
              : 'bg-slate-800/50 backdrop-blur-xl border border-white/10'
          } rounded-2xl p-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Recent Tasks</h2>
                <button
                  onClick={() => router.push('/tasks')}
                  className={`${theme === 'light' ? 'text-indigo-600 hover:text-indigo-800' : 'text-indigo-400 hover:text-indigo-300'} text-sm font-medium relative group`}
                >
                  View All
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                    theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  } transition-all duration-300 group-hover:w-full`}></span>
                </button>
              </div>
              {error && (
                <div className={`rounded-md ${
                  theme === 'light' ? 'bg-red-100' : 'bg-red-500/20'
                } p-4 mb-4 border ${
                  theme === 'light' ? 'border-red-200' : 'border-red-500/30'
                }`}>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-red-700' : 'text-red-300'
                  }`}>{error}</div>
                </div>
              )}
              {tasks.length === 0 ? (
                <p className={`${theme === 'light' ? 'text-gray-500' : 'text-white/50'} text-center py-8`}>No tasks yet. Add your first task to get started!</p>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task, index) => (
                    <div
                      key={task.id}
                      className={`${
                        theme === 'light'
                          ? 'bg-white/30 rounded-xl p-4 border border-gray-200/30 hover:border-gray-300/50'
                          : 'bg-slate-700/30 rounded-xl p-4 border border-white/10 hover:border-white/20'
                      } transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                            task.completed
                              ? 'bg-green-500 border-green-500 animate-pulse'
                              : theme === 'light'
                                ? 'border-gray-400 hover:border-indigo-400'
                                : 'border-white/30 hover:border-indigo-400'
                          }`}>
                            {task.completed && (
                              <span className="text-white text-xs animate-bounce">✓</span>
                            )}
                          </div>
                          <span className={`${
                            task.completed
                              ? theme === 'light' ? 'text-gray-500 line-through' : 'text-white/50 line-through'
                              : theme === 'light' ? 'text-gray-900' : 'text-white'
                          } transition-all duration-300`}>
                            {task.title}
                          </span>
                        </div>
                        <span className={`text-xs ${
                          theme === 'light' ? 'text-gray-500 bg-gray-200/50' : 'text-white/50 bg-slate-700/50'
                        } px-2 py-1 rounded-full`}>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {task.description && (
                        <p className={`${
                          theme === 'light' ? 'text-gray-600' : 'text-white/70'
                        } text-sm mt-2 ml-8 transition-all duration-300`}>{task.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${theme === 'light' ? 'border-gray-200/50' : 'border-white/10'} p-6 ${theme === 'light' ? 'text-gray-500' : 'text-white/50'} mt-16 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'light' ? 'from-indigo-300/5 to-purple-300/5' : 'from-indigo-500/5 to-purple-500/5'} opacity-0 hover:opacity-10 transition-opacity duration-1000`}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                  <span className={`${theme === 'light' ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>T</span>
                </div>
                <span className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-xl font-bold`}>TaskFlow</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button
                onClick={() => router.push('/about')}
                className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-white/50 hover:text-white/80'} transition-colors relative group text-sm md:text-base`}
              >
                About
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/support')}
                className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-white/50 hover:text-white/80'} transition-colors relative group text-sm md:text-base`}
              >
                Support
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/privacy')}
                className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-white/50 hover:text-white/80'} transition-colors relative group text-sm md:text-base`}
              >
                Privacy
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/terms')}
                className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-white/50 hover:text-white/80'} transition-colors relative group text-sm md:text-base`}
              >
                Terms
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/settings')}
                className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-white/50 hover:text-white/80'} transition-colors relative group text-sm md:text-base`}
              >
                Settings
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
            </div>
          </div>
          <p className={`mt-6 text-center ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>© 2025 TaskFlow. The future of productivity.</p>
        </div>
      </footer>
    </div>
  );
}