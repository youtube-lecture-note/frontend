// API 기본 URL
export let API_BASE_URL = "https://cpyt.sytes.net:444/";

const local = true;

if (local) {
  API_BASE_URL = "http://localhost:8888";
}

// API 기본 설정
export const API_CONFIG = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};
