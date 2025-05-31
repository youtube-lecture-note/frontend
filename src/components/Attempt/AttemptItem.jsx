// 퀴즈로 가져온 개별 문제 1개
export default function AttemptItem({ quiz, index }) {
  // darkMode prop 제거하고 항상 다크모드로 고정
  let questionStyle = "text-xl font-bold mb-4 text-gray-800";

  if (quiz.iscorrect === true) {
    questionStyle += " text-green-600";
  } else {
    questionStyle += " text-red-600";
  }

  return (
    <div className="p-4 mb-4 bg-white rounded-lg border border-gray-300">
      <h3 className={questionStyle}>
        Q{index + 1}. {quiz.question}
      </h3>
      <p className="text-gray-600 mb-5">
        사용자 답변 : {quiz.userAnswer ? quiz.userAnswer : "제출 안함"}
      </p>
      <p className="text-green-600 mb-2">정답 : {quiz.correctAnswer}</p>
      <p className="text-gray-700">{quiz.comment}</p>
    </div>
  );
}
