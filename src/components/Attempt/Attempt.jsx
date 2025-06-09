// 개별 시도기록 1개
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import ResultBadge from "../ResultBadge";

export default function Attempts({ attempt }) {
  const navigate = useNavigate();
  const handleViewDetails = (quizSetId) => {
    navigate(`/attempts/${quizSetId}`);
  };

  return (
    <div
      key={attempt.quizSetId}
      className="p-3 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex justify-between items-center"
    >
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">
          {attempt.userVideoName || "제목 없음"}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(attempt.date).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ResultBadge
          totalQuiznum={attempt.totalQuizzes}
          wrongCount={attempt.wrongCount}
        />

        <Button
          onClick={() => handleViewDetails(attempt.quizSetId)}
          variant="link"
        >
          <span>기록</span>
          <FaChevronRight className="text-xs" />
        </Button>
      </div>
    </div>
  );
}
