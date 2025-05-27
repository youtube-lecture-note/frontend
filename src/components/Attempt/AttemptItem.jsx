// 퀴즈로 가져온 개별 문제 1개
export default function AttemptItem({ quiz, index }) {
  let questionStyle = "text-xl font-bold mb-4";
  if (quiz.iscorrect === true) {
    questionStyle += " text-blue-500";
  } else {
    questionStyle += " text-red-500";
  }

  return (
    <div className="p-4 mb-4">
      <h3 className={questionStyle}>
        Q{index + 1}. {quiz.question}
      </h3>
      <p className="text-gray-600 mb-5">
        사용자 답변 : {quiz.userAnswer ? quiz.userAnswer : "제출 안함"}
      </p>
      <p className="text-black mb-2">정답 : {quiz.correctAnswer}</p>
      <p className="text-black">{quiz.comment}</p>
    </div>
  );
}
