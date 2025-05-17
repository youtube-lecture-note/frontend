// API 기본 URL 인데 안쓰고, 상대경로로 하고 proxy설정함
export const API_BASE_URL = process.env.REACT_APP_API_URL;

// API 기본 설정
export const API_CONFIG = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};
