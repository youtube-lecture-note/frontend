import { API_CONFIG, API_URL } from "./config";

// 퀴즈셋 결과 조회
export const getQuizSetResults = async (quizSetId) => {
  const response = await fetch(`${API_URL}/api/quizzes/multi/${quizSetId}/results`, {
    ...API_CONFIG,
  });
  
  // 응답 데이터 먼저 파싱
  const responseData = await response.json().catch(() => ({}));

  if (response.status === 403) {
    const error = new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    error.status = 403;
    throw error;
  }
  if (response.status === 404) {
    const error = new Error("퀴즈셋을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  if (response.status === 400) {
    const message = responseData.message || "퀴즈셋 결과를 가져오는데 실패했습니다.";
    const error = new Error(message);
    error.status = 400;
    error.data = responseData;
    throw error;
  }
  if (!response.ok) {
    const error = new Error("퀴즈셋 결과를 가져오는데 실패했습니다.");
    error.status = response.status;
    throw error;
  }
  
  return responseData;
};

// 퀴즈 상세 정보 조회 - 올바른 엔드포인트 사용
export const getQuizDetails = async (quizSetId) => {
  const response = await fetch(`${API_URL}/api/quizsets/${quizSetId}/quizzes`, {
    ...API_CONFIG,
  });
  
  // 응답 데이터 먼저 파싱
  const responseData = await response.json().catch(() => ({}));

  if (response.status === 403) {
    const error = new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    error.status = 403;
    throw error;
  }
  if (response.status === 404) {
    const error = new Error("퀴즈를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  if (response.status === 400) {
    const message = responseData.message || "퀴즈 정보를 가져오는데 실패했습니다.";
    const error = new Error(message);
    error.status = 400;
    error.data = responseData;
    throw error;
  }
  if (!response.ok) {
    const error = new Error("퀴즈 정보를 가져오는데 실패했습니다.");
    error.status = response.status;
    throw error;
  }
  
  return responseData;
};

// 퀴즈셋 생성 API도 동일한 패턴으로 수정
export const createQuizSetByCountsApi = async (videoId, levelCounts) => {
  const response = await fetch(`${API_URL}/api/quizzes/multi/create`, {
    ...API_CONFIG,
    method: 'POST',
    body: JSON.stringify({
      videoId,
      ...levelCounts
    }),
  });

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
    const message = responseData.message || "퀴즈셋을 생성하는데 실패했습니다.";
    const error = new Error(message);
    error.status = 400;
    error.data = responseData;
    throw error;
  }
  if (!response.ok) {
    const error = new Error("퀴즈셋을 생성하는데 실패했습니다.");
    error.status = response.status;
    throw error;
  }
  
  return responseData;
};

export const getAllQuizSets = async () => {
  const response = await fetch(`${API_URL}/api/quizsets/multi`, {
    ...API_CONFIG,
  });
  
  const responseData = await response.json().catch(() => ({}));

  if (response.status === 403) {
    const error = new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    error.status = 403;
    throw error;
  }
  if (!response.ok) {
    const error = new Error("퀴즈셋 목록을 가져오는데 실패했습니다.");
    error.status = response.status;
    throw error;
  }
  
  return responseData;
};
