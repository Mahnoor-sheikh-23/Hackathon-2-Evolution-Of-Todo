'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserId } from '../lib/better-auth-client';
import { useTheme } from '../contexts/ThemeContext';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const userId = await getCurrentUserId();
      setIsAuthenticated(!!userId);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-slate-100 via-purple-50 to-slate-100'} relative overflow-hidden flex items-center justify-center`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/5'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        </div>

        <div className="text-center animate-fade-in-up z-10">
          <div className="relative">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-slate-800'} mx-auto`}></div>
            <div className={`absolute inset-0 animate-ping rounded-full h-12 w-12 border ${theme === 'dark' ? 'border-purple-500/50' : 'border-purple-500/30'} mx-auto`}></div>
          </div>
          <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-white/70' : 'text-slate-800/70'}`}>Loading TaskFlow...</p>
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-400'} rounded-full animate-bounce`}></div>
              <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'} rounded-full animate-bounce delay-100`}></div>
              <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-pink-500' : 'bg-pink-400'} rounded-full animate-bounce delay-200`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark'
      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
      : 'bg-gradient-to-br from-slate-100 via-purple-50 to-slate-100'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/5'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-500/5 to-purple-500/5' : 'from-indigo-400/5 to-purple-400/5'} rounded-full blur-3xl animate-pulse`}></div>
      </div>

      {/* Navigation */}
      <nav className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                  <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>T</span>
                </div>
                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>TaskFlow</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50 text-yellow-300 hover:bg-slate-600/50' : 'bg-slate-200/50 text-slate-700 hover:bg-slate-300/50'} transition-colors duration-300`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <Link href="/" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/about" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/testimonials" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/support" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                Support
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/chat" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                    AI Chat
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="/dashboard" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="/profile" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                    Profile
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-800/80 hover:text-slate-900'} transition-colors relative group`}>
                    Sign In
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/signup"
                    className={`${theme === 'dark' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'} px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Theme Toggle Button - Mobile */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50 text-yellow-300 hover:bg-slate-600/50' : 'bg-slate-200/50 text-slate-700 hover:bg-slate-300/50'} transition-colors duration-300`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
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
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50 text-white hover:bg-slate-600/50' : 'bg-slate-200/50 text-slate-700 hover:bg-slate-300/50'} transition-colors duration-300`}
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
            <div className={`md:hidden ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'}`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/testimonials"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="/support"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/chat"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      AI Chat
                    </Link>
                    <Link
                      href="/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-500/5 to-purple-500/5' : 'from-indigo-400/5 to-purple-400/5'} opacity-0 hover:opacity-10 transition-opacity duration-1000`}></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className={`text-5xl md:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-6 leading-tight animate-fade-in-up`}>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>Productivity</span>
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-white/70' : 'text-slate-800/70'} mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200`}>
            The most beautiful and intuitive task management platform. Organize, prioritize, and accomplish more with our AI-powered productivity suite.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-400">
              <Link
                href="/signup"
                className={`${theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'} px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/login"
                className={`border ${theme === 'dark' ? 'border-white/20 text-white' : 'border-slate-300 text-slate-800'} px-8 py-4 rounded-xl text-lg font-semibold hover:${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} transition-all duration-300 relative overflow-hidden group`}
              >
                <span className="relative z-10">Sign In</span>
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </Link>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up delay-600">
            <div className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-xl rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-2`}>10K+</div>
              <div className={theme === 'dark' ? 'text-white/70' : 'text-slate-800/70'}>Active Users</div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-xl rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-2`}>99.9%</div>
              <div className={theme === 'dark' ? 'text-white/70' : 'text-slate-800/70'}>Uptime</div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-xl rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-2`}>24/7</div>
              <div className={theme === 'dark' ? 'text-white/70' : 'text-slate-800/70'}>Support</div>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-20 relative animate-fade-in-up delay-800">
            <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-500/20 to-purple-500/20' : 'from-indigo-400/20 to-purple-400/20'} rounded-3xl blur-3xl animate-pulse`}></div>
            <div className={`relative ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl rounded-3xl p-8 border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'} transform transition-all duration-500 hover:scale-[1.02]`}>
              <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-700 to-slate-800' : 'from-slate-100 to-slate-200'} rounded-2xl p-6 shadow-2xl`}>
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
                </div>
                <div className="space-y-3">
                  <div className={`h-4 bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-500/20 to-purple-500/20' : 'from-indigo-400/20 to-purple-400/20'} rounded w-3/4 animate-pulse`}></div>
                  <div className={`h-4 bg-gradient-to-r ${theme === 'dark' ? 'from-purple-500/20 to-pink-500/20' : 'from-purple-400/20 to-pink-400/20'} rounded w-1/2 animate-pulse delay-100`}></div>
                  <div className={`h-4 bg-gradient-to-r ${theme === 'dark' ? 'from-pink-500/20 to-indigo-500/20' : 'from-pink-400/20 to-indigo-400/20'} rounded w-5/6 animate-pulse delay-200`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-20 animate-fade-in-up delay-1000">
            <div className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-xl rounded-2xl p-8 border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'} max-w-2xl mx-auto`}>
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className={`text-lg mb-4 italic ${theme === 'dark' ? 'text-white/90' : 'text-slate-800/90'}`}>
                "TaskFlow has completely transformed how our team manages projects. We're more productive and organized than ever before."
              </p>
              <div className={`font-medium ${theme === 'dark' ? 'text-white/70' : 'text-slate-800/70'}`}>- Sarah Johnson, CEO at TechCorp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-10 transition-opacity duration-1000"></div>
        <div className="relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Insights",
                description: "Smart task prioritization and productivity analytics to help you focus on what matters most.",
                icon: "🤖"
              },
              {
                title: "Real-time Sync",
                description: "Seamlessly sync across all your devices with instant updates and cloud backup.",
                icon: "⚡"
              },
              {
                title: "Team Collaboration",
                description: "Share tasks, assign responsibilities, and track progress with your team in real-time.",
                icon: "👥"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 animate-fade-in-up group relative overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/50'} p-6 ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'} mt-16 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-500/5 to-purple-500/5' : 'from-indigo-300/5 to-purple-300/5'} opacity-0 hover:opacity-10 transition-opacity duration-1000`}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                  <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-bold text-lg`}>T</span>
                </div>
                <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-xl font-bold`}>TaskFlow</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/about" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-slate-500 hover:text-slate-700'} transition-colors relative group text-sm md:text-base`}>
                About
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/testimonials" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-slate-500 hover:text-slate-700'} transition-colors relative group text-sm md:text-base`}>
                Testimonials
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/support" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-slate-500 hover:text-slate-700'} transition-colors relative group text-sm md:text-base`}>
                Support
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/privacy" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-slate-500 hover:text-slate-700'} transition-colors relative group text-sm md:text-base`}>
                Privacy
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/terms" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-slate-500 hover:text-slate-700'} transition-colors relative group text-sm md:text-base`}>
                Terms
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
            </div>
          </div>
          <p className={`mt-6 text-center ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>© 2025 TaskFlow. The future of productivity.</p>
        </div>
      </footer>
    </div>
  );
}