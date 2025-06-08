// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { handleGoogleLogin, handleLogout, checkAuthStatus, checkAdminStatus } from '../api/login';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 인증 상태 확인
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      await checkAuthStatus(setIsAuthenticated);
      // 로그인되어 있다면 관리자 상태도 확인
      if (isAuthenticated) {
        await checkAdminStatus(setIsAdmin);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const login = async (credentialResponse) => {
    try {
      await handleGoogleLogin(credentialResponse, setIsAuthenticated);
      // 로그인 성공 시 관리자 상태도 확인
      if (isAuthenticated) {
        await checkAdminStatus(setIsAdmin);
      }
      return isAuthenticated;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await handleLogout(setIsAuthenticated);
      setIsAdmin(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // isAuthenticated가 변경될 때마다 관리자 상태 확인
  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus(setIsAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        isAdmin,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
