import { API_CONFIG, API_URL } from "./config";
import { handleForceLogout } from "./login";

// 영상 요약 가져오기
export const videoSummaryApi = async (videoId) => {
  const response = await fetch(`${API_URL}/api/summary?videoId=${videoId}`, {
    method: "GET",
    ...API_CONFIG,
  });
  if (response.status === 403) {
    handleForceLogout(); // 403일때 로그아웃 처리
    throw new Error(
      "로그인이 필요하거나 권한이 없습니다. 다시 로그인해주세요."
    );
  }
  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || "요청이 잘못되었습니다.";
      throw new Error(errorMessage);
    } else {
      throw new Error("비디오 요약 가져오기 실패");
    }
  }
  return response.json();
};

export const videoSummaryApiPostSubtitle = async (videoId,subtitle) => {
  const response = await fetch(`${API_URL}/api/summary?videoId=${videoId}`, {
    method: "POST",
    ...API_CONFIG,
    body: JSON.stringify(subtitle),
  });
  if (response.status === 403) {
    handleForceLogout(); // 403일때 로그아웃 처리
    throw new Error(
      "로그인이 필요하거나 권한이 없습니다. 다시 로그인해주세요."
    );
  }
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData?.message || 
      (response.status === 400 ? "요청이 잘못되었습니다." : "비디오 요약 가져오기 실패");
    throw new Error(errorMessage);
  }
  return response.json();
};
