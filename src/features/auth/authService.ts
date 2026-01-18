import api from '../../services/apiClient';
import { User, BackendUser, AuthResponse, SignUpRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../../types';

export const authService = {
  // Login function
  login: async (username: string, password: string): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', { username, password });
      
      console.log("[AuthService] Login Response:", response.data);

      const { accessToken, user } = response.data;
      
      // Transform backend response to our internal User format
      // We append the token to the user object as our legacy code expects it there sometimes
      const mappedUser: User = {
        ...user,
        token: accessToken,
        name: `${user.first_name} ${user.last_name}` // Derived field for UI compatibility
      };

      console.log("[AuthService] Mapped User:", mappedUser);

      // Persist token immediately (redundant if interceptor handles it, but safe)
      localStorage.setItem('token', accessToken);
      
      return mappedUser;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Register function
  register: async (data: SignUpRequest): Promise<void> => {
    await api.post('/auth/signup', data);
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await api.post('/auth/forgot-password', data);
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post('/auth/reset-password', data);
  },

  // Logout function
  logout: async (): Promise<void> => {
    try {
      // Attempt server-side logout
      await api.post('/auth/signout');
    } catch (error) {
      console.warn("Server logout failed, clearing local session anyway.", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  // Get current user profile
  getProfile: async (): Promise<User> => {
     const response = await api.get<BackendUser>('/auth/me');
     console.log("[AuthService] getProfile Raw Response:", response.data);
     
     const user = response.data;
     const token = localStorage.getItem('token') || undefined;
     
     // Explicitly map fields to ensure nothing is lost
     const mappedUser: User = {
        ...user,
        role: user.role || 'Guest', // Fallback only if strictly missing
        token: token,
        name: `${user.first_name} ${user.last_name}`
     };

     console.log("[AuthService] getProfile Mapped User:", mappedUser);
     return mappedUser;
  }
};
