// 퀴즈 진행 화면
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import QuizItem from "../components/Quiz/QuizItem";
import AnswerStatus from "../components/Quiz/AnswerStatus";
import { quizGetApi, quizSubmitApi } from "../api";

export default function QuizPage() {
  const [quizSetId, setQuizSetId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [wrongAnswer, setWrongAnswer] = useState([]);
  // 로딩, 에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { videoId } = useParams();
  const navigate = useNavigate();

  // 퀴즈 요청 이전 설정
  const difficulty = "2";
  const numOfQuestions = 2;

  // 퀴즈 가져오기
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const quizData = await quizGetApi(videoId, difficulty, numOfQuestions);
        setQuizzes(quizData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [videoId]);

  // 퀴즈 제출
  async function handleSubmit(answers) {
    setWrongAnswer([]);

    try {
      const receivedWrongAnswers = await quizSubmitApi(answers);
      if (Array.isArray(receivedWrongAnswers)) {
        setWrongAnswer(receivedWrongAnswers);
      }
    } catch (error) {
      setError(error.message);
      console.error("퀴즈 제출 오류:", error);
      setWrongAnswer([]);
    }
  }

  // 정답 저장 - id를 key로 해서 먼저 담고 제출시 value만
  const handleAnswerSelect = (quizId, quizType, userAnswer) => {
    console.log("답안 선택:", { quizId, quizType, userAnswer });
    setAnswers((prev) => ({
      ...prev,
      [quizId]: {
        quizId: Number(quizId),
        quizType,
        userAnswer: userAnswer.trim(), // 공백 제거
      },
    }));
  };
  console.log("selectedAnswer", answers);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex min-h-screen flex-1">
        {/* 좌측: 문제 영역 */}
        <div className="w-3/5 p-8 border-r border-gray-300 overflow-y-auto">
          {quizzes.map((quiz, index) => (
            <QuizItem
              {...quiz}
              key={quiz.id}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={answers[quiz.id]?.userAnswer}
            />
          ))}
        </div>

        {/* 우측: 답안 현황 및 틀린 문제 영역 - relative 추가 */}
        <div className="w-2/5 p-8 overflow-y-auto relative">
          <AnswerStatus
            quizzes={quizzes}
            answers={answers}
            onSubmit={handleSubmit}
          />
          {wrongAnswer.length !== 0 && (
            <div className="absolute bottom-20 left-8 right-8 p-4 z-10">
              <h2 className="text-lg font-semibold mb-2">틀린 문제 ID</h2>
              <p>{wrongAnswer.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
