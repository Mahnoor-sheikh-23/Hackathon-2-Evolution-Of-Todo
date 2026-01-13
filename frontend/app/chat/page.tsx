'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { chatApi } from '../../lib/api';
import { signOut, getCurrentUserId } from '../../lib/better-auth-client';
import { useTheme } from '../../contexts/ThemeContext';

// Define TypeScript interfaces
interface Message {
  id: number;
  conversation_id: number;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showConversations, setShowConversations] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Load conversations when user ID is set
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversations from the API
  const loadConversations = async () => {
    if (!userId) return;

    try {
      const response = await chatApi.getConversations(userId);
      setConversations(response.data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setInputMessage('');
    setError('');
  };

  // Load a specific conversation
  const loadConversation = async (convId: number) => {
    if (!userId) return;

    try {
      const response = await chatApi.getConversationMessages(userId, convId);
      setMessages(response.data);
      setConversationId(convId);
      setShowConversations(false);
      setError('');
    } catch (err) {
      setError('Failed to load conversation');
      console.error('Error loading conversation:', err);
    }
  };

  // Send a message to the AI
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !userId || loading) return;

    const userMessage: Message = {
      id: Date.now(), // Temporary ID
      conversation_id: conversationId || 0,
      user_id: userId,
      role: 'user',
      content: inputMessage,
      created_at: new Date().toISOString(),
    };

    // Add user message optimistically
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const response = await chatApi.sendMessage(userId, {
        message: inputMessage,
        conversation_id: conversationId || undefined,
      });

      // Update conversation ID if it's a new conversation
      if (!conversationId && response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }

      // Add AI response
      const aiMessage: Message = {
        id: response.data.message_id,
        conversation_id: response.data.conversation_id,
        user_id: userId,
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Reload conversations list to show the updated one
      loadConversations();

      // Check if the message might affect tasks (contains keywords like "delete", "remove", etc.)
      const lowerCaseMessage = inputMessage.toLowerCase();
      const taskRelatedKeywords = ['delete', 'remove', 'complete', 'finish', 'done', 'add', 'create'];
      const isTaskRelated = taskRelatedKeywords.some(keyword => lowerCaseMessage.includes(keyword));

      if (isTaskRelated) {
        // Trigger a global event to notify other components about task changes
        window.dispatchEvent(new CustomEvent('tasksChanged'));
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);

      // Remove the temporary message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // Delete a conversation
  const deleteConversation = async (convId: number) => {
    if (!userId) return;

    try {
      await chatApi.deleteConversation(userId, convId);
      loadConversations();

      // If currently viewing the deleted conversation, clear the chat
      if (conversationId === convId) {
        setMessages([]);
        setConversationId(null);
      }
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Error deleting conversation:', err);
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

  if (!userId) {
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
                }`}>Loading chat...</p>
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
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar for conversations */}
            <div className={`lg:w-64 flex-shrink-0 ${
              theme === 'light'
                ? 'bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50'
                : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10'
            } relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>Conversations</h2>
                  <button
                    onClick={startNewConversation}
                    className={`p-2 rounded-lg ${
                      theme === 'light'
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        : 'bg-indigo-700/50 text-indigo-300 hover:bg-indigo-600/50'
                    } transition-all duration-300`}
                    title="Start new conversation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <p className={`${
                      theme === 'light' ? 'text-gray-500' : 'text-white/50'
                    } text-sm`}>No conversations yet</p>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          conversationId === conv.id
                            ? theme === 'light'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-indigo-700/50 text-indigo-100 border border-indigo-600/50'
                            : theme === 'light'
                              ? 'hover:bg-gray-100 text-gray-700'
                              : 'hover:bg-slate-700/50 text-white/80'
                        }`}
                        onClick={() => loadConversation(conv.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="truncate flex-1">
                            <p className="font-medium truncate">
                              {conv.created_at ? new Date(conv.created_at).toLocaleDateString() : 'New Conversation'}
                            </p>
                            <p className="text-xs opacity-70 truncate">
                              {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString() : ''}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                            }}
                            className={`p-1 rounded ${
                              theme === 'light'
                                ? 'text-gray-500 hover:text-red-500'
                                : 'text-white/50 hover:text-red-400'
                            }`}
                            title="Delete conversation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className={`flex-1 flex flex-col ${
              theme === 'light'
                ? 'bg-white/50 backdrop-blur-xl rounded-2xl border border-gray-200/50'
                : 'bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10'
            } relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Messages container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-250px)]">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className={`w-16 h-16 rounded-full ${
                        theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/30'
                      } flex items-center justify-center mb-4`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                          theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className={`text-lg font-semibold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Welcome to TaskFlow AI Chat!</h3>
                      <p className={`mt-2 ${
                        theme === 'light' ? 'text-gray-600' : 'text-white/70'
                      } max-w-md`}>
                        Start a conversation with our AI assistant to manage your tasks. You can ask to create, update, or complete tasks using natural language.
                      </p>
                      <div className={`mt-4 p-3 rounded-lg ${
                        theme === 'light' ? 'bg-indigo-50 text-indigo-700' : 'bg-indigo-900/30 text-indigo-300'
                      } text-sm`}>
                        <p className="font-medium">Try saying:</p>
                        <ul className="mt-1 space-y-1 text-left">
                          <li>• "Create a task to buy groceries"</li>
                          <li>• "Show me my pending tasks"</li>
                          <li>• "Complete the meeting prep task"</li>
                          <li>• "Update my workout task to tomorrow"</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? theme === 'light'
                                ? 'bg-indigo-500 text-white rounded-br-none'
                                : 'bg-indigo-600 text-white rounded-br-none'
                              : theme === 'light'
                                ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                                : 'bg-slate-700 text-gray-100 rounded-bl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            message.role === 'user'
                              ? theme === 'light' ? 'text-indigo-200' : 'text-indigo-300'
                              : theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className={`p-4 border-t ${
                  theme === 'light'
                    ? 'border-gray-200/50 bg-white/30'
                    : 'border-white/10 bg-slate-800/30'
                }`}>
                  {error && (
                    <div className={`rounded-md ${
                      theme === 'light' ? 'bg-red-100' : 'bg-red-500/20'
                    } p-3 mb-3 border ${
                      theme === 'light' ? 'border-red-200' : 'border-red-500/30'
                    }`}>
                      <div className={`text-sm ${
                        theme === 'light' ? 'text-red-700' : 'text-red-300'
                      }`}>{error}</div>
                    </div>
                  )}

                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      disabled={loading}
                      className={`flex-1 px-4 py-3 rounded-xl border ${
                        theme === 'light'
                          ? 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
                          : 'border-white/20 bg-slate-700/50 backdrop-blur-xl text-white placeholder-white/50'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300`}
                    />
                    <button
                      type="submit"
                      disabled={loading || !inputMessage.trim()}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        loading || !inputMessage.trim()
                          ? theme === 'light'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                          : `bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg ${
                              theme === 'light' ? 'hover:shadow-purple-300' : 'hover:shadow-purple-500/25'
                            } transform hover:scale-105`
                      }`}
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}