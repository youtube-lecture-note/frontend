import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getQuizCountByVideoId,
  createQuizSetByCountsApi,
} from "../../api";

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
  const [deadline, setDeadline] = useState({ days: 0, hours: 0, minutes: 10 }); // 기본 10분
  const timerRef = useRef(null);

  // 마감 시간을 초 단위로 환산하는 함수
  const getDeadlineInSeconds = () => {
    const { days, hours, minutes } = deadline;
    return days * 86400 + hours * 3600 + minutes * 60;
  };

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
      const secs = getDeadlineInSeconds();
      setSecondsLeft(secs);
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
  }, [quizKey, deadline]);

  // 시간 포맷
  const formatTime = (secs) => {
    const days = Math.floor(secs / 86400);
    const hours = Math.floor((secs % 86400) / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    
    if (days > 0) {
      return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
    } else if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${seconds}초`;
    } else {
      return `${minutes}분 ${seconds.toString().padStart(2, "0")}초`;
    }
  };

  // 난이도별 문제 수 변경 핸들러
  const handleLevelCountChange = (level, value) => {
    setLevelCounts((prev) => ({
      ...prev,
      [level]: Math.max(0, Math.min(value, availableCounts[level])),
    }));
  };

  // 마감 시간 변경 핸들러
  const handleDeadlineChange = (unit, value) => {
    setDeadline((prev) => ({
      ...prev,
      [unit]: Math.max(0, Number(value)),
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
      
      if (!quizSetName.trim()) {
        setError("퀴즈셋 이름을 입력해주세요.");
        setLoading(false);
        return;
      }

      const deadlineSeconds = getDeadlineInSeconds();
      if (deadlineSeconds < 60) {
        setError("마감 시간은 최소 1분 이상이어야 합니다.");
        setLoading(false);
        return;
      }
      
      const res = await createQuizSetByCountsApi(
        videoId, 
        levelCounts, 
        quizSetName, 
        true,
        deadlineSeconds // 마감 시간(초) 전달
      );
      setQuizKey(res.data?.redisQuizSetKey || res.redisQuizSetKey);
      setQuizSetId(res.data?.quizSetId || res.quizSetId);
    } catch (error) {
      setError("퀴즈 세트 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 퀴즈셋 결과 페이지로 이동하는 함수
  const handleShowResults = () => {
    if (!quizSetId) return;
    navigate(`/quizsets/${quizSetId}`);
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <Title>퀴즈 세트 생성</Title>
      
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
        <div className="mb-2">제출 마감 시간 설정</div>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            min={0}
            max={7}
            value={deadline.days}
            onChange={(e) => handleDeadlineChange("days", e.target.value)}
            className="w-16 p-1 border rounded"
          />
          <span>일</span>
          <input
            type="number"
            min={0}
            max={23}
            value={deadline.hours}
            onChange={(e) => handleDeadlineChange("hours", e.target.value)}
            className="w-16 p-1 border rounded"
          />
          <span>시간</span>
          <input
            type="number"
            min={0}
            max={59}
            value={deadline.minutes}
            onChange={(e) => handleDeadlineChange("minutes", e.target.value)}
            className="w-16 p-1 border rounded"
          />
          <span>분</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          총 시간: {formatTime(getDeadlineInSeconds())}
        </div>
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
              className="w-16 p-1 border rounded"
            />
            <span className="text-xs text-gray-500 ml-1">
              / {availableCounts.level1}문제
            </span>
          </div>
          <div>
            <label className="inline-block w-14">보통</label>
            <input
              type="number"
              min={0}
              max={availableCounts.level2}
              value={levelCounts.level2}
              onChange={(e) =>
                handleLevelCountChange("level2", Number(e.target.value))
              }
              className="w-16 p-1 border rounded"
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
              className="w-16 p-1 border rounded"
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
              (남은 시간: <span className="font-mono">{formatTime(secondsLeft)}</span>)
            </span>
          </div>
          <div className="text-2xl text-blue-700 font-mono">{quizKey}</div>
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
