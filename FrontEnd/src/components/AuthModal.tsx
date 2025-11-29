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

// Success Notification Dialog Component
interface SuccessNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

function SuccessNotification({ open, onClose, message, title = 'Berhasil!' }: SuccessNotificationProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center py-6">
          {/* Success Icon */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: '#E8F5E9' }}>
            <svg 
              className="w-10 h-10" 
              style={{ color: '#4CAF50' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-semibold mb-3" style={{ color: '#133E87' }}>
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-base mb-6" style={{ color: '#608BC1' }}>
            {message}
          </p>
          
          {/* OK Button */}
          <Button 
            onClick={onClose}
            className="px-8 py-2 text-white bg-primary-gradient hover:opacity-90 transition-opacity"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Error Notification Dialog Component
interface ErrorNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

function ErrorNotification({ open, onClose, message, title = 'Perhatian!' }: ErrorNotificationProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center py-6">
          {/* Error Icon */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: '#FFEBEE' }}>
            <svg 
              className="w-10 h-10" 
              style={{ color: '#F44336' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-semibold mb-3" style={{ color: '#133E87' }}>
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-base mb-6" style={{ color: '#608BC1' }}>
            {message}
          </p>
          
          {/* OK Button */}
          <Button 
            onClick={onClose}
            className="px-8 py-2 text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #133E87 0%, #608BC1 100%)' }}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
      <Label htmlFor={id} className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>{label}</Label>
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
        style={{
          borderRadius: '12px',
          border: showError ? '2px solid #F44336' : '2px solid rgba(72, 128, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
        }}
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
  const [internalOpen, setInternalOpen] = useState(open); // Internal state to control dialog
  
  // Success notification state
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Error notification state
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Login error state (for inline error display)
  const [loginError, setLoginError] = useState('');
  const [hasTypedAfterError, setHasTypedAfterError] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Member registration form state
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberAddress, setMemberAddress] = useState('');
  const [memberAge, setMemberAge] = useState('');
  const [memberPrimaryFishType, setMemberPrimaryFishType] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberConfirmPassword, setMemberConfirmPassword] = useState('');

  // Sync internal open state with prop
  useEffect(() => {
    if (open) {
      setInternalOpen(true);
      setCurrentView(initialMode === 'register' ? 'register' : 'login');
    } else if (!loginError) {
      // Only allow closing if there's no login error
      setInternalOpen(false);
    }
  }, [open, initialMode, loginError]);

  // Force dialog to stay open when there's a login error
  useEffect(() => {
    if (loginError && !internalOpen) {
      console.log('🔒 Force reopening dialog due to login error');
      setInternalOpen(true);
    }
  }, [loginError, internalOpen]);

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
    setLoginError('');
    setHasTypedAfterError(false);
    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    setMemberAddress('');
    setMemberAge('');
    setMemberPrimaryFishType('');
    setMemberPassword('');
    setMemberConfirmPassword('');
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(''); // Clear previous errors first
    setHasTypedAfterError(false); // Reset typing state
    
    try {
      console.log('Attempting login with:', loginEmail);
      const result = await login(loginEmail, loginPassword);
      console.log('Login result:', result);
      
      if (result && result.success) {
        // Login successful - prepare for redirect
        console.log('Login successful, setting pending redirect');
        setPendingRedirect(true);
        setIsLoading(false);
        // Wait a bit for user state to update
        setTimeout(() => {
          if (user) {
            if (user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/member');
            }
            onOpenChange(false);
            resetModal();
          }
        }, 100);
      } else {
        // Login failed - show error and stay in form
        console.log('Login failed');
        setLoginError(result?.message || 'Email atau password salah. Silakan coba lagi.');
        setPendingRedirect(false);
        setIsLoading(false);
      }
    } catch (error) {
      // Exception occurred - show error and stay in form
      console.error('Login exception:', error);
      setLoginError('Terjadi kesalahan saat login. Silakan coba lagi.');
      setPendingRedirect(false);
      setIsLoading(false);
    }
  };

  const handleMemberRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (memberPassword !== memberConfirmPassword) {
      setErrorMessage('Password dan Konfirmasi Password tidak cocok');
      setShowErrorNotification(true);
      return;
    }
    
    // Validate password length
    if (memberPassword.length < 8) {
      setErrorMessage('Password harus minimal 8 karakter');
      setShowErrorNotification(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call register function from AuthContext
      const result = await register({
        name: memberName,
        email: memberEmail,
        password: memberPassword,
        phone: memberPhone,
        address: memberAddress,
        age: memberAge ? parseInt(memberAge) : undefined,
        primary_fish_type: memberPrimaryFishType
      });
      
      if (result.success) {
        // Reset form
        setMemberName('');
        setMemberEmail('');
        setMemberPhone('');
        setMemberAddress('');
        setMemberAge('');
        setMemberPrimaryFishType('');
        setMemberPassword('');
        setMemberConfirmPassword('');
        
        // Tampilkan popup sukses
        setSuccessMessage(result.message);
        setShowSuccessNotification(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      setShowErrorNotification(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuccessClose = () => {
    setShowSuccessNotification(false);
    setSuccessMessage('');
    // Redirect ke halaman login setelah menutup popup
    setCurrentView('login');
  };
  
  const handleErrorClose = () => {
    setShowErrorNotification(false);
    setErrorMessage('');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="space-y-4">
            {/* Error Message Display */}
            {loginError && (
              <div 
                className="p-4 rounded-2xl" 
                style={{ 
                  backgroundColor: 'rgba(255, 235, 238, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(244, 67, 54, 0.4)',
                  boxShadow: '0 4px 16px rgba(244, 67, 54, 0.2)'
                }}
              >
                <p className="text-sm font-medium" style={{ color: '#D32F2F' }}>
                  ⚠️ {loginError}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="login-email" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    // Mark that user has typed after error (border will be removed)
                    if (loginError) {
                      setHasTypedAfterError(true);
                    }
                  }}
                  required
                  className={loginError && !hasTypedAfterError ? 'border-red-500 focus:border-red-500' : ''}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
                />
              </div>

              <div>
                <Label htmlFor="login-password" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Password</Label>
                <Input 
                  id="login-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    // Mark that user has typed after error (border will be removed)
                    if (loginError) {
                      setHasTypedAfterError(true);
                    }
                  }}
                  required
                  className={loginError && !hasTypedAfterError ? 'border-red-500 focus:border-red-500' : ''}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
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

              <button 
                type="submit"
                className="w-full bubble-button rounded-full py-3 px-6 font-bold text-white transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #133E87 0%, #608BC1 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(72, 128, 255, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(72, 128, 255, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(72, 128, 255, 0.4)';
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setCurrentView('register')}
                className="text-sm hover:underline transition-all"
                style={{ 
                  color: '#608BC1',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#133E87';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#608BC1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
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
              className="flex items-center gap-2 text-sm hover:underline mb-2 transition-all"
              style={{ 
                color: '#608BC1',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#133E87';
                e.currentTarget.style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#608BC1';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <form onSubmit={handleMemberRegister} className="space-y-5">
              <div>
                <Label htmlFor="nama-lengkap" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Nama Lengkap</Label>
                <Input 
                  id="nama-lengkap" 
                  type="text" 
                  placeholder="Masukkan nama lengkap"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
                />
              </div>

              <div>
                <Label htmlFor="register-email" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  placeholder="nama@email.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
                />
              </div>

              <div>
                <Label htmlFor="nomor-hp" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Nomor HP</Label>
                <Input 
                  id="nomor-hp" 
                  type="tel" 
                  placeholder="+62 812 3456 7890"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
                />
              </div>

              <div>
                <Label htmlFor="alamat" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Alamat</Label>
                <Input 
                  id="alamat" 
                  type="text" 
                  placeholder="Masukkan alamat lengkap"
                  value={memberAddress}
                  onChange={(e) => setMemberAddress(e.target.value)}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
                />
              </div>

              <div>
                <Label htmlFor="usia" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Usia</Label>
                <Input 
                  id="usia" 
                  type="number" 
                  placeholder="Masukkan usia"
                  value={memberAge}
                  onChange={(e) => setMemberAge(e.target.value)}
                  min="1"
                  max="150"
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
                />
              </div>

              <div>
                <Label htmlFor="jenis-ikan" className="mb-3 block" style={{ color: '#133E87', fontWeight: '500' }}>Jenis Ikan Hias Utama</Label>
                <select
                  id="jenis-ikan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={memberPrimaryFishType}
                  onChange={(e) => setMemberPrimaryFishType(e.target.value)}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                  }}
                >
                  <option value="">Pilih jenis ikan</option>
                  <option value="Ikan Koi">Ikan Koi</option>
                  <option value="Ikan Mas Koki">Ikan Mas Koki</option>
                  <option value="Ikan Guppy">Ikan Guppy</option>
                  <option value="Ikan Cupang">Ikan Cupang</option>
                  <option value="Ikan Molly">Ikan Molly</option>
                  <option value="Ikan Neon Tetra">Ikan Neon Tetra</option>
                  <option value="Ikan Discus">Ikan Discus</option>
                  <option value="Ikan Arwana">Ikan Arwana</option>
                  <option value="Ikan Louhan">Ikan Louhan</option>
                  <option value="Ikan Oscar">Ikan Oscar</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
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

              <button 
                type="submit"
                className="w-full bubble-button rounded-full py-3 px-6 font-bold text-white transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #133E87 0%, #608BC1 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(72, 128, 255, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(72, 128, 255, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(72, 128, 255, 0.4)';
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Daftar Sekarang'}
              </button>
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

  // Custom handler that prevents closing when there's an error
  const handleDialogOpenChange = (isOpen: boolean) => {
    console.log('📢 Dialog open change requested:', isOpen, 'loginError:', loginError);
    
    // If trying to close (isOpen = false)
    if (!isOpen) {
      // CRITICAL: Don't allow closing when there's an active login error
      if (loginError) {
        console.log('❌ BLOCKING dialog close - login error active!');
        // Immediately set back to open to prevent close
        setTimeout(() => setInternalOpen(true), 0);
        return; // Don't proceed with close
      }
      // Allow closing if no error
      console.log('✅ Allowing dialog close - no error');
      setInternalOpen(false);
      onOpenChange(false);
      resetModal();
    } else {
      // Allow opening
      console.log('✅ Opening dialog');
      setInternalOpen(true);
      onOpenChange(isOpen);
    }
  };

  return (
    <>
      <Dialog open={internalOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto glass-modal">
          <DialogHeader>
            <DialogTitle style={{ 
              color: '#133E87', 
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              Selamat Datang di Temanikan
            </DialogTitle>
          </DialogHeader>

          {renderContent()}
        </DialogContent>
      </Dialog>

      {/* Success Notification Popup */}
      <SuccessNotification 
        open={showSuccessNotification}
        onClose={handleSuccessClose}
        message={successMessage}
        title="Registrasi Berhasil!"
      />
      
      {/* Error Notification Popup */}
      <ErrorNotification 
        open={showErrorNotification}
        onClose={handleErrorClose}
        message={errorMessage}
      />
    </>
  );
}