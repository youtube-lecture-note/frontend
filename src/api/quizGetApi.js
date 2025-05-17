import { API_CONFIG, API_BASE_URL } from "./config";

// 퀴즈 가져오기
export const quizGetApi = async (videoId, difficulty, count) => {
  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(
    `${API_BASE_URL}/api/quizzes?videoId=${videoId}&difficulty=${difficulty}&count=${count}`,
    {
      ...API_CONFIG,
    }
  );

  if (response.status === 403) {
    throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
  }
  if (response.status === 404) {
    throw new Error("영상을 찾을 수 없습니다.");
  }
  if (response.status === 400) {
    throw new Error("퀴즈를 가져오는데 실패했습니다.");
  }
  if (!response.ok) {
    throw new Error("퀴즈를 가져오는데 실패했습니다.");
  }
  return response.json();
};
