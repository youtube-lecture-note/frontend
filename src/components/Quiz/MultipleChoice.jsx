import Input from "../Input";

export default function MultipleChoice({
  quizId,
  options,
  selectedAnswer,
  onAnswerSelect,
}) {
  return (
    <div>
      {options.map((option, idx) => (
        <div className="space-y-2" key={idx}>
          <Input
            type="radio"
            name={`question-${quizId}`}
            value={String(idx + 1)}
            checked={selectedAnswer === String(idx + 1)}
            onChange={(e) => onAnswerSelect(quizId, e.target.value)}
            variant="MultipleChoiceComponent"
          />
          {option}
        </div>
      ))}
    </div>
  );
}
