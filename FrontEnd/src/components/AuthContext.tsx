import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  role: 'member' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Seeded Admin Account (hardcoded for internal access)
const ADMIN_ACCOUNT = {
  email: 'admin@temanikan.com',
  password: 'admin123',
  name: 'Super Admin',
  role: 'admin' as const
};

// Mock Member Account for testing
const MEMBER_ACCOUNT = {
  email: 'member@temanikan.com',
  password: '12345678',
  name: 'Ahmad Wijaya',
  role: 'member' as const
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Check if logging in as Admin
    if (email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
      setUser({
        name: ADMIN_ACCOUNT.name,
        email: ADMIN_ACCOUNT.email,
        role: ADMIN_ACCOUNT.role
      });
      return true;
    }
    
    // Check if logging in as Member (demo account)
    if (email === MEMBER_ACCOUNT.email && password === MEMBER_ACCOUNT.password) {
      setUser({
        name: MEMBER_ACCOUNT.name,
        email: MEMBER_ACCOUNT.email,
        role: MEMBER_ACCOUNT.role
      });
      return true;
    }
    
    // In production, this would validate against a real database
    // For now, any other email/password combination will be treated as a new member
    setUser({
      name: email.split('@')[0],
      email: email,
      role: 'member'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}