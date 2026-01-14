import React, { createContext, useContext, ReactNode } from 'react';
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  
  // Read state directly from Redux Store (Single Source of Truth)
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Redux handles initialization via initialState, so loading is practically instant
  // but we keep the flag if you want to add async token validation later.
  const loading = false; 

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

  const logout = () => {
    // Dispatch logout action to Redux
    // Redux slice will handle clearing LocalStorage automatically
    dispatch(logoutAction());
    authService.logout();
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
