import Button from "../Button";

// url 받으면 해당 퀴즈 기록만, 아니라면 전체기록 보여지게
export default function QuizAttemptHistory({ quizAttempts }) {
  const handleViewDetails = (quizSetId) => {
    // 미완성
  };
  return (
    <div className="p-4 overflow-y-auto">
      {quizAttempts.length === 0 ? (
        <p className="text-gray-500">아직 퀴즈 기록이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {quizAttempts.map((attempt) => (
            <li
              key={attempt.quizSetId}
              className="p-3 bg-gray-100 rounded-md shadow"
            >
              <p className="font-semibold text-gray-700">
                {attempt.userVideoName}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(attempt.date).toLocaleString()}{" "}
              </p>
              <p className="text-sm text-gray-500">
                {attempt.totalQuizzes - attempt.wrongCount} /{" "}
                {attempt.totalQuizzes}
              </p>
              <Button
                variant="link"
                onClick={() => handleViewDetails(attempt.quizSetId)}
              >
                상세보기
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
