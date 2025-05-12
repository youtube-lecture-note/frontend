import { API_CONFIG, API_BASE_URL } from "./config";

// 영상 요약 가져오기
export const videoSummaryApi = async (videoId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/videos/${videoId}/summary`,
    {
      ...API_CONFIG,
    }
  );
  if (!response.ok) {
    throw new Error("비디오 요약 가져오기 실패");
  }
  return response.json();
};
