import { useState, useEffect } from 'react';
import { useNavigate } from './Router';
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft } from './icons';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: 'login' | 'register';
  redirectTo?: string;
}

type ModalView = 'login' | 'register';

// Password Input Component with Validation
interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  showValidation?: boolean;
}

function PasswordInput({ id, label, placeholder = '••••••••', value, onChange, required = true, showValidation = true }: PasswordInputProps) {
  const [hasBlurred, setHasBlurred] = useState(false);
  const isValid = value.length >= 8 || value.length === 0;
  const showError = showValidation && hasBlurred && !isValid;

  return (
    <div>
      <Label htmlFor={id} className="mb-3 block">{label}</Label>
      <Input 
        id={id} 
        type="password" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setHasBlurred(true)}
        required={required}
        minLength={8}
        className={showError ? 'border-red-300' : ''}
      />
      {showError && (
        <p className="text-xs text-red-500 mt-1">
          Minimal 8 karakter
        </p>
      )}
    </div>
  );
}

export default function AuthModal({ open, onOpenChange, initialMode = 'login', redirectTo }: AuthModalProps) {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const [currentView, setCurrentView] = useState<ModalView>('login');
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Member registration form state
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberConfirmPassword, setMemberConfirmPassword] = useState('');

  useEffect(() => {
    if (open) {
      setCurrentView(initialMode === 'register' ? 'register' : 'login');
    }
  }, [open, initialMode]);

  // Handle redirect after successful login
  useEffect(() => {
    if (pendingRedirect && user) {
      // Navigate based on role and redirect preference
      if (redirectTo) {
        navigate(redirectTo);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/member');
      }
      
      setPendingRedirect(false);
      onOpenChange(false);
      resetModal();
    }
  }, [user, pendingRedirect, redirectTo, navigate, onOpenChange]);

  const resetModal = () => {
    setCurrentView('login');
    setLoginEmail('');
    setLoginPassword('');
    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    setMemberPassword('');
    setMemberConfirmPassword('');
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call login function from AuthContext
      const success = await login(loginEmail, loginPassword);
      
      if (success) {
        // Set pending redirect to trigger useEffect after user state updates
        setPendingRedirect(true);
      } else {
        alert('Email atau password salah');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (memberPassword !== memberConfirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok');
      return;
    }
    
    // Validate password length
    if (memberPassword.length < 8) {
      alert('Password harus minimal 8 karakter');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call register function from AuthContext
      const success = await register({
        name: memberName,
        email: memberEmail,
        password: memberPassword,
        phone: memberPhone
      });
      
      if (success) {
        // Set pending redirect to trigger useEffect after user state updates
        setPendingRedirect(true);
      } else {
        alert('Gagal mendaftar. Email mungkin sudah terdaftar.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="login-email" className="mb-3 block">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-password" className="mb-3 block">Password</Label>
                <Input 
                  id="login-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-4 h-4"
                />
                <Label htmlFor="remember" className="cursor-pointer text-sm">
                  Ingat saya
                </Label>
              </div>

              <Button 
                type="submit"
                className="w-full text-white bg-primary-gradient"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setCurrentView('register')}
                className="text-sm hover:underline"
                style={{ color: '#608BC1' }}
              >
                Belum punya akun? Daftar di sini.
              </button>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="space-y-4">
            <button
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-2 text-sm hover:underline mb-2"
              style={{ color: '#608BC1' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <form onSubmit={handleMemberRegister} className="space-y-5">
              <div>
                <Label htmlFor="nama-lengkap" className="mb-3 block">Nama Lengkap</Label>
                <Input 
                  id="nama-lengkap" 
                  type="text" 
                  placeholder="Masukkan nama lengkap"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-email" className="mb-3 block">Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  placeholder="nama@email.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="nomor-hp" className="mb-3 block">Nomor HP</Label>
                <Input 
                  id="nomor-hp" 
                  type="tel" 
                  placeholder="+62 812 3456 7890"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  required
                />
              </div>

              <PasswordInput 
                id="register-password"
                label="Password"
                value={memberPassword}
                onChange={setMemberPassword}
              />

              <PasswordInput 
                id="confirm-password"
                label="Konfirmasi Password"
                value={memberConfirmPassword}
                onChange={setMemberConfirmPassword}
              />

              <Button 
                type="submit"
                className="w-full text-white bg-primary-gradient"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Daftar Sekarang'}
              </Button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setCurrentView('login')}
                className="text-sm hover:underline"
                style={{ color: '#608BC1' }}
              >
                Sudah punya akun? Login di sini.
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetModal();
    }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto glass-modal">
        <DialogHeader>
          <DialogTitle style={{ color: '#133E87' }}>Selamat Datang di Temanikan</DialogTitle>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}