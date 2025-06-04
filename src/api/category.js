import { API_CONFIG, API_URL } from "./config";

// 카테고리 제작
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

  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    return {};
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

  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    return {};
  }
};

//카테고리간 비디오 이동
export const moveCategoryVideo = async (
  fromCategoryId,
  videoID,
  toCategoryId
) => {
  const requestUrl = `${API_URL}/api/categories/${fromCategoryId}/videos/${videoID}/move/${toCategoryId}`;
  const requestBody = { targetCategoryId: toCategoryId };
  const requestOptions = {
    ...API_CONFIG,
    method: "PUT",
    body: JSON.stringify(requestBody),
  };

  console.log(
    `[DEBUG] moveCategoryVideo API 호출:
    URL: ${requestUrl}
    Method: ${requestOptions.method}
    Body: ${JSON.stringify(requestBody)}
    Config: ${JSON.stringify(API_CONFIG)}`
  );

  const response = await fetch(requestUrl, requestOptions);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[DEBUG] 비디오 이동 API 오류 (${response.status}):`, errorText);
    console.error(`[DEBUG] 요청 정보: URL: ${requestUrl}, Method: PUT, Body: ${JSON.stringify(requestBody)}`);
    throw new Error("비디오 이동 실패");
  }

  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    return {};
  }
};

// category에 비디오 추가
export const addVideoToCategory = async (categoryId, videoId, userVideoName = null) => {
  try {
    const params = new URLSearchParams();
    if (userVideoName) {
      params.append('userVideoName', userVideoName);
    }
    
    const url = `${API_URL}/api/categories/${categoryId}/videos/${videoId}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`비디오 추가 실패: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('비디오 카테고리 추가 오류:', error);
    throw error;
  }
};