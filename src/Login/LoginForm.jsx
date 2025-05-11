import { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Button from "../components/Button";
import CLIENT_ID from "./ClientId.jsx";

function LoginForm() {
  const [loginStatus, setLoginStatus] = useState(false);

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("로그인 성공:", credentialResponse);
    const idToken = credentialResponse.credential;

    if (idToken) {
      try {
        const response = await fetch("/auth/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
          credentials: "include", // 쿠키를 포함하기 위해 필요
        });

        if (response.ok) {
          console.log("백엔드 인증 성공");
          setLoginStatus(true);
        } else {
          console.error("백엔드 인증 실패");
        }
      } catch (error) {
        console.error("백엔드 요청 실패:", error);
      }
    } else {
      console.log("ID 토큰을 받지 못했습니다.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-form m-2">
        {!loginStatus ? (
          <div className="google-login-button">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("로그인 실패");
              }}
              useOneTap
            />
          </div>
        ) : (
          <div className="login-success">
            <Button
              onClick={async () => {
                try {
                  const response = await fetch("/auth/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  if (response.ok) {
                    setLoginStatus(false);
                  }
                } catch (error) {
                  console.error("로그아웃 실패:", error);
                }
              }}
              variant="Logout"
            >
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginForm;
// API 요청할 때 credentials: 'include' 추가하기.