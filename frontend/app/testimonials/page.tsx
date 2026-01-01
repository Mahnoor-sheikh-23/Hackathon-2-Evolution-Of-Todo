'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserId } from '../../lib/better-auth-client';
import { useTheme } from '../../contexts/ThemeContext';

export default function TestimonialsPage() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const userId = await getCurrentUserId();
      setIsAuthenticated(!!userId);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO at TechCorp",
      content: "TaskFlow has completely transformed how our team manages projects. We're more productive and organized than ever before.",
      rating: 5,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      content: "The intuitive interface and powerful features make TaskFlow the perfect tool for our development team. Highly recommended!",
      rating: 5,
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Freelance Designer",
      content: "As a freelancer, TaskFlow helps me stay on top of multiple client projects. The time tracking feature is a game-changer.",
      rating: 5,
      avatar: "ER"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Startup Founder",
      content: "TaskFlow's AI-powered insights have helped us identify bottlenecks and improve our workflow efficiency by 40%.",
      rating: 5,
      avatar: "DK"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Marketing Director",
      content: "The collaboration features are outstanding. Our remote team stays perfectly synchronized with TaskFlow.",
      rating: 5,
      avatar: "LT"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Project Lead",
      content: "Finally, a task management tool that actually makes sense. The learning curve was minimal and the results were immediate.",
      rating: 5,
      avatar: "JW"
    }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-gray-100 via-purple-50 to-white'} relative overflow-hidden flex items-center justify-center`}>
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
          <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-300/10'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-300/10'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        </div>

        <div className="text-center animate-fade-in-up z-10">
          <div className="relative">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-900'} mx-auto`}></div>
            <div className={`absolute inset-0 animate-ping rounded-full h-12 w-12 border ${theme === 'dark' ? 'border-purple-500/50' : 'border-purple-300/50'} mx-auto`}></div>
          </div>
          <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Loading testimonials...</p>
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-gray-100 via-purple-50 to-white'} relative overflow-hidden`}>
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
        .delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-300/10'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-300/10'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      {/* Navigation */}
      <nav className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
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
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}>
                    Dashboard
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
                  </Link>
                  <Link href="/profile" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}>
                    Profile
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}>
                    Sign In
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
                  </Link>
                  <Link
                    href="/signup"
                    className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg ${theme === 'dark' ? 'hover:shadow-purple-500/25' : 'hover:shadow-purple-300'} transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
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

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50 text-white hover:bg-slate-600/50' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-300`}
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
            <div className={`md:hidden ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/testimonials"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="/support"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'
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
                        theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        theme === 'dark' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className={`text-4xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h1>
            <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-xl max-w-2xl mx-auto`}>
              Don't just take our word for it. Here's what our amazing customers have to say about TaskFlow.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up delay-200">
            <div className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-100/30'} backdrop-blur-xl rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} text-center`}>
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>99.9%</div>
              <div className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Uptime</div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-100/30'} backdrop-blur-xl rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} text-center`}>
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>4.9/5</div>
              <div className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>User Rating</div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-100/30'} backdrop-blur-xl rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} text-center`}>
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>10K+</div>
              <div className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Happy Users</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`${theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-100/30'} backdrop-blur-xl rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up group relative overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className={`${theme === 'dark' ? 'text-white/90' : 'text-gray-700'} italic`}>"{testimonial.content}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center animate-fade-in-up delay-600">
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Ready to join our community?</h2>
            <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-xl mb-8 max-w-2xl mx-auto`}>
              Join thousands of satisfied users who have transformed their productivity with TaskFlow.
            </p>
            {!isAuthenticated ? (
              <Link
                href="/signup"
                className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl ${theme === 'dark' ? 'hover:shadow-purple-500/25' : 'hover:shadow-purple-300/25'} transition-all duration-300 transform hover:scale-105 relative overflow-hidden group inline-block`}
              >
                <span className="relative z-10">Start Your Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl ${theme === 'dark' ? 'hover:shadow-purple-500/25' : 'hover:shadow-purple-300/25'} transition-all duration-300 transform hover:scale-105 relative overflow-hidden group inline-block`}
              >
                <span className="relative z-10">Go to Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} p-6 text-center ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'} mt-16 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-500/5 to-purple-500/5' : 'from-indigo-300/5 to-purple-300/5'} opacity-0 hover:opacity-10 transition-opacity duration-1000`}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                  <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>T</span>
                </div>
                <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>TaskFlow</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group`}>
                About
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/testimonials" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group`}>
                Testimonials
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/support" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group`}>
                Support
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/privacy" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group`}>
                Privacy
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
              <Link href="/terms" className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group`}>
                Terms
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </Link>
            </div>
          </div>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>© 2025 TaskFlow. The future of productivity.</p>
        </div>
      </footer>
    </div>
  );
}