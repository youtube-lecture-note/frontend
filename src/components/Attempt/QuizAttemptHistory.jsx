import { useState } from "react";
import Attempts from "./Attempt";

export default function QuizAttemptHistory({ quizAttempts }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span>기록 불러오는 중</span>
        </div>
      )}

      {quizAttempts.map((attempt, index) => {
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
