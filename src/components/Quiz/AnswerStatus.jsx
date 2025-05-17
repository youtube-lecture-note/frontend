import React from "react";
import Button from "../Button";
import AnswerStatusItem from "./AnswerStatusItem";

export default function AnswerStatus({ questions, answers, onSubmit }) {
  return (
    <div className="h-screen p-8 flex flex-col">
      <div className="mb-8">
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
        <Button onClick={() => onSubmit(answers)}>제출</Button>
      </div>
    </div>
  );
}
