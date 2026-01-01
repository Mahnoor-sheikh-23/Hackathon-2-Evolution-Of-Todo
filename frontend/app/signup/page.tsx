'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, getCurrentUserId } from '../../lib/better-auth-client';
import { useTheme } from '../../contexts/ThemeContext';

export default function SignupPage() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Use Better Auth client for signup
      const result = await signUp.email({
        email,
        password,
        name,
        callbackURL: '/dashboard', // Redirect to dashboard after signup
      });

      if (result?.error) {
        setError(result.error.message || 'Error creating account');
        return;
      }

      // Get the user ID from the session
      const userId = await getCurrentUserId();
      if (userId) {
        localStorage.setItem('user-id', userId);
      }

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh(); // Refresh the router to update the UI
    } catch (err) {
      setError('Error creating account');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-gray-100 via-purple-50 to-white'}`}>
      {/* Navigation Bar */}
      <nav className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>T</span>
                </div>
                <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>TaskFlow</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}>
                Home
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/about" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}>
                About
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/testimonials" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}>
                Testimonials
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/support" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}>
                Support
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50 text-yellow-300 hover:bg-slate-600/50' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-300`}
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
              <Link
                href="/login"
                className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg ${theme === 'dark' ? 'hover:shadow-purple-500/25' : 'hover:shadow-purple-300'} transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50 text-yellow-300 hover:bg-slate-600/50' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-300 mr-2`}
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
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50 text-white hover:bg-slate-600/50' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-300`}
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
          <div className={`md:hidden ${theme === 'dark' ? 'bg-slate-800/90 border-t border-white/10' : 'bg-white/90 border-t border-gray-200/50'} backdrop-blur-xl`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/testimonials"
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/support"
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                href="/login"
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className={`mx-auto h-16 w-16 rounded-full ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-purple-100/50'} flex items-center justify-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className={`mt-6 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Create your account
            </h2>
            <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
              Get started with your todo list today
            </p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl rounded-2xl p-8 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className={`rounded-md ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'} p-4 border ${theme === 'dark' ? 'border-red-500/30' : 'border-red-200'}`}>
                  <div className="flex items-center">
                    <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'} mb-1`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border ${theme === 'dark' ? 'border-white/20 rounded-xl bg-slate-700/50 text-white placeholder-white/50' : 'border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300`}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email-address" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'} mb-1`}>
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border ${theme === 'dark' ? 'border-white/20 rounded-xl bg-slate-700/50 text-white placeholder-white/50' : 'border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'} mb-1`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border ${theme === 'dark' ? 'border-white/20 rounded-xl bg-slate-700/50 text-white placeholder-white/50' : 'border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'} mb-1`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border ${theme === 'dark' ? 'border-white/20 rounded-xl bg-slate-700/50 text-white placeholder-white/50' : 'border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white ${
                    isLoading ? 'bg-indigo-400' : `bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg ${theme === 'dark' ? 'hover:shadow-purple-500/25' : 'hover:shadow-purple-300'}`
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <Link href="/login" className={`font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition duration-200`}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}