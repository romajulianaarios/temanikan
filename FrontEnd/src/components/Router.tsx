import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    // Prevent full page reload if already on path
    if (path === window.location.pathname) {
      return;
    }
    
    // Update browser history
    window.history.pushState({}, '', path);
    
    // Update state to trigger re-render
    setCurrentPath(path);
    
    // Scroll to top on navigation (optional, comment out if not needed)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const params = {};

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Router = BrowserRouter;

export const Routes = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('Routes must be used within a Router');

  const childrenArray = React.Children.toArray(children);
  
  // First try to find exact matches or parameterized matches
  for (const child of childrenArray) {
    if (React.isValidElement(child) && child.type === Route) {
      const { path, element } = child.props;
      
      if (path !== '*' && matchPath(path, context.currentPath)) {
        const params = extractParams(path, context.currentPath);
        return <ParamsProvider params={params}>{element}</ParamsProvider>;
      }
    }
  }

  // Then try wildcard matches
  for (const child of childrenArray) {
    if (React.isValidElement(child) && child.type === Route) {
      const { path, element } = child.props;
      
      if (path === '*') {
        return <>{element}</>;
      }
    }
  }
  
  return null;
};

// Helper component to provide params
const ParamsContext = createContext<Record<string, string>>({});

const ParamsProvider = ({ params, children }: { params: Record<string, string>; children: React.ReactNode }) => {
  return (
    <ParamsContext.Provider value={params}>
      {children}
    </ParamsContext.Provider>
  );
};

export const useParams = <T extends Record<string, string> = Record<string, string>>(): T => {
  return useContext(ParamsContext) as T;
};

export const useNavigate = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useNavigate must be used within a Router');
  return context.navigate;
};

export const useLocation = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useLocation must be used within a Router');
  return { pathname: context.currentPath };
};

export const Link = ({ to, children, className, onClick, ...props }: { 
  to: string; 
  children: React.ReactNode; 
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any 
}) => {
  const context = useContext(RouterContext);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Navigate
    if (context) {
      context.navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

function matchPath(pattern: string, path: string): boolean {
  // Handle wildcard paths like /member/* or /admin/*
  if (pattern.endsWith('/*')) {
    const basePattern = pattern.slice(0, -2);
    return path === basePattern || path.startsWith(basePattern + '/');
  }

  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) {
    return false;
  }

  return patternParts.every((part, i) => {
    return part.startsWith(':') || part === pathParts[i];
  });
}

function extractParams(pattern: string, path: string): Record<string, string> {
  const params: Record<string, string> = {};
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  patternParts.forEach((part, i) => {
    if (part.startsWith(':')) {
      params[part.slice(1)] = pathParts[i];
    }
  });

  return params;
}

export const Route = ({ element }: { path: string; element: React.ReactNode }) => {
  return <>{element}</>;
};

export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
  const context = useContext(RouterContext);
  
  useEffect(() => {
    if (context) {
      if (replace) {
        window.history.replaceState({}, '', to);
      }
      context.navigate(to);
    }
  }, [to, context, replace]);

  return null;
};