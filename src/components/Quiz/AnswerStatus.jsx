import React from "react";
import Button from "../Button";
import AnswerStatusItem from "./AnswerStatusItem";

export default function AnswerStatus({ quizzes, answers, onSubmit }) {
  return (
    <div className="w-2/5 p-8 flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-4">답</h3>
        <div className="space-y-2">
          {quizzes.map((_, index) => (
            <AnswerStatusItem
              key={index}
              index={index}
              answer={answers[index]}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={onSubmit}>제출</Button>
      </div>
    </div>
  );
}
