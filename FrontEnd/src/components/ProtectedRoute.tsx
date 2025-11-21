import { ReactNode } from 'react';
import { Navigate } from './Router';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'member' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth();

  // If not logged in, redirect to home page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to user's appropriate dashboard based on their role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/member" replace />;
    }
  }

  return <>{children}</>;
}
