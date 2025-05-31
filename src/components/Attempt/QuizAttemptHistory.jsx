import Attempt from "./Attempt";

export default function QuizAttemptHistory({
  quizAttempts,
  quizAttemptsByVideoIdApi,
  quizAttemptsByQuizSetIdApi,
  quizIdInput,
}) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {quizAttempts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          아직 퀴즈 기록이 없습니다.
        </p>
      ) : (
        <ul className="space-y-2">
          {quizAttempts.map((attempt) => (
            <Attempt key={attempt.quizSetId} attempt={attempt} />
          ))}
        </ul>
      )}
    </div>
  );
}
