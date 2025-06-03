import { API_CONFIG, API_URL } from "./config";

// 저작권 영상 확인
export const copyrightCheck = async (videoId) => {
  try {
    // YouTube oEmbed API를 사용하여 제목 가져오기 (API 키 필요 없음)
    const response = await fetch(`${API_URL}/api/copyright/check/${videoId}`, {
      ...API_CONFIG,
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("저작권 확인 API 응답 오류");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch copyright check:", error);
    return null;
  }
};

// 차단 영상 추가
export const addCopyrightVideo = async (videoId, owner) => {
  try {
    // 차단할 영상 정보를 서버에 POST 요청으로 전송
    const token = localStorage.getItem("accessToken");
    const headers = {
      ...(API_CONFIG.headers || {}),
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/copyright/ban`, {
      ...API_CONFIG,
      method: "POST",
      headers: headers,
      body: JSON.stringify({ video_id: videoId, owner: owner }),
    });

    if (!response.ok) {
      // 서버에서 오류 응답 시 (예: 403, 400, 500 등)
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(
        `차단 영상 추가 API 응답 오류: ${response.status} ${errorData.message || ""}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to add copyright video:", error);
    // UI에 표시할 수 있도록 에러 객체 또는 메시지를 반환하는 것을 고려할 수 있습니다.
    // 예를 들어, return { error: error.message };
    return null;
  }
};
