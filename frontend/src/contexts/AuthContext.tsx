import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'manager' | 'employee';
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User | null };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (username: string, role: 'admin' | 'manager' | 'employee') => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isEmployee: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (username: string, role: 'admin' | 'manager' | 'employee') => {
    const user: User = {
      id: 1, // Mock ID for demo
      username,
      role,
      is_active: true,
    };
    
    localStorage.setItem('auth_token', 'mock_token');
    localStorage.setItem('user_role', role);
    localStorage.setItem('username', username);
    
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    dispatch({ type: 'LOGOUT' });
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    
    const rolePermissions: Record<string, string[]> = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
      manager: ['read', 'write', 'manage_team'],
      employee: ['read', 'write_own'],
    };
    
    return rolePermissions[state.user.role]?.includes(permission) || false;
  };

  const isAdmin = (): boolean => {
    return state.user?.role === 'admin';
  };

  const isManager = (): boolean => {
    return state.user?.role === 'manager';
  };

  const isEmployee = (): boolean => {
    return state.user?.role === 'employee';
  };

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role') as 'admin' | 'manager' | 'employee';
    const username = localStorage.getItem('username');
    
    if (token && role && username) {
      const user: User = {
        id: 1,
        username,
        role,
        is_active: true,
      };
      dispatch({ type: 'SET_USER', payload: user });
    } else {
      // For demo purposes, auto-login as admin
      login('admin', 'admin');
    }
  }, []);

  const value: AuthContextType = {
    state,
    login,
    logout,
    hasPermission,
    isAdmin,
    isManager,
    isEmployee,
  };

  return (
    <AuthContext.Provider value={value}>
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
