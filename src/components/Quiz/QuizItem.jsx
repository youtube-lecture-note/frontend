import React from "react";

export default function QuizItem({
  id,
  question,
  quizType,
  option1,
  option2,
  option3,
  option4,
  correctAnswer,
  timestamp,
  comment,
  onAnswerSelect,
  selectedAnswer,
}) {
  // id에 문제번호, 그다음 question에 문제
  // 주관식은 선택지 보이고 객관식은 input 하도록
  // 나중에 해설때는 여기서 정답표시하고 comment 보여주면 될듯
  return (
    <div className="mb-8">
      <h2 className="text-l font-bold mb-2">
        Q{id}. {question}
      </h2>
      {quizType === "MULTIPLE_CHOICE" && (
        <div>
          <div className="space-y-2">
            <input
              type="radio"
              name={`question-${id}`}
              value={option1}
              checked={selectedAnswer === option1}
              onChange={(e) => onAnswerSelect(id, quizType, e.target.value)}
              className="mr-3"
            />
            {option1}
          </div>
          <div className="space-y-2">
            <input
              type="radio"
              name={`question-${id}`}
              value={option2}
              checked={selectedAnswer === option2}
              onChange={(e) => onAnswerSelect(id, quizType, e.target.value)}
              className="mr-3"
            />
            {option2}
          </div>
          <div className="space-y-2">
            <input
              type="radio"
              name={`question-${id}`}
              value={option3}
              checked={selectedAnswer === option3}
              onChange={(e) => onAnswerSelect(id, quizType, e.target.value)}
              className="mr-3"
            />
            {option3}
          </div>
          <div className="space-y-2">
            <input
              type="radio"
              name={`question-${id}`}
              value={option4}
              checked={selectedAnswer === option4}
              onChange={(e) => onAnswerSelect(id, quizType, e.target.value)}
              className="mr-3"
            />
            {option4}
          </div>
        </div>
      )}
      {quizType === "SHORT_ANSWER" && (
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          type="text"
          value={selectedAnswer}
          onChange={(e) => onAnswerSelect(id, quizType, e.target.value)}
        />
      )}
    </div>
  );
}
