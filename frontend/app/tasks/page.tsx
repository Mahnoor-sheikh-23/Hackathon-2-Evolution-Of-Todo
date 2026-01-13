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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
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

  // Listen for tasksChanged event to refresh task list when chatbot modifies tasks
  useEffect(() => {
    const handleTasksChanged = () => {
      if (userId) {
        fetchTasks();
      }
    };

    window.addEventListener('tasksChanged', handleTasksChanged);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('tasksChanged', handleTasksChanged);
    };
  }, [userId]);

  // Filter tasks based on search term and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    return matchesSearch && matchesStatus;
  });

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

  // Create a new task with optimistic update
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Basic validation
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    // Optimistic update: add the new task immediately
    const tempId = Date.now(); // Use timestamp as temporary ID
    const newTaskWithTempId = {
      id: tempId,
      user_id: userId,
      title: newTask.title,
      description: newTask.description,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add the temporary task to the list
    setTasks([newTaskWithTempId, ...tasks]);
    setNewTask({ title: '', description: '' });
    setError(''); // Clear any previous errors

    try {
      const response = await taskApi.createTask(userId, newTask);
      // Replace the temporary task with the server response
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === tempId ? response.data : task
        )
      );
    } catch (err) {
      setError('Failed to create task');
      // Remove the temporary task if the API call fails
      setTasks(prevTasks => prevTasks.filter(task => task.id !== tempId));
      console.error('Error creating task:', err);
    }
  };

  // Toggle task completion with optimistic update
  const handleToggleCompletion = async (taskId: number) => {
    if (!userId) return;

    // Optimistic update: immediately toggle the status
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      const response = await taskApi.toggleTaskCompletion(userId, taskId);
      // Update with server response (in case anything changed)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: response.data.completed, updated_at: response.data.updated_at } : task
        )
      );
    } catch (err) {
      setError('Failed to update task');
      // Revert the optimistic update if the API call fails
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      console.error('Error updating task:', err);
    }
  };

  // Delete a task with optimistic update
  const handleDeleteTask = async (taskId: number) => {
    if (!userId) return;

    // Find the task to delete before updating state
    const taskToDelete = tasks.find(task => task.id === taskId);

    // Optimistic update: immediately remove the task
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    try {
      await taskApi.deleteTask(userId, taskId);
      // Task is already removed, so no further action needed
    } catch (err) {
      setError('Failed to delete task');
      // Add the task back if the API call fails
      if (taskToDelete) {
        setTasks(prevTasks => [taskToDelete, ...prevTasks]);
      }
      console.error('Error deleting task:', err);
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
                }`}>Loading your tasks...</p>
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                    router.push('/chat');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'
                  }`}
                >
                  AI Chat
                </button>
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'
                  }`}
                >
                  Dashboard
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
          <div className="lg:flex lg:items-center lg:justify-between mb-8">
            <div className="min-w-0 flex-1">
              <h1 className={`text-3xl font-bold leading-7 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              } sm:text-3xl sm:truncate`}>
                My Tasks
              </h1>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className={`${
            theme === 'light'
              ? 'bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50'
              : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10'
          } mb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="search" className={`block text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-white/70'
                  } mb-1`}>
                    Search Tasks
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`block w-full px-4 py-3 pl-10 border ${
                        theme === 'light'
                          ? 'border-gray-300 rounded-xl bg-white/50 text-gray-900 placeholder-gray-500'
                          : 'border-white/20 rounded-xl bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300`}
                      placeholder="Search by title or description..."
                    />
                    <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      theme === 'light' ? 'text-gray-500' : 'text-white/50'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="filter" className={`block text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-white/70'
                  } mb-1`}>
                    Filter Status
                  </label>
                  <select
                    id="filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'pending')}
                    className={`block w-full px-4 py-3 border ${
                      theme === 'light'
                        ? 'border-gray-300 rounded-xl bg-white/50 text-gray-900'
                        : 'border-white/20 rounded-xl bg-slate-700/50 backdrop-blur-xl text-white'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC41KSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center] pr-10`}
                  >
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending Tasks</option>
                    <option value="completed">Completed Tasks</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task Form */}
          <div className={`${
            theme === 'light'
              ? 'bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50'
              : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10'
          } mb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2 className={`text-xl font-semibold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              } mb-4`}>Add New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                {error && (
                  <div className={`rounded-md ${
                    theme === 'light' ? 'bg-red-100' : 'bg-red-500/20'
                  } p-4 border ${
                    theme === 'light' ? 'border-red-200' : 'border-red-500/30'
                  }`}>
                    <div className={`text-sm ${
                      theme === 'light' ? 'text-red-700' : 'text-red-300'
                    }`}>{error}</div>
                  </div>
                )}
                <div>
                  <label htmlFor="title" className={`block text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-white/70'
                  } mb-1`}>
                    Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className={`mt-1 block w-full px-4 py-3 pl-10 border ${
                        theme === 'light'
                          ? 'border-gray-300 rounded-xl bg-white/50 text-gray-900 placeholder-gray-500'
                          : 'border-white/20 rounded-xl bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300`}
                      placeholder="Task title..."
                      required
                    />
                    <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      theme === 'light' ? 'text-gray-500' : 'text-white/50'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className={`block text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-white/70'
                  } mb-1`}>
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className={`mt-1 block w-full px-4 py-3 pl-10 border ${
                        theme === 'light'
                          ? 'border-gray-300 rounded-xl bg-white/50 text-gray-900 placeholder-gray-500'
                          : 'border-white/20 rounded-xl bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300`}
                      placeholder="Task description..."
                      rows={3}
                    />
                    <svg className={`absolute left-3 top-4 h-5 w-5 ${
                      theme === 'light' ? 'text-gray-500' : 'text-white/50'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:shadow-xl ${
                      theme === 'light' ? 'hover:shadow-purple-300' : 'hover:shadow-purple-500/25'
                    } transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
                  >
                    <span className="relative z-10">Add Task</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tasks List */}
          <div className={`${
            theme === 'light'
              ? 'bg-white/50 backdrop-blur-xl rounded-2xl border border-gray-200/50'
              : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10'
          } relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 px-6 py-6">
              <h2 className={`text-xl font-semibold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              } mb-4`}>
                Your Tasks ({filteredTasks.length} of {tasks.length} shown)
              </h2>
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
              {filteredTasks.length === 0 ? (
                <p className={`${
                  theme === 'light' ? 'text-gray-500' : 'text-white/50'
                } text-center py-8`}>No tasks match your search criteria.</p>
              ) : (
                <ul className="space-y-4">
                  {filteredTasks.map((task, index) => (
                    <li
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
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleCompletion(task.id)}
                            className={`h-5 w-5 rounded-full ${
                              theme === 'light'
                                ? task.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-400'
                                : task.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-white/30'
                            } text-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all duration-300 cursor-pointer`}
                          />
                          <button
                            onClick={() => router.push(`/tasks/${task.id}`)}
                            className={`ml-3 text-left ${
                              task.completed
                                ? theme === 'light' ? 'text-gray-500 line-through' : 'text-white/50 line-through'
                                : theme === 'light' ? 'text-gray-900' : 'text-white'
                            } transition-all duration-300 hover:underline`}
                          >
                            {task.title}
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className={`inline-flex items-center px-3 py-1 border ${
                              theme === 'light'
                                ? 'border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700'
                                : 'border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300'
                            } text-sm font-medium rounded-lg focus:outline-none focus:ring-2 ${
                              theme === 'light'
                                ? 'focus:ring-red-200/50'
                                : 'focus:ring-red-500/50'
                            } transition-all duration-300 relative group`}
                          >
                            <span>Delete</span>
                            <div className={`absolute inset-0 ${
                              theme === 'light'
                                ? 'bg-red-100/50'
                                : 'bg-red-500/10'
                            } opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}></div>
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <p className={`ml-8 mt-2 ${
                          theme === 'light' ? 'text-gray-600' : 'text-white/70'
                        } transition-all duration-300`}>{task.description}</p>
                      )}
                      <p className={`ml-8 mt-2 text-xs ${
                        theme === 'light' ? 'text-gray-500 bg-gray-200/30' : 'text-white/50 bg-slate-700/30'
                      } px-2 py-1 rounded-full inline-block`}>
                        Created: {new Date(task.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
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