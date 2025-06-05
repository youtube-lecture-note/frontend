import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  createQuizSetApi,
  getQuizCountByVideoId,
  createQuizSetByCountsApi,
} from "../../api";

import Button from "../../components/Button";
import Title from "../../components/Title";

export default function TeacherCreateQuizPage({ videoId }) {
  const navigate = useNavigate();
  // 난이도별 문제 수 상태
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(600);
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
      // 난이도별 문제 수 합계가 1 이상이어야 함
      const total =
        levelCounts.level1 + levelCounts.level2 + levelCounts.level3;
      if (total < 1) {
        setError("최소 1문제 이상 선택해주세요.");
        setLoading(false);
        return;
      }
      // 실제 API 호출 (아래에 백엔드 예시 있음)
      const res = await createQuizSetByCountsApi(videoId, levelCounts);
      setQuizKey(res.data.redisQuizSetKey);
      console.log(res);
    } catch (e) {
      setError(e.message || "퀴즈 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <Title>퀴즈 세트 생성</Title>
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
          {secondsLeft > 0 && (
            <Button
              onClick={() => navigate(`/quiz/multi/${quizKey}`)}
              classNameAdd="btn btn-secondary mt-4"
            >
              문제 풀기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
