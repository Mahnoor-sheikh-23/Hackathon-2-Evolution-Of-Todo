'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { taskApi } from '../../../lib/api';
import { useTheme } from '../../../contexts/ThemeContext';

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

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const taskId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({ title: '', description: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Get user ID from localStorage (Better Auth)
  const userId = localStorage.getItem('user-id');

  // Check if user is authenticated
  useEffect(() => {
    if (!localStorage.getItem('better-auth-token') || !userId) {
      router.push('/login');
      return;
    }

    fetchTask();
  }, [userId, taskId, router]);

  // Fetch task from the API
  const fetchTask = async () => {
    try {
      if (userId) {
        const response = await taskApi.getTaskById(userId, taskId);
        setTask(response.data);
        setUpdatedTask({
          title: response.data.title,
          description: response.data.description
        });
      }
    } catch (err) {
      setError('Failed to fetch task');
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !task) return;

    try {
      const response = await taskApi.updateTask(userId, taskId, {
        title: updatedTask.title,
        description: updatedTask.description
      });
      setTask(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  // Toggle task completion
  const handleToggleCompletion = async () => {
    if (!userId || !task) return;

    try {
      const response = await taskApi.toggleTaskCompletion(userId, taskId);
      setTask(response.data);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (!userId || !task) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(userId, taskId);
        router.push('/dashboard');
      } catch (err) {
        setError('Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('better-auth-token');
    localStorage.removeItem('user-id');
    router.push('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!task) {
    return <div className="flex justify-center items-center h-screen">Task not found</div>;
  }

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
              <button
                onClick={() => router.push('/dashboard')}
                className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}
              >
                Dashboard
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/tasks')}
                className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}
              >
                Tasks
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/profile')}
                className={`${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors relative group`}
              >
                Profile
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
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
              <button
                onClick={handleLogout}
                className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg ${theme === 'dark' ? 'hover:shadow-purple-500/25' : 'hover:shadow-purple-300'} transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
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
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors w-full text-left`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  router.push('/tasks');
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors w-full text-left`}
              >
                Tasks
              </button>
              <button
                onClick={() => {
                  router.push('/profile');
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors w-full text-left`}
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors w-full text-left`}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Created: {new Date(task.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated: {new Date(task.updated_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    onClick={handleDeleteTask}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 mt-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdateTask} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={updatedTask.title}
                      onChange={(e) => setUpdatedTask({...updatedTask, title: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={updatedTask.description}
                      onChange={(e) => setUpdatedTask({...updatedTask, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setUpdatedTask({ title: task.title, description: task.description });
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={handleToggleCompletion}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className={`ml-3 text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.description && (
                    <div className="prose prose-indigo">
                      <p className="text-gray-700">{task.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} p-6 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'} mt-16 relative overflow-hidden`}>
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
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button
                onClick={() => router.push('/about')}
                className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group text-sm md:text-base`}
              >
                About
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/support')}
                className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group text-sm md:text-base`}
              >
                Support
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/privacy')}
                className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group text-sm md:text-base`}
              >
                Privacy
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/terms')}
                className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group text-sm md:text-base`}
              >
                Terms
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
              <button
                onClick={() => router.push('/settings')}
                className={`${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'} transition-colors relative group text-sm md:text-base`}
              >
                Settings
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              </button>
            </div>
          </div>
          <p className={`mt-6 text-center ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>© 2025 TaskFlow. The future of productivity.</p>
        </div>
      </footer>
    </div>
  );
}