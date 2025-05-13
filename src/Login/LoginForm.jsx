import { useState, useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Button from "../components/Button";
import CLIENT_ID from "./ClientId.jsx";
import { API_BASE_URL } from "../api/config";

function LoginForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지 로드시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/auth/check", {
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // 401은 예상된 결과이므로 조용히 처리
        setIsAuthenticated(false);
      } else {
        console.error("인증 확인 실패:", response.status);
      }
    } catch (error) {
      // 네트워크 오류만 콘솔에 기록
      console.error("인증 확인 중 네트워크 오류:", error);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    // 이미 로딩 중이거나 인증된 상태라면 중복 요청 방지
    if (loading || isAuthenticated) return;

    const idToken = credentialResponse.credential;
    if (idToken) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/auth/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          const errorText = await response.text();
          setError(errorText || "로그인에 실패했습니다");
        }
      } catch (error) {
        setError(error.message);
        console.error("로그인 실패:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    // 이미 로딩 중이거나 인증되지 않은 상태라면 중복 요청 방지
    if (loading || !isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(false);
      } else {
        const errorText = await response.text();
        setError(errorText || "로그아웃에 실패했습니다");
      }
    } catch (error) {
      setError(error.message);
      console.error("로그아웃 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-form m-2">
        {!isAuthenticated ? (
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

export default LoginForm;
// API 요청할 때 credentials: 'include' 추가하기.
