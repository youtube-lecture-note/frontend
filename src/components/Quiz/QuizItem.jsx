import MultipleChoice from "./MultipleChoice";
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
    <div className="mb-8">
      <h2 className="text-l font-bold mb-2">
        Q{index + 1}. {question}
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
