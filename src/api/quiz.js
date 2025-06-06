import { API_CONFIG, API_URL } from "./config";

// 퀴즈 가져오기
export const quizGetApi = async (videoId, difficulty, count) => {
  const response = await fetch(
    `${API_URL}/api/quizzes?videoId=${videoId}&difficulty=${difficulty}&count=${count}`,
    {
      ...API_CONFIG,
    }
  );

  // 응답 데이터 먼저 파싱
  const responseData = await response.json().catch(() => ({}));

  if (response.status === 403) {
    const error = new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    error.status = 403;
    throw error;
  }
  if (response.status === 404) {
    const error = new Error("영상을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  if (response.status === 400) {
    // 백엔드에서 보낸 실제 메시지 사용
    const message = responseData.message || "퀴즈를 가져오는데 실패했습니다.";
    const error = new Error(message);
    error.status = 400;
    error.data = responseData;
    throw error;
  }
  if (!response.ok) {
    const error = new Error("퀴즈를 가져오는데 실패했습니다.");
    error.status = response.status;
    throw error;
  }
  
  return responseData;
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