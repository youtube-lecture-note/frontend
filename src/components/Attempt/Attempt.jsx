// 개별 시도기록 1개
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

export default function Attempts({ attempt }) {
  const navigate = useNavigate();
  const handleViewDetails = (quizSetId) => {
    navigate(`/attempts/${quizSetId}`);
  };

  // 정확도 계산
  const correctCount = attempt.totalQuizzes - attempt.wrongCount;
  const accuracy = Math.round((correctCount / attempt.totalQuizzes) * 100);

  // 정확도에 따른 색상 설정
  let badgeColor = "bg-green-500";
  if (accuracy < 50) {
    badgeColor = "bg-red-500";
  } else if (accuracy < 80) {
    badgeColor = "bg-yellow-500";
  }

  return (
    <div
      key={attempt.quizSetId}
      className="p-3 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex justify-between items-center"
    >
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{attempt.userVideoName}</p>
        <p className="text-sm text-gray-500">
          {new Date(attempt.date).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <div
            className={`w-12 h-12 rounded-full ${badgeColor} flex items-center justify-center text-white font-bold`}
          >
            {accuracy}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {correctCount}/{attempt.totalQuizzes}
          </p>
        </div>

        <Button
          onClick={() => handleViewDetails(attempt.quizSetId)}
          variant="link"
        >
          <span>기록보기</span>
          <FaChevronRight className="text-xs" />
        </Button>
      </div>
    </div>
  );
}
