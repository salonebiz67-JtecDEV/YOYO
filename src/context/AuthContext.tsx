import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  login: (identifier: string, password?: string) => Promise<User>;
  signup: (data: { username: string; display_name: string; phone?: string; password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('');

  useEffect(() => {
    const session = authService.getCurrentSession();
    setUser(session.user);
    setIsLoading(false);
  }, []);

  const openAuthModal = (reason: string = 'Join YOYO to like, comment, and share videos with Sierra Leone') => {
    setAuthModalReason(reason);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (identifier: string, password?: string): Promise<User> => {
    const loggedInUser = await authService.login(identifier, password);
    setUser(loggedInUser);
    setAuthModalOpen(false);
    return loggedInUser;
  };

  const signup = async (data: { username: string; display_name: string; phone?: string; password?: string }): Promise<User> => {
    const newUser = await authService.signup(data);
    setUser(newUser);
    setAuthModalOpen(false);
    return newUser;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
