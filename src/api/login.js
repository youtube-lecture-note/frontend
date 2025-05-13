import { API_CONFIG, API_BASE_URL } from "./config";

export const handleGoogleLogin = async (credentialResponse, isLogin) => {
  // 인증된 상태라면 중복 요청 방지
  if (isLogin) return;

  const idToken = credentialResponse.credential;
  if (idToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
        method: "POST",
        ...API_CONFIG,
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        isLogin(true);
      } else {
        const errorText = await response.text();
        console.error("로그인 실패:", errorText);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  }
};

export const handleLogout = async (isLogin) => {
  // 인증되지 않은 상태라면 중복 요청 방지
  if (!isLogin) return;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      ...API_CONFIG,
    });

    if (response.ok) {
      isLogin(false);
    } else {
      const errorText = await response.text();
      console.error("로그아웃 실패:", errorText);
    }
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};

export const checkAuthStatus = async (isLogin) => {
  try {
    const requestUrl = `${API_BASE_URL}/auth/check`;
    console.log("요청 URL:", requestUrl);
    console.log("인증 상태 확인 요청 시작...");

    // 직접 백엔드 서버로 요청 보내기
    const response = await fetch(requestUrl, {
      ...API_CONFIG,
    });

    console.log("인증 상태 확인 응답:", response.status);

    if (response.ok) {
      isLogin(true);
    } else if (response.status === 401) {
      // 401은 예상된 결과이므로 조용히 처리
      isLogin(false);
    } else {
      console.error("인증 확인 실패:", response.status);
    }
  } catch (error) {
    // 네트워크 오류만 콘솔에 기록
    console.error("인증 확인 중 네트워크 오류:", error);
  }
};
