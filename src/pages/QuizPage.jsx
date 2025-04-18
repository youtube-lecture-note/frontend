// 퀴즈 진행 화면
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import QuizItem from "../components/Quiz/QuizItem";
import AnswerStatus from "../components/Quiz/AnswerStatus";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [wrongAnswer, setWrongAnswer] = useState([]);
  // 로딩, 에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { videoId } = useParams();
  const navigate = useNavigate();

  // 퀴즈 가져오기
  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("accessToken");

      try {
        console.log(`영상 ID로 퀴즈 데이터 요청: ${videoId}`);
        const response = await fetch(`/api/quizzes?videoId=${videoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error(
            `API 응답 실패: ${response.status} ${response.statusText}`
          );
          setError("퀴즈를 가져오는데 실패했습니다");
          setLoading(false);
          return;
        }
        const quizData = await response.json();
        setQuizzes(quizData.data);
      } catch (error) {
        console.error("API 호출 오류:", error);
        setError("퀴즈를 가져오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [videoId]);

  //console.log("퀴즈 데이터:", quizzes);

  // 퀴즈 제출
  async function handleSubmit(answers) {
    const answersArray = Object.values(answers);
    const token = localStorage.getItem("accessToken");
    setWrongAnswer([]);

    try {
      const response = await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answersArray),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("서버 응답:", errorData);
        throw new Error("퀴즈 제출 실패");
      }
      const data = await response.json();
      console.log("퀴즈 제출 성공:", data);

      // wrongAnswer 상태를 안전하게 업데이트
      const receivedWrongAnswers = data.data; // 옵셔널 체이닝 사용
      if (Array.isArray(receivedWrongAnswers)) {
        setWrongAnswer(receivedWrongAnswers);
        console.log("틀린 문제 ID:", receivedWrongAnswers);
      } else {
        setWrongAnswer([]); // 유효한 배열이 아니면 빈 배열로 설정
        console.log("오답 목록 형식이 다르거나 없음");
      }
    } catch (error) {
      console.error("퀴즈 제출 오류:", error);
      setError("퀴즈 제출에 실패했습니다");
      setWrongAnswer([]); // 에러 발생 시 빈 배열로 설정
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
