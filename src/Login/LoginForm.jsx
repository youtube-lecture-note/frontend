import { useState, useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Button from "../components/Button";
import CLIENT_ID from "./ClientId.jsx";

import {
  checkAuthStatus,
  handleGoogleLogin,
  handleLogout,
} from "../api/login.js";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지 로드시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-form m-2">
        {!isLogin ? (
          <div className="google-login-button">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
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
            <Button onClick={handleLogout} variant="Logout" disabled={loading}>
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
