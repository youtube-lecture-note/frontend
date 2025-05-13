import { API_CONFIG } from "./config";

// 퀴즈 제출
export const quizSubmitApi = async (answers) => {
  const response = await fetch(`/api/quizzes/submit`, {
    ...API_CONFIG,
    method: "POST",
    body: JSON.stringify(answers),
  });
  if (!response.ok) {
    throw new Error("퀴즈 제출 실패");
  }
  return response.json();
};
