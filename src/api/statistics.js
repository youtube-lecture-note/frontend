import { API_CONFIG, API_URL } from "./config";

export const getMyStatistics = async () => {
  const response = await fetch(`${API_URL}/api/statistics/user`, {
    ...API_CONFIG,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("통계 조회 실패");
  }

  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    return {};
  }
};

export const getQuizStatistics = async (quizId) => {
  const response = await fetch(
    `${API_URL}/api/statistics/quiz?quizId=${quizId}`,
    {
      ...API_CONFIG,
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("통계 조회 실패");
  }

  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    return {};
  }
};
