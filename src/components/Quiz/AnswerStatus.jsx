import React from "react";
import Button from "../Button";
import AnswerStatusItem from "./AnswerStatusItem";

export default function AnswerStatus({ questions, answers, onSubmit }) {
  return (
    <div className="h-full p-4 flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 mb-2">답안 현황</h3>
        <div className="grid grid-cols-5 gap-1">
          {questions.map((question, index) => (
            <AnswerStatusItem
              key={question.quizId}
              index={index + 1}
              answer={answers[question.quizId]?.userAnswer}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(answers)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md"
        >
          제출
        </Button>
      </div>
    </div>
  );
}
