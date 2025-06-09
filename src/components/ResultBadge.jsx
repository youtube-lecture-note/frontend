// 퀴즈 정답률에 따른 색상 뱃지와 정답 개수를 표시
export default function ResultBadge({ totalQuiznum, wrongCount }) {
  // 정확도 계산
  const correctCount = totalQuiznum - wrongCount;
  const accuracy = Math.round((correctCount / totalQuiznum) * 100);

  // 정확도에 따른 색상 설정
  let badgeColor = "bg-green-500";
  if (accuracy < 50) {
    badgeColor = "bg-red-500";
  } else if (accuracy < 80) {
    badgeColor = "bg-yellow-500";
  }

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div
        className={`w-12 h-12 rounded-full ${badgeColor} flex items-center justify-center text-white font-bold`}
      >
        {accuracy}%
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {correctCount}/{totalQuiznum}
      </p>
    </div>
  );
}
