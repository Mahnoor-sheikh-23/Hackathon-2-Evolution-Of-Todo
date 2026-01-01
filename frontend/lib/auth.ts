// Mock Better Auth configuration for the frontend
// In a real implementation, this would use the actual Better Auth library

class MockAuth {
  private token: string | null = null;
  private user: any = null;

  async signIn(email: string, password: string) {
    // In a real implementation, this would call Better Auth
    // For now, we'll simulate the authentication process
    try {
      // Mock API call to authenticate user
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.user = data.user;

        // Store in localStorage
        localStorage.setItem('better-auth-token', data.token);
        localStorage.setItem('user-id', data.user.id);

        return { success: true, user: data.user };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  }

  async signUp(name: string, email: string, password: string) {
    try {
      // Mock API call to register user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.user = data.user;

        // Store in localStorage
        localStorage.setItem('better-auth-token', data.token);
        localStorage.setItem('user-id', data.user.id);

        return { success: true, user: data.user };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  async signOut() {
    // Clear stored credentials
    localStorage.removeItem('better-auth-token');
    localStorage.removeItem('user-id');
    this.token = null;
    this.user = null;
  }

  isAuthenticated() {
    const token = localStorage.getItem('better-auth-token');
    return !!token;
  }

  getCurrentUser() {
    if (this.isAuthenticated()) {
      const userId = localStorage.getItem('user-id');
      return { id: userId };
    }
    return null;
  }

  getToken() {
    return localStorage.getItem('better-auth-token');
  }
}

export const auth = new MockAuth();