import React from "react";
import Button from "../Button";
import AnswerStatusItem from "./AnswerStatusItem";

export default function AnswerStatus({
  quizzes,
  answers,
  onSubmit,
  wrongAnswers,
}) {
  return (
    <div className="h-screen p-8 flex flex-col">
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">답</h3>
        <div className="grid grid-cols-5 gap-1">
          {/*quizzes.map((_, index) => (
            <AnswerStatusItem
              key={index + 1}
              index={index + 1}
              answer={answers[index + 1]?.userAnswer}
            />
          ))*/}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => onSubmit(answers)}>제출</Button>
      </div>

      {wrongAnswers && wrongAnswers.length !== 0 && (
        <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded">
          <h2 className="text-lg font-semibold mb-2 text-red-700">
            틀린 문제 ID
          </h2>
          <p className="text-red-600">{wrongAnswers.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
