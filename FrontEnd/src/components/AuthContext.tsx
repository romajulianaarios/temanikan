import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';

// ✅ TOKEN & USER Storage Utility (Session-based per tab)
const TokenStorage = {
  getToken: (): string | null => {
    return sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  },
  
  setToken: (token: string) => {
    sessionStorage.setItem('access_token', token);  // Per tab
    localStorage.setItem('access_token', token);    // Backup persist
  },
  
  removeToken: () => {
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('access_token');
  },

  getUser: (): any | null => {
    const sessionUser = sessionStorage.getItem('user');
    const localUser = localStorage.getItem('user');
    if (sessionUser) return JSON.parse(sessionUser);
    if (localUser) return JSON.parse(localUser);
    return null;
  },
  
  setUser: (user: any) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  removeUser: () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
  }
};


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
      const token = TokenStorage.getToken();                     // ✅ GANTI LINE 1
      const savedUser = TokenStorage.getUser();                  // ✅ GANTI LINE 2
      
      console.log('🔍 Init auth check:');
      console.log('  - Token:', token ? 'Ada' : 'TIDAK ADA');
      console.log('  - User:', savedUser ? 'Ada' : 'TIDAK ADA');
      
      // ✅ STRICT CHECK: Pastikan BOTH token DAN user ada
      if (token && savedUser) {
        try {
          // Validasi format token (harus JWT dengan 3 parts)
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            console.log('❌ Invalid token format, clearing...');
            TokenStorage.removeToken();
            TokenStorage.removeUser();
            setUser(null);
            setLoading(false);
            return;
          }

          // ✅ Check if token expired
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Validasi user object
          if (!savedUser.id || !savedUser.email) {
            console.log('❌ Invalid user object (missing id or email), clearing...');
            TokenStorage.removeToken();
            TokenStorage.removeUser();
            setUser(null);
            setLoading(false);
            return;
          }
          
          // Cek apakah token punya expiry
          if (payload.exp) {
            const isExpired = payload.exp * 1000 < Date.now();
            
            if (isExpired) {
              console.log('❌ Token expired, clearing...');
              TokenStorage.removeToken();
              TokenStorage.removeUser();
              setUser(null);
            } else {
              console.log('✅ Valid token found, restoring user');
              setUser(savedUser);
            }
          } else {
            // Token tidak punya exp claim, validasi user dulu
            if (savedUser.id && savedUser.email) {
              console.log('⚠️ Token without expiry, but user valid - restoring user');
              setUser(savedUser);
            } else {
              console.log('❌ User invalid, clearing...');
              TokenStorage.removeToken();
              TokenStorage.removeUser();
              setUser(null);
            }
          }
        } catch (error) {
          // ✅ ERROR: Jika token tidak bisa di-parse, CLEAR semua data
          console.error('❌ Error parsing token, clearing all auth data:', error);
          TokenStorage.removeToken();
          TokenStorage.removeUser();
          setUser(null);
        }
      } else {
        // ✅ PENTING: Jika tidak ada token ATAU user, pastikan user = null
        console.log('❌ No token or user found, setting user to null');
        setUser(null);
        // Clear storage untuk memastikan tidak ada data lama
        if (!token) {
          TokenStorage.removeToken();
        }
        if (!savedUser) {
          TokenStorage.removeUser();
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Login melalui backend untuk mendapatkan JWT token yang valid
      const response = await authAPI.login(email, password);
      
      console.log('✅ Login response:', response); // Debug
      
      // ✨ PENTING: Simpan token dan user
      if (response.success && response.access_token) {
        TokenStorage.setToken(response.access_token);
        console.log('✅ Token saved:', response.access_token.substring(0, 20) + '...');
        
        if (response.user) {
          TokenStorage.setUser(response.user);
          setUser(response.user);
          console.log('✅ User saved:', response.user);
        }
        
        return {
          success: true,
          message: response.message || 'Login berhasil',
          user: response.user // ✨ Return user data untuk redirect
        };
      } else {
        console.error('❌ No access_token in response!');
        return {
          success: false,
          message: response.message || 'Login gagal. Token tidak diterima dari server.'
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Login gagal. Pastikan backend berjalan di http://localhost:5000'
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
      const token = TokenStorage.getToken();  // ✅ GANTI
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
        TokenStorage.setUser(result.user);  // ✅ GANTI
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
    TokenStorage.removeToken();  // ✅ GANTI LINE 11
    TokenStorage.removeUser();   // ✅ GANTI LINE 12
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