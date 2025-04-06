// 퀴즈 진행 화면
import { useState, useEffect } from "react";
import quizData from "../TmpData/quizData.js";
import TopBar from "../components/TopBar/TopBar";
import QuizItem from "../components/Quiz/QuizItem";
import AnswerStatus from "../components/Quiz/AnswerStatus";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // 보기 섞기
    const shuffled = quizData.map((quiz) => {
      const options = [...quiz.answer];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return { ...quiz, options };
    });
    setQuizzes(shuffled);
  }, []);

  const handleAnswerSelect = (index, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: answer,
    }));
  };

  const handleSubmit = () => {
    const score = quizzes.reduce(
      (acc, quiz, index) => acc + (answers[index] === quiz.answer[0] ? 1 : 0),
      0
    );
    console.log("점수:", score, "/", quizzes.length);
  };

  if (quizzes.length === 0) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1">
        {/* 좌측: 문제 영역 */}
        <div className="w-3/5 p-8 border-r border-gray-300 overflow-y-auto">
          {quizzes.map((quiz, index) => (
            <QuizItem
              key={index}
              quiz={quiz}
              index={index}
              selectedAnswer={answers[index]}
              onAnswerSelect={handleAnswerSelect}
            />
          ))}
        </div>

        {/* 우측: 답안 현황 */}
        <AnswerStatus
          quizzes={quizzes}
          answers={answers}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
