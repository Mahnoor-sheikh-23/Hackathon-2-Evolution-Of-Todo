import axios, { AxiosInstance } from 'axios';

// Get the backend URL from environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create an Axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
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
      const response = await apiClient.get(`/${userId}/tasks`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (userId: string, taskData: TaskCreate): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.post(`/${userId}/tasks`, taskData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get a specific task
  getTaskById: async (userId: string, taskId: number): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.get(`/${userId}/tasks/${taskId}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (userId: string, taskId: number, taskData: TaskUpdate): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.put(`/${userId}/tasks/${taskId}`, taskData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Toggle task completion status
  toggleTaskCompletion: async (userId: string, taskId: number): Promise<{ data: Task }> => {
    try {
      const response = await apiClient.patch(`/${userId}/tasks/${taskId}/complete`);
      return { data: response.data };
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (userId: string, taskId: number): Promise<void> => {
    try {
      await apiClient.delete(`/${userId}/tasks/${taskId}`);
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
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, userData: { name?: string; email?: string }): Promise<any> => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
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

export default apiClient;