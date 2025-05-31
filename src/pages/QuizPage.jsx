// 퀴즈 진행 화면
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import QuizItem from "../components/Quiz/QuizItem";
import AnswerStatus from "../components/Quiz/AnswerStatus";
import { quizGetApi, quizSubmitApi } from "../api/index.js";
import Modal from "../components/Modal";
import QuizResultItem from "../components/Quiz/QuizResultItem";
import Button from "../components/Button";

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

        // 받아온 문제를 quizId 기준으로 정렬하여 저장
        const sortedQuestions = [...quizData.data.questions].sort(
          (a, b) => a.quizId - b.quizId
        );
        setQuestions(sortedQuestions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [videoId, difficulty, numOfQuestions]);

  // useMemo를 사용하여 정렬된 문제 배열 생성 (추가 정렬 로직이 필요할 경우)
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => a.quizId - b.quizId);
  }, [questions]);

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
    // quizId 기준으로 결과 정렬
    const sortedResults = [...tmpQuizResult.data].sort(
      (a, b) => a.quizId - b.quizId
    );
    setQuizResults(sortedResults);
    console.log("tmpQuizResult : ", tmpQuizResult);
    setIsOpen(true);
  }

  // 퀴즈 아이템 렌더링 컴포넌트
  const renderQuizItems = () => {
    return sortedQuestions.map((quiz, index) => (
      <QuizItem
        key={quiz.quizId}
        {...quiz}
        index={index}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={answers[quiz.quizId]?.userAnswer || null}
      />
    ));
  };

  return (
    <div className="flex flex-col h-screen relative bg-gray-50">
      <TopBar />
      <div className="flex-1 p-8 overflow-y-auto">{renderQuizItems()}</div>
      <div className="fixed bottom-12 right-12 h-1/5 w-350px bg-white border border-gray-200 rounded-lg shadow-md p-4 z-50">
        <AnswerStatus
          questions={sortedQuestions}
          answers={answers}
          onSubmit={() => handleSubmit(answers, quizSetId)}
        />
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="결과">
        <div className="flex flex-col">
          <div className="space-y-4 mb-6">
            {quizResults.length > 0 &&
              quizResults.map((quizResult, index) => (
                <div key={quizResult.attemptId || quizResult.quizId}>
                  <QuizResultItem
                    quizResult={quizResult}
                    index={index}
                    originalIndex={sortedQuestions.findIndex(
                      (q) => q.quizId === quizResult.quizId
                    )}
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-end mt-4 gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={() => {
                setIsOpen(false);
                navigate(`/attempts/${quizSetId}`);
              }}
            >
              풀이 보기
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate(`/video/${videoId}`);
              }}
            >
              동영상으로 돌아가기
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate(`/`);
              }}
            >
              처음으로
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
