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
    console.error(
      `[DEBUG] 비디오 이동 API 오류 (${response.status}):`,
      errorText
    );
    console.error(
      `[DEBUG] 요청 정보: URL: ${requestUrl}, Method: PUT, Body: ${JSON.stringify(
        requestBody
      )}`
    );
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

// category에 비디오 추가 - 토큰 문제 해결을 위한 수정
export const addVideoToCategoryApi = async (
  categoryId,
  videoId,
  userVideoName = null
) => {
  try {
    const url = new URL(
      `${API_URL}/api/categories/${categoryId}/videos/${videoId}`
    );
    if (userVideoName) {
      url.searchParams.append("userVideoName", userVideoName.toString());
    }

    const response = await fetch(url.toString(), {
      ...API_CONFIG,
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`비디오 추가 실패: ${response.status} - ${errorText}`);
      throw new Error(`비디오 추가 실패: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("비디오 카테고리 추가 오류:", error);
    throw error;
  }
};

// 카테고리 ID로 카테고리 정보 가져오기
export const getCategoryById = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
      ...API_CONFIG,
      method: "GET",
    });

    if (!response.ok) {
      console.error(`[DEBUG] 카테고리 정보 조회 실패: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[DEBUG] 카테고리 정보 조회 중 오류:", error);
    return null;
  }
};

// 비디오가 이미 카테고리에 저장되어 있는지 확인
export const checkVideoInCategories = async (videoId) => {
  try {
    console.log(`[DEBUG] 비디오 존재 확인 시작: videoId=${videoId}`);

    // 1. 모든 카테고리 데이터 가져오기
    const allCategories = await getCategory();
    console.log(
      `[DEBUG] 카테고리 데이터 로드 완료: ${allCategories.length}개 카테고리`
    );

    // 2. 비디오가 저장된 카테고리 찾기
    const savedCategories = [];

    // 재귀적으로 모든 카테고리와 하위 카테고리를 검색하는 함수
    const searchVideoInCategory = (category) => {
      // 현재 카테고리의 비디오 확인
      if (category.videos && category.videos.length > 0) {
        const foundVideo = category.videos.find(
          (video) => video.videoId === videoId
        );

        if (foundVideo) {
          savedCategories.push({
            categoryId: category.id,
            categoryName: category.name,
            userVideoName: foundVideo.userVideoName,
          });
        }
      }

      // 하위 카테고리 검색
      if (category.children && category.children.length > 0) {
        category.children.forEach((child) => searchVideoInCategory(child));
      }
    };

    // 모든 루트 카테고리에서 검색 시작
    allCategories.forEach((category) => searchVideoInCategory(category));

    // 3. 결과 반환
    const result = {
      exists: savedCategories.length > 0,
      categories: savedCategories,
    };

    console.log(
      `[DEBUG] 비디오 존재 확인 완료: exists=${result.exists}, 발견된 카테고리=${result.categories.length}개`
    );
    if (result.exists) {
      console.log(`[DEBUG] 비디오가 저장된 카테고리 목록:`, result.categories);
    }

    return result;
  } catch (error) {
    console.error("[DEBUG] 비디오 존재 확인 중 오류 발생:", error);
    return { exists: false, categories: [] };
  }
};
