import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAttemptsByQuizSetIdApi } from "../api/quiz";
import { FaArrowLeft, FaClipboardList } from "react-icons/fa";
import { fetchYoutubeVideoTitle } from "../api/index.js";

import TopBar from "../components/TopBar/TopBar";
import Button from "../components/Button.jsx";
import ResultBadge from "../components/ResultBadge.jsx";
import QuizResultDetailItem from "../components/Quiz/QuizResultDetailItem.jsx";

// quizsetid로 접근한 개별 퀴즈 기록
export default function QuizAttmptsByID() {
  const { quizSetId } = useParams();
  const navigate = useNavigate();

  const [quizAttempts, setQuizAttempts] = useState([]);
  const [videoTitle, setVideoTitle] = useState("퀴즈 풀이 세부 기록");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vidID, setVidID] = useState(null);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      setIsLoading(true);
      try {
        const data = await quizAttemptsByQuizSetIdApi(quizSetId);

        // quizId 기준으로 정렬
        const sortedData = [...data].sort((a, b) => a.quizId - b.quizId);
        setQuizAttempts(sortedData);

        // videoId를 사용해 YouTube에서 직접 제목 가져오기
        if (data && data.length > 0) {
          const videoId = data[0].youtubeId;
          if (videoId) {
            setVidID(videoId);
            const title = await fetchYoutubeVideoTitle(videoId);
            setVideoTitle(title);
          } else {
            setVideoTitle("퀴즈 풀이");
          }
        }
      } catch (error) {
        console.error("Error fetching quiz attempts:", error);
        setError("퀴즈 기록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizAttempts();
  }, [quizSetId]);

  console.log("quizAttempts : ", quizAttempts);

  // 정렬된 퀴즈 시도 기록을 useMemo로 캐싱
  const sortedAttempts = useMemo(() => {
    return [...quizAttempts].sort((a, b) => a.quizId - b.quizId);
  }, [quizAttempts]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        {/* 헤더 영역 */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 mb-4 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> 뒤로 가기
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4 border border-blue-200">
                <FaClipboardList className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {videoTitle}
                </h1>
                <p className="text-sm text-gray-500">퀴즈 ID: {quizSetId}</p>
              </div>
              <div className="ml-4">
                <ResultBadge
                  totalQuiznum={quizAttempts.length}
                  wrongCount={
                    quizAttempts.filter(
                      (attempt) => attempt.isCorrect === false
                    ).length
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-400 mt-4 rounded-full"></div>
        </div>

        {/* 내용 영역 */}
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : sortedAttempts.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <div className="grid gap-6">
              {sortedAttempts.map((quiz, index) => (
                <QuizResultDetailItem
                  key={quiz.id || quiz.quizId || index}
                  quiz={quiz}
                  index={index}
                  userAnswer={true}
                  idAttribute="quizId"
                  showStatistics={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md border border-gray-200">
            <FaClipboardList className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">
              이 퀴즈 세트에 대한 풀이 기록이 없습니다.
            </p>
          </div>
        )}
      </div>
      <div>
        <Button onClick={() => navigate(`/video/${vidID}`)} variant="Pink">
          동영상으로
        </Button>
      </div>
    </div>
  );
}
