import axios, { AxiosInstance } from 'axios';

// Use local backend URL for development, Railway for production
const BACKEND_URL = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://127.0.0.1:8000'
  : 'https://hackathon-2-evolution-of-todo-production.up.railway.app';

// Create an Axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get the JWT token from localStorage (set by our auth system)
    const token = localStorage.getItem('better-auth-token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, redirect to login
      localStorage.removeItem('better-auth-token');
      localStorage.removeItem('user-id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Define TypeScript interfaces for API entities
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Task API service
export const taskApi = {
  // Get all tasks for a user
  getTasks: async (userId: string): Promise<{ data: Task[] }> => {
    try {
      const response = await apiClient.get(`/api/${userId}/tasks/`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (userId: string, taskData: TaskCreate): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.post(`/api/${userId}/tasks/`, taskData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get a specific task
  getTaskById: async (userId: string, taskId: number): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.get(`/api/${userId}/tasks/${taskId}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (userId: string, taskId: number, taskData: TaskUpdate): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.put(`/api/${userId}/tasks/${taskId}`, taskData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Toggle task completion status
  toggleTaskCompletion: async (userId: string, taskId: number): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.patch(`/api/${userId}/tasks/${taskId}/complete`);
      return { data: response.data };
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (userId: string, taskId: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/${userId}/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};

// User API service
export const userApi = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, userData: { name?: string; email?: string }): Promise<any> => {
    try {
      const response = await apiClient.put(`/api/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

// Authentication API service
export const authApi = {
  // Login user (this would work with Better Auth)
  login: async (email: string, password: string) => {
    // In a real implementation, this would interact with Better Auth
    // For now, we'll simulate the API call
    console.log('Login attempt with:', { email });
    // This would typically be handled by Better Auth's client-side API
    return { success: true };
  },

  // Signup user (this would work with Better Auth)
  signup: async (name: string, email: string, password: string) => {
    // In a real implementation, this would interact with Better Auth
    // For now, we'll simulate the API call
    console.log('Signup attempt with:', { name, email });
    // This would typically be handled by Better Auth's client-side API
    return { success: true };
  },

  // Logout user
  logout: async () => {
    // Remove auth tokens from localStorage
    localStorage.removeItem('better-auth-token');
    localStorage.removeItem('user-id');
    return { success: true };
  },
};

// Define TypeScript interfaces for Chat API entities
export interface Conversation {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: number;
}

export interface ChatResponse {
  response: string;
  conversation_id: number;
  message_id: number;
  tool_calls: any[];
}

// Chat API service
export const chatApi = {
  // Send a message to the AI
  sendMessage: async (userId: string, data: ChatRequest): Promise<{ data: ChatResponse }> => {
    try {
      const response = await apiClient.post(`/api/${userId}/chat`, data);
      return { data: response.data };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get all conversations for a user
  getConversations: async (userId: string): Promise<{ data: Conversation[] }> => {
    try {
      const response = await apiClient.get(`/api/${userId}/conversations`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  getConversationMessages: async (userId: string, conversationId: number): Promise<{ data: Message[] }> => {
    try {
      const response = await apiClient.get(`/api/${userId}/conversations/${conversationId}/messages`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation: async (userId: string, conversationId: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/${userId}/conversations/${conversationId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },
};

export default apiClient;