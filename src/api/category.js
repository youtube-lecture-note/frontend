import { API_CONFIG, API_BASE_URL } from "./config";

// 카테고리 제작
export const addCategory = async (category) => {
  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    ...API_CONFIG,
    method: "POST",
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error("카테고리 제작 실패");
  }
  return response.json();
};

// 카테고리 조회
export const getCategory = async () => {
  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    ...API_CONFIG,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("카테고리 조회 실패");
  }
  return response.json();
};
