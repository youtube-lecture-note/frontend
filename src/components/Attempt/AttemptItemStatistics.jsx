import { getQuizStatistics } from "../../api/index";
import { useState, useEffect } from "react";

export default function AttemptItemStatistics({ quizId }) {
  const [stat, setStat] = useState({});
  // 정답률, 난이도, 총 시도 수, 맞은 수
  const fetchStat = async () => {
    const data = await getQuizStatistics(quizId);
    console.log("퀴즈 통계 데이터:", data);
    setStat(data);
  };

  useEffect(() => {
    fetchStat();
  }, [quizId]);

  let difficultyStyle = "text-sm text-gray-600 mb-2 bg-gray-200 p-1 rounded-md";
  let difficultyText = "";
  if (stat?.difficulty === "1") {
    //difficultyStyle += " bg-green-200";
    difficultyText = "⭐";
  } else if (stat?.difficulty === "2") {
    //difficultyStyle += " bg-yellow-300";
    difficultyText = "⭐⭐";
  } else {
    //difficultyStyle += " bg-red-500";
    difficultyText = "⭐⭐⭐";
  }

  return (
    <div className="flex flex-row items-center text-sm text-gray-600 mb-4">
      <div className={difficultyStyle}>{difficultyText}</div>
      <div className="mx-2">(정답률 : {stat?.accuracyRate} %)</div>
    </div>
  );
}
