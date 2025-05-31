export default function QuizResultItem({ quizResult, index }) {
  let resultStyle = "mb-2 font-bold ";
  if (quizResult.iscorrect) {
    resultStyle += "text-green-600";
  } else {
    resultStyle += "text-red-600";
  }

  return (
    <div className="mb-4 p-5 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        Q{index + 1}. {quizResult.questionText}
      </h3>
      <p className={resultStyle}>
        {quizResult.iscorrect ? "정답입니다!" : "틀렸습니다!"}
      </p>
      <div className="mb-2">
        <span className="text-gray-700 font-medium">제출:</span>{" "}
        <span className="text-gray-800">
          {quizResult.userAnswer || "(제출 안함)"}
        </span>
      </div>
    </div>
  );
}
