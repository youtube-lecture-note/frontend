import { API_CONFIG, API_URL } from "./config";

// 저작권 영상 확인
export const copyrightCheck = async (videoId) => {
  try {
    // YouTube oEmbed API를 사용하여 제목 가져오기 (API 키 필요 없음)
    const response = await fetch(`${API_URL}/api/copyright/check/${videoId}`, {
      ...API_CONFIG,
      method: "GET",
    });

    if (!response.ok&&response.status!==409) {
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
export const addCopyrightVideo = async (videoId, owner, callback) => {
  try {
    const token = localStorage.getItem("accessToken");
    const headers = {
      ...(API_CONFIG.headers || {}),
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/api/copyright/ban?videoId=${videoId}&owner=${owner}`,
      {
        ...API_CONFIG,
        method: "POST",
        headers: headers,
        // body는 제거 (데이터를 URL 파라미터로 전달)
      }
    );

    if (!response.ok) {
      // 서버에서 오류 응답 시 (예: 403, 400, 500 등)
      console.log("response", response);
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      console.log("errorData", errorData);
      const errorMessage = `차단 영상 추가 API 응답 오류: ${response.status} ${
        errorData.message || ""
      }`;
      if (callback) callback(new Error(errorMessage));
      return;
    }

    if (callback) callback(null); // 성공
  } catch (error) {
    console.error("Failed to add copyright video:", error);
    if (callback) callback(error); // try-catch 블록에서 잡힌 네트워크 오류 등
  }
};

export const fetchBanList = async () => {
  try {
    const response = await fetch(`${API_URL}/api/copyright`, {
      ...API_CONFIG,
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("밴 리스트 API 응답 오류");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch ban list:", error);
    return null;
  }
};