import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizSetByKeyApi, quizSubmitApi } from "../../api";
import QuizItem from "../../components/Quiz/QuizItem";
import AnswerStatus from "../../components/Quiz/AnswerStatus";
import Modal from "../../components/Modal";
import QuizResultItem from "../../components/Quiz/QuizResultItem";
import Button from "../../components/Button";

export default function QuizMultiPage() {
  const { redisKey } = useParams();
  const [quizSetId, setQuizSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 퀴즈 가져오기
  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      setError("");
      try {
        const quizData = await getQuizSetByKeyApi(redisKey);
        console.log("퀴즈 데이터:", quizData);
        setQuizSetId(quizData.quizSetId);
        const sortedQuestions = [...quizData.questions].sort((a, b) => a.quizId - b.quizId);
        setQuestions(sortedQuestions);
      } catch (e) {
        console.error("퀴즈 로딩 에러:", e);
        setError(e.message || "퀴즈를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    
    if (redisKey) {
      fetchQuiz();
    }
  }, [redisKey]);

  // 답변 초기화
  useEffect(() => {
    if (questions.length > 0) {
      const tmpAnswers = {};
      for (const question of questions) {
        tmpAnswers[question.quizId] = {
          quizId: question.quizId,
          userAnswer: null,
        };
      }
      setAnswers(tmpAnswers);
    }
  }, [questions]);

  // 정렬된 문제들
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => a.quizId - b.quizId);
  }, [questions]);

  // 답변 선택 핸들러 - 객관식 인덱스 처리 추가
  const handleAnswerSelect = useCallback((quizId, userAnswer) => {
    // 객관식 답변인지 확인 (숫자 또는 숫자 문자열인 경우)
    const isNumeric = !isNaN(userAnswer) && userAnswer !== "";

    // 객관식인 경우 인덱스에 1을 더함 (0부터 시작하는 인덱스를 1부터 시작하도록)
    const processedAnswer = isNumeric
      ? String(Number(userAnswer) + 1)
      : String(userAnswer).trim();

    console.log(
      `문제 ID: ${quizId}, 원본 답변: ${userAnswer}, 처리된 답변: ${processedAnswer}`
    );

    setAnswers(prev => ({
      ...prev,
      [quizId]: {
        quizId: Number(quizId),
        userAnswer: processedAnswer,
        // UI 표시용 원본 답변 (객관식에서 필요)
        originalAnswer: userAnswer,
      },
    }));
  }, []);

  // 퀴즈 제출 핸들러
  const handleSubmit = useCallback(async (answersData) => {
    // quizSetId 유효성 검사
    if (!quizSetId) {
      setError("퀴즈 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    console.log("제출할 답변:", answersData);
    console.log("퀴즈 세트 ID:", quizSetId);
    
    try {
      const tmpAnswers = Object.values(answersData);
      console.log("가공된 답변 배열:", tmpAnswers);
      
      // 결과 초기화
      setQuizResults([]);

      const tmpQuizResult = await quizSubmitApi(tmpAnswers, quizSetId);
      console.log("퀴즈 결과:", tmpQuizResult);
      
      // quizId 기준으로 결과 정렬
      const sortedResults = [...tmpQuizResult.data].sort(
        (a, b) => a.quizId - b.quizId
      );
      
      setQuizResults(sortedResults);
      setIsOpen(true);
    } catch (error) {
      console.error("퀴즈 제출 에러:", error);
      setError("퀴즈 제출에 실패했습니다. 다시 시도해주세요.");
    }
  }, [quizSetId]);

  // 퀴즈 아이템 렌더링
  const renderQuizItems = useMemo(() => {
    return sortedQuestions.map((quiz, idx) => {
      // 객관식인지 여부 확인
      const isMultipleChoice = quiz.options && quiz.options.length > 0;

      return (
        <QuizItem
          key={quiz.quizId}
          {...quiz}
          index={idx}
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
  }, [sortedQuestions, answers, handleAnswerSelect]);

  // 로딩 및 에러 처리
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 퀴즈 데이터가 없는 경우
  if (!quizSetId || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">퀴즈 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative bg-gray-50">
      <div className="flex-1 p-8 overflow-y-auto">
        {renderQuizItems}
      </div>
      
      <div className="fixed bottom-12 right-12 h-1/5 w-350px bg-white border border-gray-200 rounded-lg shadow-md p-4 z-50">
        <AnswerStatus
          questions={sortedQuestions}
          answers={answers}
          onSubmit={() => handleSubmit(answers)}
          disabled={!quizSetId || loading}
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
