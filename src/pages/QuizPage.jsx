// 퀴즈 진행 화면
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import QuizItem from "../components/Quiz/QuizItem";
import AnswerStatus from "../components/Quiz/AnswerStatus";
import { quizGetApi, quizSubmitApi } from "../api";

export default function QuizPage() {
  const [quizSetId, setQuizSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState({});
  // 로딩, 에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { videoId } = useParams();
  const navigate = useNavigate();

  // 퀴즈 요청 이전 설정
  const difficulty = "2";
  const numOfQuestions = 5;

  // 퀴즈 가져오기
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const quizData = await quizGetApi(videoId, difficulty, numOfQuestions);
        console.log("quizData : ", quizData);
        setQuizSetId(quizData.data.quizSetId);
        setQuestions(quizData.data.questions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [videoId, difficulty, numOfQuestions]);

  useEffect(() => {
    const tmpAnswers = {};
    for (const question of questions) {
      tmpAnswers[question.quizId] = {
        quizId: question.quizId,
        userAnswer: null,
      };
    }
    setAnswers(tmpAnswers);
  }, [questions]);

  // 정답 저장
  const handleAnswerSelect = (quizId, userAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [quizId]: {
        quizId: Number(quizId),
        userAnswer: String(userAnswer).trim(),
      },
    }));
  };

  // 퀴즈 제출
  async function handleSubmit(answers) {
    console.log("answers : ", answers);
    setQuizResult({});

    try {
      const receivedWrongAnswers = await quizSubmitApi(answers);
      if (Array.isArray(receivedWrongAnswers)) {
        setQuizResult(receivedWrongAnswers);
      }
    } catch (error) {
      setError(error.message);
      console.error("퀴즈 제출 오류:", error);
      setQuizResult({});
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex min-h-screen flex-1">
        {/* 좌측: 문제 영역 */}
        <div className="w-3/5 p-8 border-r border-gray-300 overflow-y-auto">
          {questions.map((quiz, index) => (
            <QuizItem
              {...quiz}
              key={quiz.id}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={answers[quiz.quizId]?.userAnswer || null}
            />
          ))}
        </div>

        {/* 우측: 답안 현황 및 틀린 문제 영역 - relative 추가 */}
        <div className="w-2/5 p-8 overflow-y-auto relative">
          <AnswerStatus
            questions={questions}
            answers={answers}
            onSubmit={handleSubmit}
          />
          {Object.keys(quizResult).length !== 0 && (
            <div className="absolute bottom-20 left-8 right-8 p-4 z-10">
              <h2 className="text-lg font-semibold mb-2">틀린 문제 ID</h2>
              <p>{Object.keys(quizResult).join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
