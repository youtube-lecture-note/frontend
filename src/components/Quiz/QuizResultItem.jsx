export default function QuizResultItem({
  quizResult,
  index,
  originalIndex,
  questionItem,
}) {
  let resultStyle = "text-lg font-bold mb-2 ";
  if (quizResult.correct) {
    resultStyle += "text-blue-600";
  } else {
    resultStyle += "text-red-600";
  }
  console.log("quizitem : ", questionItem, originalIndex);

  let myAnswer = null;

  if (questionItem.options.length > 0) {
    // 객관식인 경우
    myAnswer = (
      <div>
        {questionItem.options.map((option, idx) => (
          <div
            key={idx}
            className={`m-2 p-2 border rounded-md ${
              Number(quizResult.userAnswer) - 1 === idx
                ? "bg-gray-400 border-gray-200 text-black" // Not selected (Gray)
                : "bg-gray-100 border-gray-200 text-black" // Not selected (Gray)
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    );
  } else {
    // 주관식인 경우
    myAnswer = (
      <div className="m-2 p-2 border border-gray-200 rounded-md p-2 bg-gray-100">
        {quizResult.userAnswer ? quizResult.userAnswer : "제출 안함"}
      </div>
    );
  }

  return (
    <div className="mb-4 p-5 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className={resultStyle}>
        Q{index + 1}. {quizResult.questionText}
      </h3>
      {myAnswer}
    </div>
  );
}
