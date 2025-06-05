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

// 교사용: 퀴즈 세트 생성 (키 발급)
export const createQuizSetApi = async (videoId, difficulty, count) => {
  const url = `${API_URL}/api/quizzes/multi/create?videoId=${encodeURIComponent(videoId)}&difficulty=${encodeURIComponent(difficulty)}&count=${encodeURIComponent(count)}`;
  const response = await fetch(url, {
    ...API_CONFIG,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("퀴즈 세트 생성(키 발급) 실패");
  }
  return response.json();
};

// 학생용: 키로 퀴즈 세트 받아오기
export const getQuizSetByKeyApi = async (redisKey) => {
  const url = `${API_URL}/api/quizzes/multi?redisKey=${encodeURIComponent(redisKey)}`;
  const response = await fetch(url, {
    ...API_CONFIG,
    method: "GET",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data; // 전체 응답 반환 (ApiResponse 구조 그대로)
};

// 난이도별 문제 개수 조회
export const getQuizCountByVideoId = async (videoId) => {
  const url = `${API_URL}/api/quizzes/count?videoId=${encodeURIComponent(videoId)}`;
  const response = await fetch(url, {
    ...API_CONFIG,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("퀴즈 카운트 조회 실패");
  }
  return response.json(); // { level1Count, level2Count, level3Count, totalCount }
};

//난이도 다르게 여러 문제 만들기
export const createQuizSetByCountsApi = async (videoId, levelCounts) => {
  const params = new URLSearchParams({
    videoId,
    level1Count: levelCounts.level1,
    level2Count: levelCounts.level2,
    level3Count: levelCounts.level3,
  });
  const url = `${API_URL}/api/quizzes/multi-create?${params.toString()}`;
  const response = await fetch(url, {
    ...API_CONFIG,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("퀴즈 세트 생성 실패");
  }
  return response.json();
};