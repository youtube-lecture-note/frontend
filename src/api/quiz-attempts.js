import { API_CONFIG, API_BASE_URL } from "./config";

// 퀴즈 풀이기록 전체 조회
export const quizAttemptsApi = async () => {
  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/api/users/me/quiz-attempts`, {
    ...API_CONFIG,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("퀴즈 풀이기록 전체 조회 실패");
  }
  return response.json();
};

// 영상별 풀이기록 조회
export const quizAttemptsByVideoIdApi = async (videoId) => {
  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(
    `${API_BASE_URL}/api/quizzes/${videoId}/quiz-attempts`,
    {
      ...API_CONFIG,
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("영상별 풀이기록 조회 실패");
  }
  return response.json();
};
