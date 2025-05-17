// 퀴즈 진행 화면
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import QuizItem from "../components/Quiz/QuizItem";
import AnswerStatus from "../components/Quiz/AnswerStatus";
import { quizGetApi, quizSubmitApi } from "../api";
import Modal from "../components/Modal";
import QuizResultItem from "../components/Quiz/QuizResultItem";

export default function QuizPage() {
  const [quizSetId, setQuizSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  // 로딩, 에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 결과 창 컨트롤
  const [isOpen, setIsOpen] = useState(false);

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
  async function handleSubmit(answers, quizSetId) {
    console.log("answers : ", answers);
    let tmpAnswers = Object.values(answers);
    console.log("tmpAnswers : ", tmpAnswers);
    setQuizResults({});

    const tmpQuizResult = await quizSubmitApi(tmpAnswers, quizSetId);
    setQuizResults(tmpQuizResult.data);
    console.log("tmpQuizResult : ", tmpQuizResult);
    modalControl();
  }

  // 결과 모달창 컨트롤
  const modalControl = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col h-screen relative">
      <TopBar />
      {/* 문제 영역: 화면 대부분 차지 */}
      <div className="flex-1 p-8 overflow-y-auto">
        {questions.map((quiz, index) => (
          <QuizItem
            {...quiz}
            index={index}
            key={quiz.quizId}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={answers[quiz.quizId]?.userAnswer || null}
          />
        ))}
      </div>
      {/* 우측 하단: 답안 현황 + 제출 버튼 (작게, 고정) */}
      <div className="fixed bottom-12 right-12 h-1/5 w-350px bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
        <AnswerStatus
          questions={questions}
          answers={answers}
          onSubmit={() => handleSubmit(answers, quizSetId)}
        />
      </div>
      <Modal isOpen={isOpen} onClose={modalControl} title="결과">
        {quizResults.length > 0 &&
          quizResults.map((quizResult, index) => (
            <div key={quizResult.attemptId}>
              <QuizResultItem quizResult={quizResult} index={index} />
            </div>
          ))}
      </Modal>
    </div>
  );
}
