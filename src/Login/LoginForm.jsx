import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "../components/Button";

export default function LoginForm() {
  const [loginStatus, setLoginStatus] = useState(false);
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      //console.log("Login Success : ", response);
      const token = response.code || response.credential;
      if (token) {
        localStorage.setItem("accessToken", token);
        setLoginStatus(true);
        //console.log("setLoginStatus(true) 직후, loginStatus:", loginStatus);
      } else {
        console.log("토큰을 받지 못했습니다.");
      }
    },
    onError: (error) => console.log("로그인 실패", error),
  });

  const logout = () => {
    setLoginStatus(false);

    localStorage.removeItem("accessToken");

    console.log("Google 로그아웃 완료");
  };

  return (
    <div className="flex items-center bg-gray-100">
      <form className="w-full max-w-md p-1 bg-white ">
        {!loginStatus ? (
          <>
            {/* <p className="mb-1 text-xl font-bold text-center">Login</p> */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                login();
              }}
              className="w-full py-1 px-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </Button>
          </>
        ) : (
          <>
            {/* <p className="mb-1 text-xl font-bold text-center">Logout</p> */}
            <Button
              onClick={() => logout()}
              className="w-full py-1 px-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
