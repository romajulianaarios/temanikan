import { useState } from 'react';
import { useNavigate } from './Router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logo from '../assets/logo_temanikan.png';

export default function Login() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect based on user type
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/member');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F3F3E0' }}>
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'white' }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={logo} alt="Temanikan Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl" style={{ color: '#133E87' }}>temanikan</span>
          </div>

          <h2 className="text-center mb-6" style={{ color: '#133E87' }}>
            Login ke Akun Anda
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nama@email.com" 
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isAdmin" 
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="isAdmin" className="cursor-pointer">
                Login sebagai Admin
              </Label>
            </div>

            <Button 
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: '#133E87' }}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm hover:opacity-80" style={{ color: '#608BC1' }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
