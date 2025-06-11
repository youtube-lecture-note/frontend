// PersonalQuizModal.js
import { useState, useEffect } from "react";
import { getQuizCountByVideoId, createQuizSetByCountsApi } from "../../api";
import Button from "../Button";

export default function PersonalQuizModal({ videoId, onQuizStart, onClose }) {
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
  const [isRemaining, setIsRemaining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 비디오별 난이도별 문제 수 조회
  useEffect(() => {
    async function fetchCounts() {
      try {
        const counts = await getQuizCountByVideoId(videoId, isRemaining);
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
  }, [videoId, isRemaining]);

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e) => {
    setIsRemaining(e.target.checked);
  };

  // 난이도별 문제 수 변경 핸들러
  const handleLevelCountChange = (level, value) => {
    setLevelCounts((prev) => ({
      ...prev,
      [level]: Math.max(0, Math.min(value, availableCounts[level])),
    }));
  };

  // 퀴즈 생성 및 시작
  const handleCreateAndStartQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const total =
        levelCounts.level1 + levelCounts.level2 + levelCounts.level3;
      if (total < 1) {
        setError("최소 1문제 이상 선택해주세요.");
        setLoading(false);
        return;
      }

      // createQuizSetByCountsApi 사용
      const quizSetName = null;
      const res = await createQuizSetByCountsApi(
        videoId,
        levelCounts,
        quizSetName,
        false,
        isRemaining
      );

      // 부모 컴포넌트로 퀴즈 데이터 전달
      onQuizStart(res);
      console.log("퀴즈 생성 성공:", res);
    } catch (error) {
      console.error("퀴즈 생성 오류:", error);
      if (error.status === 400) {
        setError(`${error.message} 잠시 후 다시 시도해주세요.`);
      } else if (error.status === 500) {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("퀴즈를 생성할 수 없습니다. 네트워크 연결을 확인해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* 체크박스 추가 */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isRemaining}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          풀지 않은 문제만 풀기
        </label>
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

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex gap-2 justify-end">
        <Button onClick={onClose} variant="secondary">
          취소
        </Button>
        <Button
          onClick={handleCreateAndStartQuiz}
          disabled={loading}
          variant="primary"
        >
          {loading ? "퀴즈 생성 중..." : "퀴즈 시작"}
        </Button>
      </div>
    </div>
  );
}
