import AttemptItemStatistics from "../Attempt/AttemptItemStatistics";

// 퀴즈 결과 세부내용
// 퀴즈 기록, 퀴즈셋 관리의 문제 목록에서 사용
export default function QuizResultDetailItem({
  quiz,
  index,
  userAnswer = null,
  idAttribute = null,
  showStatistics = false,
  showPercent = true,
}) {
  // user 선택이 없는경우 별도 표시하지 않음

  let quizId = quiz.id;
  if (idAttribute === "quizId") {
    // quizId가 아닌 quizId 속성을 사용해야 하는 경우
    quizId = quiz.quizId;
  }

  let nonSelectiveStyle = "ml-2";
  if (quiz.isCorrect) {
    nonSelectiveStyle += " text-green-600 font-medium";
  } else {
    nonSelectiveStyle += " text-red-600";
    //console.log("QuizResultDetailItem props:", quiz, index);
  }

  return (
    <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
      <div className="mb-3">
        <div className="flex items-start mb-2">
          <div className="font-bold mr-2 text-gray-700">
            문제 {index + 1} :{/* (ID: {quizId}) */}
          </div>
        </div>

        <p className="text-gray-700 mt-1 font-semibold">{quiz.question}</p>
      </div>

      {quiz.selective && quiz.options && (
        <div className="mb-3">
          {/* <span className="font-semibold text-gray-700">선택지:</span> */}
          <ul className="mt-1 ml-1">
            {quiz.options.map((option, optionIndex) => (
              <li
                key={optionIndex}
                className={`text-sm ${
                  (optionIndex + 1).toString() === quiz.correctAnswer
                    ? "text-green-600 font-medium"
                    : userAnswer &&
                      (optionIndex + 1).toString() === quiz.userAnswer
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {optionIndex + 1}. {option}
                {(optionIndex + 1).toString() === quiz.correctAnswer && " ✓"}
                {userAnswer &&
                  !quiz.isCorrect &&
                  (optionIndex + 1).toString() === quiz.userAnswer &&
                  " ❌"}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!quiz.selective && userAnswer && (
        <div className="mb-3">
          <span className="font-semibold text-gray-700">사용자 답변:</span>
          <span className={nonSelectiveStyle}>
            {quiz.userAnswer ? quiz.userAnswer : "제출 안함"}{" "}
            {quiz.isCorrect ? "✓" : "❌"}
          </span>
        </div>
      )}
      <div className="mb-3">
        <span className="font-semibold text-gray-700">정답:</span>
        <span className="ml-2 text-green-600 font-medium">
          {quiz.selective ? `${quiz.correctAnswer}번` : quiz.correctAnswer}
        </span>
      </div>
      {quiz.comment && (
        <div className="mb-3">
          <span className="font-semibold text-gray-700">해설:</span>
          <p className="text-gray-600 text-sm mt-1">{quiz.comment}</p>
        </div>
      )}
      {showStatistics && (
        <AttemptItemStatistics quizId={quizId} showPercent={showPercent} />
      )}
    </div>
  );
}
