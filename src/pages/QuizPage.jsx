// 퀴즈 진행 화면
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import QuizItem from "../components/Quiz/QuizItem";
import AnswerStatus from "../components/Quiz/AnswerStatus";
import { quizSubmitApi } from "../api/index.js";
import Modal from "../components/Modal";
import QuizResultItem from "../components/Quiz/QuizResultItem";
import Button from "../components/Button";
import ResultBadge from "../components/ResultBadge.jsx";

export default function QuizPage() {
  const [quizSetId, setQuizSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 퀴즈 가져오기
  useEffect(() => {
    async function fetchQuiz() {
      // location.state에서 preloaded된 퀴즈 데이터 확인
      if (location.state?.preloaded && location.state?.quizData) {
        console.log("사전 로드된 퀴즈 데이터 사용:", location.state.quizData);
        const quizData = location.state.quizData;

        setQuizSetId(quizData.data.quizSetId);
        const sortedQuestions = [...quizData.data.questions].sort(
          (a, b) => a.quizId - b.quizId
        );
        setQuestions(sortedQuestions);
        return;
      }
      setError("퀴즈 데이터를 불러올 수 없습니다.");
    }
    fetchQuiz();
  }, [videoId, location.state]);

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

  // 정답 저장 - 객관식일 경우 인덱스에 1을 더해서 저장
  const handleAnswerSelect = (quizId, userAnswer) => {
    // 객관식 답변인지 확인 (숫자 또는 숫자 문자열인 경우)
    const isNumeric = !isNaN(userAnswer) && userAnswer !== "";

    // 객관식인 경우 인덱스에 1을 더함 (0부터 시작하는 인덱스를 1부터 시작하도록)
    const processedAnswer = isNumeric
      ? String(Number(userAnswer) + 1)
      : String(userAnswer);

    console.log(
      `문제 ID: ${quizId}, 원본 답변: ${userAnswer}, 처리된 답변: ${processedAnswer}`
    );

    setAnswers((prev) => ({
      ...prev,
      [quizId]: {
        quizId: Number(quizId),
        userAnswer: processedAnswer,
        // UI 표시용 원본 답변 (객관식에서 필요)
        originalAnswer: userAnswer,
      },
    }));
  };

  // 퀴즈 제출 - 인덱스 처리는 이미 handleAnswerSelect에서 했으므로 여기서는 추가 처리 없음
  async function handleSubmit(answers, quizSetId) {
    console.log("제출할 답변:", answers);
    let tmpAnswers = Object.values(answers);
    console.log("가공된 답변 배열:", tmpAnswers);
    setQuizResults([]);

    try {
      const tmpQuizResult = await quizSubmitApi(tmpAnswers, quizSetId);
      // quizId 기준으로 결과 정렬
      const sortedResults = [...tmpQuizResult.data].sort(
        (a, b) => a.quizId - b.quizId
      );
      setQuizResults(sortedResults);
      console.log("퀴즈 결과:", tmpQuizResult);
      setIsOpen(true);
    } catch (error) {
      console.error("퀴즈 제출 오류:", error);
      setError("퀴즈 제출 중 오류가 발생했습니다.");
    }
  }

  // 퀴즈 아이템 렌더링 컴포넌트
  const renderQuizItems = () => {
    return sortedQuestions.map((quiz, index) => {
      // 객관식인지 여부 확인
      const isMultipleChoice = quiz.options && quiz.options.length > 0;

      return (
        <QuizItem
          key={quiz.quizId}
          {...quiz}
          index={index}
          onAnswerSelect={handleAnswerSelect}
          // 객관식이면 원본 답변을, 아니면 userAnswer 그대로 전달
          selectedAnswer={
            isMultipleChoice
              ? answers[quiz.quizId]?.originalAnswer || null
              : answers[quiz.quizId]?.userAnswer || null
          }
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-screen relative bg-gray-50">
      <TopBar />
      {loading && (
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span>퀴즈 제작중</span>
        </div>
      )}
      <div className="flex-1 p-8 overflow-y-auto">{renderQuizItems()}</div>
      <div className="fixed bottom-12 right-12 h-1/3 w-350px bg-white border border-gray-200 rounded-lg shadow-md p-4 z-50">
        <AnswerStatus
          questions={sortedQuestions}
          answers={answers}
          onSubmit={() => handleSubmit(answers, quizSetId)}
        />
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="결과">
        <div className="flex flex-col">
          <div className="space-y-4 mb-6">
            <ResultBadge
              totalQuiznum={quizResults.length}
              wrongCount={
                quizResults.filter((result) => !result.correct).length
              }
            />
            {quizResults.length > 0 &&
              quizResults.map((quizResult, index) => (
                <div key={quizResult.attemptId || quizResult.quizId}>
                  <QuizResultItem
                    quizResult={quizResult}
                    index={index}
                    originalIndex={sortedQuestions.findIndex(
                      (q) => q.quizId === quizResult.quizId
                    )}
                    questionItem={sortedQuestions[index]}
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
