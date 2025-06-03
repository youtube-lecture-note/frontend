// 퀴즈로 가져온 개별 문제 1개
export default function AttemptItem({ quiz, index }) {
  // 디버깅을 위한 콘솔 로그 추가
  console.log("퀴즈 데이터:", quiz);

  let questionStyle = "text-xl font-bold mb-4";

  // 통일된 변수 사용
  if (quiz.isCorrect) {
    questionStyle += " text-blue-700";
  } else {
    questionStyle += " text-red-500";
  }

  let quizContent = null;
  if (quiz.selective) {
    const userAnswerIdx = Number(quiz.userAnswer) - 1;
    const AnswerIdx = Number(quiz.correctAnswer) - 1;

    const selectiveDefault = `flex-1 p-2 rounded-md text-gray-700 bg-gray-200`;
    const AnswerStyle = `flex-1 p-2 rounded-md text-gray-700 bg-blue-400`;
    const userAnswerStyle = `flex-1 p-2 rounded-md text-gray-700 bg-red-200`;

    quizContent = (
      <div className="space-y-3 mb-5">
        {quiz.options.map((option, idx) => (
          <div key={idx} className="flex items-center">
            <span
              className={`${
                idx === AnswerIdx
                  ? AnswerStyle
                  : idx === userAnswerIdx
                  ? userAnswerStyle
                  : selectiveDefault
              }`}
            >
              {option}
            </span>
          </div>
        ))}
      </div>
    );
  } else {
    quizContent = (
      <p className="rounded-md text-gray-700 bg-gray-300 p-2 mb-4">
        {quiz.userAnswer ? quiz.userAnswer : "제출 안함"}
      </p>
    );
  }

  return (
    <div className="p-4 mb-4 bg-white rounded-lg border border-gray-300">
      <h3 className={questionStyle}>
        Q{index + 1}. {quiz.question}
      </h3>
      {quizContent}
      <p className="text-green-800 mb-2">정답 : {quiz.correctAnswer}</p>
      <p className="text-green-700">{quiz.comment}</p>
    </div>
  );
}
