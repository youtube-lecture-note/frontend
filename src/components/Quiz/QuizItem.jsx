import React from "react";

export default function QuizItem({
  quiz,
  index,
  selectedAnswer,
  onAnswerSelect,
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Q {index + 1}</h2>
      <p className="text-lg mb-4">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((option, oIndex) => (
          <label
            key={oIndex}
            className="flex items-center p-1 rounded-lg hover:bg-gray-50"
          >
            <input
              type="radio"
              name={`question-${index}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => onAnswerSelect(index, e.target.value)}
              className="mr-3"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
