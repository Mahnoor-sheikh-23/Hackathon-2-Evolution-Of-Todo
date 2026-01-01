// Custom authentication client that works with our backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Sign in function
export const signIn = {
  email: async ({ email, password, callbackURL }: { email: string; password: string; callbackURL?: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Using form data format
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Login failed' } };
      }

      // Store the token and user info in localStorage
      localStorage.setItem('better-auth-token', data.access_token);
      localStorage.setItem('user-id', data.user.id);

      if (callbackURL) {
        window.location.href = callbackURL;
      }

      return { user: data.user, token: data.access_token };
    } catch (error) {
      console.error('Login error:', error);
      return { error: { message: 'Login failed' } };
    }
  }
};

// Sign up function
export const signUp = {
  email: async ({ email, password, name, callbackURL }: RegisterData & { callbackURL?: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Registration failed' } };
      }

      // Store the token and user info in localStorage
      localStorage.setItem('better-auth-token', data.access_token);
      localStorage.setItem('user-id', data.user.id);

      if (callbackURL) {
        window.location.href = callbackURL;
      }

      return { user: data.user, token: data.access_token };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: { message: 'Registration failed' } };
    }
  }
};

// Sign out function
export const signOut = async () => {
  try {
    // Clear stored credentials
    localStorage.removeItem('better-auth-token');
    localStorage.removeItem('user-id');

    // Optionally make a server-side logout call
    // await fetch(`${API_BASE_URL}/api/auth/logout`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('better-auth-token')}`
    //   }
    // });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Get session function
export const getSession = async (): Promise<{ user: User; token: string } | null> => {
  try {
    const token = localStorage.getItem('better-auth-token');
    const userId = localStorage.getItem('user-id');

    if (!token || !userId) {
      return null;
    }

    // In a real app, you might want to validate the token with the server
    // For now, we'll return the stored user info
    return {
      user: { id: userId, email: '', name: '' }, // In a real app, fetch user details
      token
    };
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

// Create a helper to get user ID from localStorage
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const userId = localStorage.getItem('user-id');
    return userId;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

// Initialize auth state
export const initializeAuth = async () => {
  try {
    const token = localStorage.getItem('better-auth-token');
    const userId = localStorage.getItem('user-id');

    if (token && userId) {
      return { authenticated: true, user: { id: userId } };
    } else {
      return { authenticated: false, user: null };
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    return { authenticated: false, user: null };
  }
};