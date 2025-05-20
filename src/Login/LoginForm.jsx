import { useState, useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Button from "../components/Button";
import CLIENT_ID from "./ClientId.jsx";

import { handleGoogleLogin, handleLogout } from "../api/index.js";

export default function LoginForm() {
  // 로컬스토리지에서 상태 읽기
  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem("isLogin") === "true";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 함수
  const handleLogin = (credentialResponse) => {
    setLoading(true);
    handleGoogleLogin(credentialResponse, (success) => {
      if (success) {
        localStorage.setItem("isLogin", "true");
      }
      setIsLogin(success);
      setLoading(false);
    });
  };

  // 로그아웃 함수
  const handleUserLogout = () => {
    setLoading(true);
    handleLogout(() => {
      localStorage.removeItem("isLogin");
      setIsLogin(false);
      setLoading(false);
    });
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-form m-2">
        {!isLogin ? (
          <div className="google-login-button">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={(err) => {
                console.error("Google Login Error:", err);
                setError("구글 로그인 과정에서 오류가 발생했습니다");
              }}
              useOneTap
              ux_mode="popup"
            />
            {loading && <p className="text-sm mt-2">로그인 중...</p>}
          </div>
        ) : (
          <div className="login-success">
            <Button
              onClick={handleUserLogout}
              variant="Logout"
              disabled={loading}
            >
              {loading ? "처리 중..." : "로그아웃"}
            </Button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </GoogleOAuthProvider>
  );
}

// API 요청할 때 credentials: 'include' 추가하기.
