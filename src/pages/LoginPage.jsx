// pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CLIENT_ID from "../Login/ClientId";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 이미 로그인된 상태면 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(credentialResponse);
      if (success) {
        navigate('/', { replace: true });
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('로그인 과정에서 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              로그인
            </h2>
            <p className="text-gray-600">
              Google 계정으로 로그인하세요
            </p>
          </div>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={(err) => {
                console.error("Google Login Error:", err);
                setError("구글 로그인 과정에서 오류가 발생했습니다");
              }}
              useOneTap
              ux_mode="popup"
            />
          </div>
          
          {loading && (
            <p className="text-center text-sm text-gray-600">로그인 중...</p>
          )}
          
          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
