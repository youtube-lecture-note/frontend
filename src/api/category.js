import { API_CONFIG, API_URL } from "./config";

// 카테고리 제작
export const addCategory = async (category) => {
  const response = await fetch(`${API_URL}/api/categories`, {
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
  const response = await fetch(`${API_URL}/api/categories`, {
    ...API_CONFIG,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("카테고리 조회 실패");
  }
  return response.json();
};
