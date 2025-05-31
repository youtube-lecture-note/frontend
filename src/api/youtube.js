// YouTube 비디오 제목 가져오기 (fetch API 사용)
export const fetchYoutubeVideoTitle = async (videoId) => {
  try {
    // YouTube oEmbed API를 사용하여 제목 가져오기 (API 키 필요 없음)
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!response.ok) {
      throw new Error("YouTube API 응답 오류");
    }

    const data = await response.json();
    return data.title;
  } catch (error) {
    console.error("Failed to fetch video title:", error);
    return "제목을 가져올 수 없음";
  }
};
