import { API_CONFIG, API_URL } from "./config";

// 퀴즈 가져오기
export const quizGetApi = async (videoId, difficulty, count) => {
  const response = await fetch(
    `${API_URL}/api/quizzes?videoId=${videoId}&difficulty=${difficulty}&count=${count}`,
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

// 퀴즈 제출
export const quizSubmitApi = async (answers, quizSetId) => {
  const response = await fetch(
    `${API_URL}/api/quizzes/submit?quizSetId=${quizSetId}`,
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

// 퀴즈 풀이기록 전체 조회
export const quizAttemptsApi = async () => {
  const response = await fetch(`${API_URL}/api/quizzes/attempts/summaries`, {
    ...API_CONFIG,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("퀴즈 풀이기록 전체 조회 실패");
  }
  return response.json();
};

// 퀴즈 풀이기록 영상 id로 조회
export const quizAttemptsByVideoIdApi = async (videoId) => {
  const response = await fetch(
    `${API_URL}/api/quizzes/attempts/videos/${videoId}`,
    {
      ...API_CONFIG,
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("퀴즈 풀이기록 영상 video id로 조회 실패");
  }
  return response.json();
};

// 퀴즈 풀이기록 quizSetId로 조회
export const quizAttemptsByQuizSetIdApi = async (quizSetId) => {
  const response = await fetch(
    `${API_URL}/api/quizzes/attempts/sets/${quizSetId}`,
    {
      ...API_CONFIG,
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("퀴즈 풀이기록 quizSetId로 조회 실패");
  }
  return response.json();
};
