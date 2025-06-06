// pages/QuizSetListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuizSets } from "../api/quizSet";
import Button from "../components/Button";
import Title from "../components/Title";
import TopBar from "../components/TopBar/TopBar";

export default function QuizSetListPage() {
  const navigate = useNavigate();
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuizSets();
  }, []);

  const fetchQuizSets = async () => {
    setLoading(true);
    try {
      const data = await getAllQuizSets();
      setQuizSets(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizSets = quizSets.filter((quizSet) => {
    // quizSet이 null/undefined인 경우 제외
    if (!quizSet) {
      return false;
    }

    // name이 null인 경우 "이름 없음"으로 처리하여 검색 가능하게 함
    const quizSetName = quizSet.name || "이름 없음";

    if (!searchTerm) {
      return true; // 검색어가 없으면 모든 퀴즈셋 표시
    }

    return quizSetName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Title>퀴즈셋 목록</Title>
        <div className="text-center py-8">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Title>퀴즈셋 목록</Title>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="퀴즈셋 이름으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredQuizSets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "검색 결과가 없습니다." : "생성된 퀴즈셋이 없습니다."}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQuizSets.map((quizSet) => (
            <div
              key={quizSet.quizSetId}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/quizsets/${quizSet.quizSetId}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {quizSet.name || (
                    <span className="text-gray-500 italic">이름 없음</span>
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">생성일:</span>{" "}
                  {formatDate(quizSet.createdAt)}
                </div>
                <div>
                  <span className="font-medium">상태:</span>
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs ${
                      quizSet.name
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {quizSet.name ? "설정 완료" : "이름 미설정"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  클릭하여 세부 내역 보기
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/quizsets/${quizSet.quizSetId}`);
                  }}
                  classNameAdd="btn btn-sm btn-primary"
                >
                  상세 보기
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <Button
          onClick={() => navigate("/create-quiz")}
          classNameAdd="btn btn-primary"
        >
          새 퀴즈셋 만들기
        </Button>
        <Button onClick={() => navigate(-1)} classNameAdd="btn btn-secondary">
          돌아가기
        </Button>
      </div>
    </div>
  );
}
