export default function QuizResultItem({ quizResult, index }) {
  let questionStyle = "text-xl font-bold mb-4";
  if (quizResult.correct) {
    questionStyle += " text-blue-500";
  } else {
    questionStyle += " text-red-500";
  }

  return (
    <div className="mb-4">
      <p className={questionStyle}>
        Q{index + 1}. {quizResult.questionText}
      </p>
      <p>사용자 답변: {quizResult.userAnswer}</p>
    </div>
  );
}
