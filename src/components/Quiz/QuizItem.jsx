import MultipleChoice from "./MultipleChoice";
import Input from "../Input";

export default function QuizItem({
  question,
  options,
  quizId,
  onAnswerSelect,
  selectedAnswer,
}) {
  // id에 문제번호, 그다음 question에 문제
  // 주관식은 선택지 보이고 객관식은 input 하도록
  // 나중에 해설때는 여기서 정답표시하고 comment 보여주면 될듯

  let quizType;
  if (options.length === 0) {
    quizType = "SHORT_ANSWER";
  } else {
    quizType = "MULTIPLE_CHOICE";
  }

  return (
    <div className="mb-8">
      <h2 className="text-l font-bold mb-2">
        Q{quizId}. {question}
      </h2>
      {quizType === "MULTIPLE_CHOICE" && (
        <MultipleChoice
          id={quizId}
          quizId={quizId}
          options={options}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      )}
      {quizType === "SHORT_ANSWER" && (
        <Input
          variant="ShortAnswer"
          value={selectedAnswer}
          onChange={(e) => onAnswerSelect(quizId, e.target.value)}
        />
      )}
    </div>
  );
}
