import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import CLIENT_ID from "./ClientId.jsx";
import { googleLogin, logout, selectAuth } from "../store/slices/authSlice";

function LoginForm() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(selectAuth);

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    if (idToken) {
      try {
        await dispatch(googleLogin(idToken)).unwrap();
      } catch (error) {
        console.error("로그인 실패:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-form m-2">
        {!isAuthenticated ? (
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
            <Button onClick={handleLogout} variant="Logout">
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
