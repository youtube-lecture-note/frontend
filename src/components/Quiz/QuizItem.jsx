import Input from "../Input";

export default function QuizItem({
  question,
  options,
  quizId,
  index,
  onAnswerSelect,
  selectedAnswer,
}) {
  let quizType;
  if (options.length === 0) {
    quizType = "SHORT_ANSWER";
  } else {
    quizType = "MULTIPLE_CHOICE";
  }

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Q{index + 1}. {question}
      </h3>

      {/* 객관식 문제 */}
      {quizType === "MULTIPLE_CHOICE" && (
        <div className="space-y-3">
          {options.map((option, idx) => (
            <div key={idx} className="flex items-center">
              <Input
                type="radio"
                id={`choice-${quizId}-${idx}`}
                name={`quiz-${quizId}`}
                value={option}
                variant="MultipleChoiceComponent"
                checked={selectedAnswer === option}
                onChange={() => onAnswerSelect(quizId, option)}
              />
              <label
                htmlFor={`choice-${quizId}-${idx}`}
                className={`flex-1 p-2 rounded-md ${
                  selectedAnswer === option
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer transition-colors`}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* 주관식 문제 */}
      {quizType === "SHORT_ANSWER" && (
        <div className="mt-4">
          <Input
            type="text"
            placeholder="답변을 입력하세요"
            variant="ShortAnswer"
            value={selectedAnswer || ""}
            onChange={(e) => onAnswerSelect(quizId, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
