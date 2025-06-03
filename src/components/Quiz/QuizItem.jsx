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

  // 디버깅용 로그 추가
  console.log(`QuizItem ${quizId} - 선택된 답변:`, selectedAnswer);

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
                value={idx.toString()}
                variant="MultipleChoiceComponent"
                // 선택된 답변과 현재 인덱스 비교
                checked={selectedAnswer === idx.toString()}
                onChange={() => {
                  // 인덱스를 문자열로 전달 (QuizPage에서 +1 처리)
                  onAnswerSelect(quizId, idx.toString());
                }}
              />
              <label
                htmlFor={`choice-${quizId}-${idx}`}
                className={`flex-1 p-2 rounded-md ${
                  selectedAnswer === idx.toString()
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
