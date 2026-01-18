import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../features/auth/authService';
import { User, AuthResponse } from '../types';
import { 
  setCredentials, 
  logout as logoutAction, 
  selectCurrentUser, 
  selectIsAuthenticated 
} from '../features/auth/authSlice';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  
  // Read state directly from Redux Store (Single Source of Truth)
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      // Always fetch fresh profile if token exists to ensure roles/permissions are up to date
      if (token) {
        try {
          const userData = await authService.getProfile();
          dispatch(setCredentials({ user: userData, token }));
        } catch (error) {
          console.error("Failed to fetch profile on init", error);
          // Optional: dispatch(logoutAction()) if you want to force logout on invalid token
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [dispatch]); // Removed 'user' dependency to avoid infinite loop, ran once on mount

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      // authService.login now returns the User object directly or throws
      const userData = await authService.login(email, password);
      
      // Dispatch action to Redux
      if (userData.token) {
        dispatch(setCredentials({ user: userData, token: userData.token }));
        return { success: true, user: userData };
      } else {
        return { success: false, error: "No token received" };
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = async () => {
    // Dispatch logout action to Redux (Immediate UI update)
    dispatch(logoutAction());
    
    // Call server-side logout
    await authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
