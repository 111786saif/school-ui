import api from '../../services/apiClient';
import { User, BackendUser, AuthResponse } from '../../types';

export const authService = {
  // Login function
  login: async (username: string, password: string): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', { username, password });
      
      const { accessToken, user } = response.data;
      
      // Transform backend response to our internal User format
      // We append the token to the user object as our legacy code expects it there sometimes
      const mappedUser: User = {
        ...user,
        token: accessToken,
        name: `${user.first_name} ${user.last_name}` // Derived field for UI compatibility
      };

      // Persist token immediately (redundant if interceptor handles it, but safe)
      localStorage.setItem('token', accessToken);
      
      return mappedUser;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Register function
  register: async (userData: any): Promise<any> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout function
  logout: (): void => {
    localStorage.removeItem('token');
  },
  
  // Get current user profile
  getProfile: async (): Promise<User> => {
     const response = await api.get<BackendUser>('/auth/me');
     const user = response.data;
     
     // Map BackendUser to User
     return {
        ...user,
        name: `${user.first_name} ${user.last_name}`
     };
  }
};
