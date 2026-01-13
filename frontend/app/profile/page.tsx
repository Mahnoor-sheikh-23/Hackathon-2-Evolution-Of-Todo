'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserId } from '../../lib/better-auth-client';
import { userApi } from '../../lib/api';

import { useTheme } from '../../contexts/ThemeContext';
export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'auto'>('dark');
  const [editUser, setEditUser] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme, setTheme } = useTheme();

  // Check if user is authenticated and get user ID on client side
  useEffect(() => {
    const checkAuth = async () => {
      const userId = await getCurrentUserId();

      if (!userId) {
        router.push('/login');
        return;
      }

      setUserId(userId);

      try {
        // Fetch user details from the API
        const userData = await userApi.getUserProfile(userId);

        setUser(userData);
        setEditUser({ name: userData.name || '', email: userData.email || '' });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile. Using fallback data.');

        // Fallback to localStorage data if API fails
        const storedUserId = localStorage.getItem('user-id');
        const userEmail = localStorage.getItem('user-email') || 'user@example.com';
        const userName = localStorage.getItem('user-name') || 'User';

        const userData = {
          id: storedUserId,
          email: userEmail,
          name: userName,
          created_at: new Date().toISOString(),
        };

        setUser(userData);
        setEditUser({ name: userData.name, email: userData.email });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
              <div className="flex items-center space-x-4">
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

                <div className={`${
                  theme === 'light' ? 'animate-pulse rounded-full h-12 w-12 bg-gradient-to-r from-indigo-300/20 to-purple-300/20' : 'animate-pulse rounded-full h-12 w-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
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
                }`}>Loading your profile...</p>
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
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-400 {
          animation-delay: 400ms;
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
                onClick={() => router.push('/dashboard')}
                className={`${
                  theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                } transition-colors relative group`}
              >
                Dashboard
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                } transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/chat')}
                className={`${
                  theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                } transition-colors relative group`}
              >
                AI Chat
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
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-slate-700'
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
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-slate-700'
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
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Support
                </button>
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    router.push('/chat');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-slate-700'
                  }`}
                >
                  AI Chat
                </button>
                <button
                  onClick={() => {
                    router.push('/tasks');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-slate-700'
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
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8">
            <div className={`${
              theme === 'light'
                ? 'bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200'
                : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10'
            } mb-6`}>
              <div className="flex items-center space-x-4">
                <div className={`${
                  theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-500/20'
                } w-16 h-16 rounded-full flex items-center justify-center`}>
                  <span className={`${
                    theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                  } text-xl font-bold`}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{user?.name || 'User'}</h1>
                  <p className={`${
                    theme === 'light' ? 'text-gray-600' : 'text-white/70'
                  }`}>{user?.email}</p>
                </div>
              </div>
            </div>
            <p className={`${
              theme === 'light' ? 'text-gray-600' : 'text-white/70'
            }`}>Manage your account and preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className={`${
            theme === 'light'
              ? 'bg-white/50 backdrop-blur-xl rounded-2xl p-1 border border-gray-200'
              : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl p-1 border border-white/10'
          } mb-8`}>
            <div className="flex space-x-1">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'account', label: 'Account' },
                { id: 'appearance', label: 'Appearance' },
                { id: 'security', label: 'Security' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : theme === 'light'
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className={`${
            theme === 'light'
              ? 'bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200'
              : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10'
          }`}>
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${
                      theme === 'light' ? 'text-gray-600' : 'text-white/70'
                    } mb-2`}>Name</label>
                    <input
                      type="text"
                      value={editUser.name}
                      onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                      className={`w-full px-4 py-3 border ${
                        theme === 'light'
                          ? 'border-gray-300 rounded-xl bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'border-white/20 rounded-xl bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      } sm:text-sm transition-all duration-300`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${
                      theme === 'light' ? 'text-gray-600' : 'text-white/70'
                    } mb-2`}>Email</label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                      className={`w-full px-4 py-3 border ${
                        theme === 'light'
                          ? 'border-gray-300 rounded-xl bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'border-white/20 rounded-xl bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      } sm:text-sm transition-all duration-300`}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      if (!userId) return;

                      try {
                        // Update user details via API
                        const updatedUserData = await userApi.updateUserProfile(userId, {
                          name: editUser.name,
                          email: editUser.email
                        });

                        // Update the user state with the response from the API
                        setUser({
                          ...user,
                          name: updatedUserData.name || editUser.name,
                          email: updatedUserData.email || editUser.email
                        });

                        // Update localStorage as fallback
                        localStorage.setItem('user-name', updatedUserData.name || editUser.name);
                        localStorage.setItem('user-email', updatedUserData.email || editUser.email);

                        // Show success message
                        alert('Profile updated successfully!');
                      } catch (error) {
                        console.error('Error updating profile:', error);
                        alert('Failed to update profile. Please try again.');
                      }
                    }}
                    className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 ${
                      theme === 'light' ? 'hover:shadow-indigo-500/25' : 'hover:shadow-purple-500/25'
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Account Settings</h2>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Account Status</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Your account is active</p>
                    </div>
                    <span className={`px-3 py-1 ${
                      theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-400'
                    } rounded-full text-sm`}>Active</span>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Account ID</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>{user?.id}</p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Account Created</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>


                  <div className="pt-4">
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    } mb-4`}>Danger Zone</h3>
                    <button className={`${
                      theme === 'light' ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200' : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    } px-4 py-2 rounded-lg transition-all duration-300`}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className={`space-y-6 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                <h2 className="text-xl font-semibold">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'dark', label: 'Dark', description: 'Default dark theme' },
                        { id: 'light', label: 'Light', description: 'Clean light theme' },
                        { id: 'auto', label: 'Auto', description: 'System preference' },
                      ].map((themeOption) => (
                        <div
                          key={themeOption.id}
                          onClick={() => setTheme(themeOption.id as 'dark' | 'light' | 'auto')}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                            theme === themeOption.id
                              ? 'border-indigo-500 bg-indigo-500/10'
                              : theme === 'light'
                                ? 'border-gray-300 hover:border-gray-400'
                                : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                              theme === themeOption.id
                                ? 'border-indigo-500'
                                : theme === 'light'
                                  ? 'border-gray-400'
                                  : 'border-white/30'
                            }`}>
                              {theme === themeOption.id && (
                                <div className="w-full h-full bg-indigo-500 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>{themeOption.label}</p>
                              <p className={`text-sm ${
                                theme === 'light' ? 'text-gray-600' : 'text-white/70'
                              }`}>{themeOption.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Compact Mode</h3>
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className={`w-11 h-6 ${
                          theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                        } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                      </label>
                      <span className={`ml-3 text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Enable compact task list view</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Security</h2>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Password</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Last changed 30 days ago</p>
                    </div>
                    <button className={`${
                      theme === 'light' ? 'text-indigo-600 hover:text-indigo-500' : 'text-indigo-400 hover:text-indigo-300'
                    } text-sm`}>Change</button>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Two-Factor Authentication</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Add an extra layer of security</p>
                    </div>
                    <button className={`${
                      theme === 'light' ? 'text-indigo-600 hover:text-indigo-500' : 'text-indigo-400 hover:text-indigo-300'
                    } text-sm`}>Enable</button>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Active Sessions</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Manage your active browser sessions</p>
                    </div>
                    <button className={`${
                      theme === 'light' ? 'text-indigo-600 hover:text-indigo-500' : 'text-indigo-400 hover:text-indigo-300'
                    } text-sm`}>View</button>
                  </div>

                  <div className="pt-4">
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    } mb-2`}>Login History</h3>
                    <div className={`${
                      theme === 'light' ? 'bg-gray-100 rounded-xl p-4' : 'bg-slate-700/30 rounded-xl p-4'
                    }`}>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Recent login activity</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Today, 10:30 AM</span>
                          <span className={`${
                            theme === 'light' ? 'text-green-600' : 'text-green-400'
                          }`}>Current Session</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Yesterday, 2:15 PM</span>
                          <span className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>Chrome on Windows</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Dec 28, 2024, 9:45 AM</span>
                          <span className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>Firefox on Mac</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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