import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getQuizCountByVideoId,
  createQuizSetByCountsApi,
} from "../../api";
import { getQuizSetResults,getQuizDetails } from "../../api/quizSet";

import Button from "../../components/Button";
import Title from "../../components/Title";

export default function TeacherCreateQuizPage({ videoId }) {
  const navigate = useNavigate();
  const [levelCounts, setLevelCounts] = useState({
    level1: 0,
    level2: 0,
    level3: 0,
  });
  const [availableCounts, setAvailableCounts] = useState({
    level1: 0,
    level2: 0,
    level3: 0,
    total: 0,
  });
  const [quizKey, setQuizKey] = useState("");
  const [quizSetId, setQuizSetId] = useState(null);
  const [quizSetName, setQuizSetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [quizDetails, setQuizDetails] = useState({});
  const timerRef = useRef(null);

  // 비디오별 난이도별 문제 수 조회
  useEffect(() => {
    async function fetchCounts() {
      try {
        const counts = await getQuizCountByVideoId(videoId);
        setAvailableCounts({
          level1: counts.level1Count,
          level2: counts.level2Count,
          level3: counts.level3Count,
          total: counts.totalCount,
        });
      } catch (e) {
        setError("문제 개수 조회 실패");
      }
    }
    fetchCounts();
  }, [videoId]);

  // 타이머 관리
  useEffect(() => {
    if (quizKey) {
      setSecondsLeft(600);
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [quizKey]);

  // 시간 포맷
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // 난이도별 문제 수 변경 핸들러
  const handleLevelCountChange = (level, value) => {
    setLevelCounts((prev) => ({
      ...prev,
      [level]: Math.max(0, Math.min(value, availableCounts[level])),
    }));
  };

  // 퀴즈 세트 생성
  const handleCreateQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const total = levelCounts.level1 + levelCounts.level2 + levelCounts.level3;
      if (total < 1) {
        setError("최소 1문제 이상 선택해주세요.");
        setLoading(false);
        return;
      }
      
      // 퀴즈셋 이름 검증
      if (!quizSetName.trim()) {
        setError("퀴즈셋 이름을 입력해주세요.");
        setLoading(false);
        return;
      }
      
      const res = await createQuizSetByCountsApi(videoId, levelCounts, quizSetName);
      setQuizKey(res.data?.redisQuizSetKey || res.redisQuizSetKey);
      setQuizSetId(res.data?.quizSetId || res.quizSetId);
      console.log(res);
    } catch (error) {
      // 기존 에러 처리 로직 유지
    } finally {
      setLoading(false);
    }
  };

  // 퀴즈셋 결과 조회
  const handleShowResults = async () => {
    if (!quizSetId) return;
    
    setLoading(true);
    try {
      const results = await getQuizSetResults(quizSetId);
      setQuizResults(results);
      
      // 각 퀴즈의 상세 정보 조회
      const details = {};
      for (const quiz of results.quizStatistics) {
        try {
          const quizDetail = await getQuizDetails(quiz.id);
          details[quiz.id] = quizDetail;
        } catch (e) {
          console.error(`퀴즈 ${quiz.id} 상세 정보 조회 실패:`, e);
        }
      }
      setQuizDetails(details);
      setShowResults(true);
    } catch (e) {
      setError("결과 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 난이도 텍스트 변환
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1: return "쉬움";
      case 2: return "보통";
      case 3: return "어려움";
      default: return "알 수 없음";
    }
  };

  if (showResults && quizResults) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Title>퀴즈셋 결과</Title>
        
        <div className="mb-6 p-4 border rounded bg-blue-50">
          <h3 className="font-bold text-lg mb-2">전체 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">총 문제 수:</span> {quizResults.totalQuizCount}문제
            </div>
            <div>
              <span className="font-semibold">참여자 수:</span> {quizResults.participantCount}명
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4">참여자별 결과</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">이름</th>
                  <th className="border border-gray-300 p-2">이메일</th>
                  <th className="border border-gray-300 p-2">정답 수</th>
                  <th className="border border-gray-300 p-2">정답률</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.participantResults.map((participant, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{participant.userName}</td>
                    <td className="border border-gray-300 p-2">{participant.userEmail}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {participant.correctCount} / {quizResults.totalQuizCount}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {((participant.correctCount / quizResults.totalQuizCount) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4">문제별 통계</h3>
          <div className="space-y-4">
            {quizResults.quizStatistics.map((quiz) => {
              const detail = quizDetails[quiz.id];
              return (
                <div key={quiz.id} className="border rounded p-4">
                  <div className="mb-2">
                    <span className="font-semibold">문제:</span> {detail?.question || "로딩 중..."}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">난이도:</span> {getDifficultyText(detail?.difficulty)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">총 시도:</span> {quiz.totalAttempts}회
                    </div>
                    <div>
                      <span className="font-semibold">정답:</span> {quiz.correctAttempts}회
                    </div>
                    <div>
                      <span className="font-semibold">정답률:</span> {quiz.accuracyRate}%
                    </div>
                  </div>
                  {detail?.correctAnswer && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">정답:</span> {detail.correctAnswer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button
          onClick={() => setShowResults(false)}
          classNameAdd="btn btn-secondary"
        >
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <Title>퀴즈 세트 생성</Title>
      {/* 퀴즈셋 이름 입력 필드 추가 */}
      <div className="mb-4 border rounded p-4">
        <div className="mb-2">퀴즈셋 이름</div>
        <input
          type="text"
          value={quizSetName}
          onChange={(e) => setQuizSetName(e.target.value)}
          placeholder="퀴즈셋 이름을 입력하세요"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4 border rounded p-4">
        <div className="mb-2">
          난이도별 문제 수 선택 (최대값: 해당 영상의 문제 수)
        </div>
        <div className="space-y-2">
          <div>
            <label className="inline-block w-14">쉬움</label>
            <input
              type="number"
              min={0}
              max={availableCounts.level1}
              value={levelCounts.level1}
              onChange={(e) =>
                handleLevelCountChange("level1", Number(e.target.value))
              }
              className="w-16"
            />
            <span className="text-xs text-gray-500 ml-1">
              / {availableCounts.level1}문제
            </span>
          </div>
          <div>
            <label className="inline-block w-14"> 보통</label>
            <input
              type="number"
              min={0}
              max={availableCounts.level2}
              value={levelCounts.level2}
              onChange={(e) =>
                handleLevelCountChange("level2", Number(e.target.value))
              }
              className="w-16"
            />
            <span className="text-xs text-gray-500 ml-1">
              / {availableCounts.level2}문제
            </span>
          </div>
          <div>
            <label className="inline-block w-14">어려움</label>
            <input
              type="number"
              min={0}
              max={availableCounts.level3}
              value={levelCounts.level3}
              onChange={(e) =>
                handleLevelCountChange("level3", Number(e.target.value))
              }
              className="w-16"
            />
            <span className="text-xs text-gray-500 ml-1">
              / {availableCounts.level3}문제
            </span>
          </div>
        </div>
      </div>
      <Button
        onClick={handleCreateQuiz}
        disabled={loading}
        classNameAdd="btn btn-primary"
      >
        {loading ? "생성 중..." : "퀴즈 생성"}
      </Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {quizKey && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <div className="font-bold flex items-center gap-2">
            학생들에게 이 키를 알려주세요!
            <span className="text-xs text-gray-500">
              (남은 시간:{" "}
              <span className="font-mono">{formatTime(secondsLeft)}</span>)
            </span>
          </div>
          <div className="text-2xl text-blue-700">{quizKey}</div>
          {secondsLeft === 0 && (
            <div className="text-red-600 mt-2">
              키의 유효 시간이 만료되었습니다.
            </div>
          )}
          {secondsLeft > 0 && quizSetId && (
            <Button
              onClick={handleShowResults}
              classNameAdd="btn btn-secondary mt-4"
              disabled={loading}
            >
              {loading ? "로딩 중..." : "퀴즈셋 기록 보기"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
