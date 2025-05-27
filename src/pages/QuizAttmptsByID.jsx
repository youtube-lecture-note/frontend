import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { quizAttemptsByQuizSetIdApi } from "../api/quiz";

// quizsetid로 접근한 개별 퀴즈 기록
export default function QuizAttmptsByID() {
  const { quizSetId } = useParams();

  const [quizAttempts, setQuizAttempts] = useState([]);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        const data = await quizAttemptsByQuizSetIdApi(quizSetId);
        setQuizAttempts(data);
      } catch (error) {
        console.error("Error fetching quiz attempts:", error);
      }
    };
    fetchQuizAttempts();
  }, [quizSetId]);

  console.log("quizAttempts : ", quizAttempts);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Quiz Attempts by ID</h1>
      <p className="text-lg">
        quizsetid로 퀴즈 기록 가져오기// 미완성
      </p>
      {/* Additional content can be added here */}
    </div>
  );
}
