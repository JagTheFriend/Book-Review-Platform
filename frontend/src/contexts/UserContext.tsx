
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  return (
    <UserContext.Provider value={{
      currentUser: user,
      setCurrentUser: () => {}, // This is now handled by AuthContext
      isAdmin,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export type { User };
