'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserId } from '../../lib/better-auth-client';
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
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
      // In a real app, we would fetch user details from the API
      // For now, we'll use localStorage to get user info
      const token = localStorage.getItem('better-auth-token');
      const storedUserId = localStorage.getItem('user-id');
      const userEmail = localStorage.getItem('user-email') || 'user@example.com'; // Would come from API
      const userName = localStorage.getItem('user-name') || 'User'; // Would come from API

      setUser({
        id: storedUserId,
        email: userEmail,
        name: userName,
        created_at: new Date().toISOString(), // Would come from API
      });
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading || userId === null) {
    return (
      <div className={`min-h-screen ${
        theme === 'light'
          ? 'bg-gradient-to-br from-white via-purple-50 to-white text-gray-900'
          : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
      } relative overflow-hidden flex items-center justify-center`}>
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center">
                <div className={`animate-pulse rounded-full h-12 w-12 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-300/20 to-purple-300/20' : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
                }`}></div>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center">
                <div className={`animate-pulse rounded-full h-12 w-12 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-300/20 to-purple-300/20' : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
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
                }`}>Loading settings...</p>
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
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                  theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                } transition-all duration-300 group-hover:w-full`}></span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-slate-700 text-white hover:bg-slate-600'} transition-colors duration-300 mr-2`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-slate-700 text-white hover:bg-slate-600'} transition-colors duration-300`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${theme === 'light' ? 'bg-white/90 border-t border-gray-200' : 'bg-slate-800/90 border-t border-white/10'} backdrop-blur-xl`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} transition-colors w-full text-left`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  router.push('/tasks');
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} transition-colors w-full text-left`}
              >
                Tasks
              </button>
              <button
                onClick={() => {
                  router.push('/profile');
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} transition-colors w-full text-left`}
              >
                Profile
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Settings Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            } mb-2`}>Settings</h1>
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
                { id: 'general', label: 'General' },
                { id: 'appearance', label: 'Appearance' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'privacy', label: 'Privacy' },
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
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${
                      theme === 'light' ? 'text-gray-700' : 'text-white/70'
                    } mb-2`}>Language</label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${
                        theme === 'light'
                          ? 'border-gray-300 bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'border-white/20 bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      } sm:text-sm transition-all duration-300`}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${
                      theme === 'light' ? 'text-gray-700' : 'text-white/70'
                    } mb-2`}>Timezone</label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${
                        theme === 'light'
                          ? 'border-gray-300 bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'border-white/20 bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      } sm:text-sm transition-all duration-300`}
                    >
                      <option>(GMT-05:00) Eastern Time</option>
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT+01:00) Berlin</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${
                      theme === 'light' ? 'text-gray-700' : 'text-white/70'
                    } mb-2`}>Date Format</label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${
                        theme === 'light'
                          ? 'border-gray-300 bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'border-white/20 bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      } sm:text-sm transition-all duration-300`}
                    >
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    } mb-2`}>Export Data</h3>
                    <button className={`${
                      theme === 'light'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30'
                    } px-4 py-2 rounded-lg transition-all duration-300`}>
                      Export Tasks
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    } mb-2`}>Theme</h3>
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
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    } mb-2`}>Compact Mode</h3>
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

                  <div>
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    } mb-2`}>Animation Speed</h3>
                    <div className="flex items-center space-x-4">
                      <label className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Slow</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        defaultValue="1"
                        className="w-full max-w-xs"
                      />
                      <label className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Fast</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Notifications</h2>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Email Notifications</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Receive email updates about your tasks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className={`w-11 h-6 ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                    </label>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Push Notifications</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Get notified on your device</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className={`w-11 h-6 ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                    </label>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Daily Digest</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Summary of your daily tasks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className={`w-11 h-6 ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                    </label>
                  </div>

                  <div className={`flex items-center justify-between py-4 ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Task Reminders</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Get reminders for upcoming tasks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className={`w-11 h-6 ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Privacy</h2>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Private Mode</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Hide sensitive information</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className={`w-11 h-6 ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                    </label>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Data Sharing</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Allow anonymous data sharing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className={`w-11 h-6 ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                    </label>
                  </div>

                  <div className={`flex items-center justify-between py-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Activity Logging</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>Track your usage patterns</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className={`w-11 h-6 ${
                        theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                      } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500`}></div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    } mb-2`}>Account Deletion</h3>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-white/70'
                    } mb-4`}>Permanently delete your account and all data</p>
                    <button className={`${
                      theme === 'light'
                        ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    } px-4 py-2 rounded-lg transition-all duration-300`}>
                      Delete Account
                    </button>
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

                  <div className={`flex items-center justify-between py-4 ${
                    theme === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Login History</h3>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>View your recent login activity</p>
                    </div>
                    <button className={`${
                      theme === 'light' ? 'text-indigo-600 hover:text-indigo-500' : 'text-indigo-400 hover:text-indigo-300'
                    } text-sm`}>View</button>
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
            </div>
          </div>
          <p className={`mt-6 text-center ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>© 2025 TaskFlow. The future of productivity.</p>
        </div>
      </footer>
    </div>
  );
}