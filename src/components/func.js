// 영상 입력시 ID부분만 추출하기
export const extractVideoId = (url) => {
  // 입력값 검증
  if (!url || typeof url !== 'string') {
    return null;
  }

  // 다양한 유튜브 URL 패턴을 포괄하는 정규표현식
  const patterns = [
    // youtu.be 단축 링크
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\S+)?/,
    // youtube.com/watch?v=
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:\S+)?/,
    // youtube.com/embed/
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\S+)?/,
    // youtube.com/v/
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:\S+)?/,
    // youtube.com/shorts/
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:\S+)?/,
    // m.youtube.com (모바일)
    /(?:https?:\/\/)?m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:\S+)?/
  ];

  // 각 패턴을 순서대로 확인
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }

  return null;
};