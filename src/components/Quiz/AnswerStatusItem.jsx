import React from "react";

export default function AnswerStatusItem({ index, answer }) {
  return (
    <div className="flex items-center space-x-4">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded ${
          answer ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        {index + 1}
      </div>
      <span className={answer ? "text-blue-600" : "text-gray-400"}>
        {answer || "미제출"}
      </span>
    </div>
  );
}
