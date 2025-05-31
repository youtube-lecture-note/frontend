import { API_CONFIG, API_URL } from "./config";

// 카테고리 제작
//parentID는 선택
// const response = await fetch(`${API_URL}/api/categories`, {
//   ...API_CONFIG,
//   method: "POST",
//   body: JSON.stringify(name),
// });
// if (!response.ok) {
//   throw new Error("카테고리 제작 실패");
// }
// return response.json();
export const addCategory = async (category) => {
  try {
    console.log("요청 데이터:", category);

    const response = await fetch(`${API_URL}/api/categories`, {
      ...API_CONFIG,
      method: "POST",
      body: JSON.stringify(category),
    });

    console.log("응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("응답 에러 메시지:", errorText);
      throw new Error("카테고리 제작 실패");
    }

    const data = await response.json();
    console.log("응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("카테고리 제작 중 오류 발생:", error);
    throw error;
  }
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

// 카테고리 삭제
export const deleteCategory = async (categoryID) => {
  const response = await fetch(`${API_URL}/api/categories/${categoryID}`, {
    ...API_CONFIG,
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("카테고리 삭제 실패");
  }

  // 응답 내용이 있는지 확인
  const text = await response.text();
  if (!text) {
    return {}; // 빈 응답인 경우 빈 객체 반환
  }

  try {
    return JSON.parse(text); // 텍스트를 JSON으로 파싱
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    return {}; // 파싱 실패 시 빈 객체 반환
  }
};

// 카테고리내 영상 삭제
export const deleteCategoryVideo = async (categoryID, videoID) => {
  const response = await fetch(
    `${API_URL}/api/categories/${categoryID}/videos/${videoID}`,
    {
      ...API_CONFIG,
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("카테고리 내 영상 삭제 실패");
  }

  // 응답 내용이 있는지 확인
  const text = await response.text();
  if (!text) {
    return {}; // 빈 응답인 경우 빈 객체 반환
  }

  try {
    return JSON.parse(text); // 텍스트를 JSON으로 파싱
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    return {}; // 파싱 실패 시 빈 객체 반환
  }
};
