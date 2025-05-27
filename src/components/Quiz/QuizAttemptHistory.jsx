import Attempt from "./Attempt";

// url 받으면 해당 퀴즈 기록만, 아니라면 전체기록 보여지게
export default function QuizAttemptHistory({
  quizAttempts,
  quizAttemptsByVideoIdApi,
  quizAttemptsByQuizSetIdApi,
  quizIdInput,
}) {
  // if (quizIdInput) {

  return (
    <div className="p-4 overflow-y-auto">
      {quizAttempts.length === 0 ? (
        <p className="text-gray-500">아직 퀴즈 기록이 없습니다.</p>
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
