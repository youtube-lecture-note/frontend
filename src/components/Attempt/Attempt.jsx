// 개별 시도기록 1개
import Button from "../Button";
import { useNavigate } from "react-router-dom";

export default function Attempts({ attempt }) {
  const navigate = useNavigate();
  const handleViewDetails = (quizSetId) => {
    navigate(`/attempts/${quizSetId}`);
  };

  let resultstyle = "text-md font-semibold ";
  const colorfactor = attempt.wrongCount / attempt.totalQuizzes;
  if (colorfactor < 0.2) {
    resultstyle += "text-green-500";
  } else if (colorfactor < 0.5) {
    resultstyle += "text-yellow-500";
  } else {
    resultstyle += "text-red-500";
  }

  return (
    <div
      key={attempt.quizSetId}
      className="p-3 bg-gray-100 rounded-md shadow flex justify-between"
    >
      <div>
        <p className="font-semibold text-gray-700">{attempt.userVideoName}</p>
        <p className="text-sm text-gray-500">
          {new Date(attempt.date).toLocaleString()}{" "}
        </p>
        <p className={resultstyle}>
          {attempt.totalQuizzes - attempt.wrongCount} / {attempt.totalQuizzes}
        </p>
      </div>

      <Button
        variant="link"
        onClick={() => handleViewDetails(attempt.quizSetId)}
      >
        기록보기
      </Button>
    </div>
  );
}
