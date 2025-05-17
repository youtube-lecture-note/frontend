import { API_CONFIG, API_BASE_URL } from "./config";

// 퀴즈 제출
export const quizSubmitApi = async (answers, quizSetId) => {
  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(
    `${API_BASE_URL}/api/quizzes/submit?quizSetId=${quizSetId}`,
    {
      ...API_CONFIG,
      method: "POST",
      body: JSON.stringify(answers),
    }
  );
  if (!response.ok) {
    throw new Error("퀴즈 제출 실패");
  }
  return response.json();
};
