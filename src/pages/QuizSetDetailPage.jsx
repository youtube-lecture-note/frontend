// pages/QuizSetDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizSetResults, getQuizDetails } from "../api/quizSet";
import Button from "../components/Button";
import Title from "../components/Title";

export default function QuizSetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState(null);
  const [quizDetails, setQuizDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("results");

  useEffect(() => {
    fetchQuizResults();
  }, [id]);

  const fetchQuizResults = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const results = await getQuizSetResults(id);
      setQuizResults(results);
      
      // 퀴즈 상세 정보 조회
      const details = await getQuizDetails(id);
      setQuizDetails(details);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1: return "쉬움";
      case 2: return "보통";
      case 3: return "어려움";
      default: return "설정되지 않음";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 퀴즈 ID로 상세 정보 찾기
  const getQuizDetailById = (quizId) => {
    return quizDetails.find(quiz => quiz.id === quizId);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Title>퀴즈셋 상세 정보</Title>
        <div className="text-center py-8">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Title>퀴즈셋 상세 정보</Title>
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
        <Button onClick={() => navigate(-1)} classNameAdd="btn btn-secondary">
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Title>퀴즈셋 상세 정보</Title>
      
      {/* 탭 네비게이션 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("results")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "results"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            결과 통계
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "questions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            문제 목록
          </button>
        </nav>
      </div>

      {/* 결과 통계 탭 */}
      {activeTab === "results" && quizResults && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">전체 통계</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">총 문제 수:</span> {quizResults.totalQuizCount}문제
              </div>
              <div>
                <span className="font-semibold">참여자 수:</span> {quizResults.participantCount}명
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">참여자별 결과</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">이름</th>
                    <th className="border border-gray-300 p-3 text-left">이메일</th>
                    <th className="border border-gray-300 p-3 text-center">정답 수</th>
                    <th className="border border-gray-300 p-3 text-center">정답률</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.participantResults.map((participant, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">{participant.userName}</td>
                      <td className="border border-gray-300 p-3">{participant.userEmail}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        {participant.correctCount} / {quizResults.totalQuizCount}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        {((participant.correctCount / quizResults.totalQuizCount) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">문제별 통계</h3>
            <div className="space-y-4">
              {quizResults.quizStatistics.map((quiz) => {
                const detail = getQuizDetailById(quiz.id);
                return (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <span className="font-semibold text-gray-700">문제 ID:</span>
                      <span className="ml-2 text-gray-900">{quiz.id}</span>
                    </div>
                    {detail && (
                      <div className="mb-3">
                        <span className="font-semibold text-gray-700">문제:</span>
                        <p className="text-gray-900 mt-1">{detail.question}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-semibold">총 시도:</span> {quiz.totalAttempts}회
                      </div>
                      <div>
                        <span className="font-semibold">정답:</span> {quiz.correctAttempts}회
                      </div>
                      <div>
                        <span className="font-semibold">정답률:</span> {quiz.accuracyRate.toFixed(1)}%
                      </div>
                    </div>
                    {quiz.difficulty && (
                      <div className="text-sm">
                        <span className="font-semibold">난이도:</span> {getDifficultyText(quiz.difficulty)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 문제 목록 탭 */}
      {activeTab === "questions" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">문제 목록</h3>
            <div className="space-y-4">
              {quizDetails.map((quiz, index) => (
                <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-700">문제 {index + 1} (ID: {quiz.id}):</span>
                    </div>
                    <p className="text-gray-900 mt-1">{quiz.question}</p>
                  </div>
                  
                  {quiz.selective && quiz.options && (
                    <div className="mb-3">
                      <span className="font-semibold text-gray-700">선택지:</span>
                      <ul className="mt-1 ml-4">
                        {quiz.options.map((option, optionIndex) => (
                          <li key={optionIndex} className={`text-sm ${
                            (optionIndex + 1).toString() === quiz.correctAnswer 
                              ? 'text-green-600 font-medium' 
                              : 'text-gray-600'
                          }`}>
                            {optionIndex + 1}. {option}
                            {(optionIndex + 1).toString() === quiz.correctAnswer && ' ✓'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <span className="font-semibold text-gray-700">정답:</span>
                    <span className="ml-2 text-green-600 font-medium">
                      {quiz.selective ? `${quiz.correctAnswer}번` : quiz.correctAnswer}
                    </span>
                  </div>
                  
                  {quiz.comment && (
                    <div className="mb-3">
                      <span className="font-semibold text-gray-700">해설:</span>
                      <p className="text-gray-600 text-sm mt-1">{quiz.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <Button
          onClick={() => navigate("/quizsets")}
          classNameAdd="btn btn-secondary"
        >
          목록으로
        </Button>
        <Button
          onClick={() => navigate(-1)}
          classNameAdd="btn btn-secondary"
        >
          뒤로가기
        </Button>
      </div>
    </div>
  );
}