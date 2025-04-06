import { GoogleOAuthProvider } from "@react-oauth/google";
import CLIENT_ID from "./ClientId.jsx";
import LoginForm from "./LoginForm.jsx";

export default function GoogleLogin() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <LoginForm></LoginForm>
    </GoogleOAuthProvider>
  );
}
