import { useState, useEffect, use } from "react";
import Attempts from "./Attempt";
import { fetchYoutubeVideoTitle } from "../../api";

export default function QuizAttemptHistory({ quizAttempts }) {
  const [useQuizAttempts, setUseQuizAttempts] = useState(quizAttempts);
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 모든 비디오 제목을 한번에 가져오기
  useEffect(() => {
    setIsLoading(true);
    //console.log("퀴즈 시도 기록:", quizAttempts);
    const tmpQuizAttempts = [...quizAttempts];
    //console.log("비디오 제목 가져오기 시작", tmpQuizAttempts);
    for (let i = 0; i < tmpQuizAttempts.length; i++) {
      //console.log("비디오 ID:", tmpQuizAttempts[i].youtubeId);
      let tmpTitle = fetchYoutubeVideoTitle(tmpQuizAttempts[i].youtubeId);
      if (tmpTitle) {
        tmpQuizAttempts[i].userVideoName = tmpTitle;
      } else {
        tmpQuizAttempts[i].userVideoName = tmpQuizAttempts[i].youtubeId; // 제목이 없으면 ID로 대체
      }
    }
    setUseQuizAttempts(tmpQuizAttempts);
    setIsLoading(false);
  }, [quizAttempts]);

  console.log("제목 불러와서 합쳐진 기록", useQuizAttempts);

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span>기록 불러오는 중</span>
        </div>
      )}

      {useQuizAttempts.map((attempt, index) => {
        const videoId = Array.isArray(attempt.userVideoId)
          ? attempt.userVideoId[0]
          : attempt.userVideoId;

        return (
          <Attempts
            key={`${attempt.quizSetId}-${index}`}
            attempt={attempt}
            videoId={videoId}
          />
        );
      })}
    </div>
  );
}
