import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'admin';
  phone?: string;
  address?: string;
  age?: number;
  primary_fish_type?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string; age?: number; primary_fish_type?: string }) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: { name?: string; phone?: string; address?: string; age?: number; primary_fish_type?: string; password?: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      console.log('🔍 Init auth check:');
      console.log('  - Token:', token ? 'Ada' : 'TIDAK ADA');
      console.log('  - User:', savedUser ? 'Ada' : 'TIDAK ADA');
      
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Check if token expired
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();
          
          if (isExpired) {
            console.log('❌ Token expired, clearing...');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            console.log('✅ Valid token found, restoring user');
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing saved data:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      console.log('✅ Login response:', response); // Debug
      
      // ✨ PENTING: Simpan token dan user
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        console.log('✅ Token saved:', response.access_token.substring(0, 20) + '...');
      } else {
        console.error('❌ No access_token in response!');
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        console.log('✅ User saved:', response.user);
      }
      
      return {
        success: true,
        message: 'Login berhasil'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal'
      };
    } finally {
      setLoading(false);
    }
  };


  const register = async (data: { name: string; email: string; password: string; phone?: string; address?: string; age?: number; primary_fish_type?: string }) => {
    try {
      const response = await authAPI.register(data);
      
      // UBAH: Tidak auto login, return success message
      return {
        success: true,
        message: response.message || 'Registrasi berhasil. Silahkan masuk dengan akun yang telah dibuat.'
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Registrasi gagal');
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string; address?: string; age?: number; primary_fish_type?: string; password?: string }) => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token dari localStorage:', token ? 'Ada (length: ' + token.length + ')' : 'TIDAK ADA');
      console.log('User dari state:', user);

      if (!token) {
        return {
          success: false,
          message: 'Silahkan login kembali'
        };
      }

      // ✨ ADD: Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token exp:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date());
        
        if (payload.exp * 1000 < Date.now()) {
          console.log('❌ Token expired!');
          logout();
          return {
            success: false,
            message: 'Sesi Anda telah berakhir. Silahkan login kembali'
          };
        }
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
        logout();
        return {
          success: false,
          message: 'Token tidak valid. Silahkan login kembali'
        };
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return {
          success: true,
          message: result.message || 'Profil berhasil diperbarui',
          user: result.user
        };
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        
        // ✨ ADD: Auto logout on auth errors
        if (response.status === 422 || response.status === 401) {
          console.log('Auth error, logging out...');
          logout();
        }
        
        return {
          success: false,
          message: errorData.message || errorData.error || 'Gagal memperbarui profil'
        };
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat memperbarui profil'
      };
    }
  };


  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      login,
      register,
      updateProfile,
      logout,
      loading
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