import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { quizAttemptsByQuizSetIdApi } from "../api/quiz";

import AttemptItem from "../components/Attempt/AttemptItem";
import TopBar from "../components/TopBar/TopBar";

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
    <>
      <TopBar />
      <div className="flex flex-col h-screen">
        <h1 className="text-2xl font-bold mb-4">풀이 기록</h1>
        {quizAttempts.length > 0 ? (
          <div className="w-full max-w-3xl mt-4">
            {quizAttempts.map((quiz, index) => (
              <AttemptItem key={quiz.id} quiz={quiz} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">풀이 기록이 없습니다.</p>
        )}
      </div>
    </>
  );
}
