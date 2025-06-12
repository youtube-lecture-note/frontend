import { API_CONFIG, API_URL } from "./config";

export const handleGoogleLogin = async (credentialResponse, setIsLogin) => {
  try {
    const idToken = credentialResponse.credential;
    const requestUrl = `${API_URL}/auth/google/callback`;

    console.log("로그인 요청 URL:", requestUrl);
    console.log("구글 토큰 정보:", {
      토큰길이: idToken ? idToken.length : 0,
      토큰전체: idToken ? `${idToken}` : "없음",
    });

    const response = await fetch(requestUrl, {
      method: "POST",
      ...API_CONFIG,
      body: JSON.stringify({ idToken }),
    });

    console.log("로그인 응답 상태:", response.status);

    if (response.ok) {
      setIsLogin(true);
      console.log("로그인 성공");
    } else {
      const errorText = await response.text();
      console.error(
        `로그인 실패 (${response.status}):`,
        errorText || "응답 내용 없음"
      );
    }
  } catch (error) {
    console.error("로그인 요청 오류:", error.message);
  }
};

export const handleLogout = async (setIsLogin) => {
  try {
    const requestUrl = `${API_URL}/auth/logout`;
    console.log("로그아웃 요청 URL:", requestUrl);

    const response = await fetch(requestUrl, {
      method: "POST",
      ...API_CONFIG,
    });

    console.log("로그아웃 응답 상태:", response.status);

    if (response.ok) {
      setIsLogin(false);
      console.log("로그아웃 성공");
    } else {
      const errorText = await response.text();
      console.error(
        `로그아웃 실패 (${response.status}):`,
        errorText || "응답 내용 없음"
      );
    }
  } catch (error) {
    console.error("로그아웃 요청 오류:", error.message);
  }
};

export const checkAuthStatus = async (setIsLogin) => {
  try {
    const requestUrl = `${API_URL}/auth/check`;
    console.log("인증 상태 확인 요청 URL:", requestUrl);
    console.log("API_CONFIG:", API_CONFIG);

    const response = await fetch(requestUrl, {
      ...API_CONFIG,
    });

    console.log("인증 상태 확인 응답:", response.status);

    if (response.ok) {
      setIsLogin(true);
      console.log("인증됨: 로그인 상태");
    } else if (response.status === 401) {
      setIsLogin(false);
      console.log("인증 안됨: 로그아웃 상태 (401)");
    } else {
      setIsLogin(false);
      console.error(`인증 확인 실패 (${response.status})`);
    }
  } catch (error) {
    setIsLogin(false);
    console.error("인증 확인 요청 오류:", error.message);
  }
};

export const handleForceLogout = () => {
  localStorage.setItem("isLoggedIn", "false");
};

export const checkAdminStatus = async (setIsAdmin) => {
  try {
    const requestUrl = `${API_URL}/auth/check-admin`;
    console.log("관리자 상태 확인 요청 URL:", requestUrl);
    console.log("API_CONFIG:", API_CONFIG);

    const response = await fetch(requestUrl, {
      ...API_CONFIG,
    });

    console.log("관리자 상태 확인 응답:", response.status);

    if (response.ok) {
      const data = await response.json();
      if (data.isAdmin === true) {
        setIsAdmin(true);
        console.log("관리자: 관리자 상태");
      }
    } else if (response.status === 401) {
      setIsAdmin(false);
      console.log("관리자 아님: 로그아웃 상태 (401)");
    } else {
      setIsAdmin(false);
      console.error(`관리자 확인 실패 (${response.status})`);
    }
  } catch (error) {
    setIsAdmin(false);
    console.error("관리자 확인 요청 오류:", error.message);
  }
};
