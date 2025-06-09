import Modal from "./Modal";

export default function StatsModal({ isOpen, onClose, statsData }) {
  const isValidStatsData = (data) => {
    if (!data || data === null) return false;
    
    // 빈 객체인지 확인
    if (Object.keys(data).length === 0) return false;
    
    // 필수 속성들이 있는지 확인
    const requiredFields = [
      'totalAttempts', 
      'correctAttempts', 
      'accuracyRate', 
      'studiedVideoCount',
      'accuracyPercentileRank',
      'videosPercentileRank'
    ];
    
    return requiredFields.every(field => 
      data.hasOwnProperty(field) && data[field] !== undefined
    );
  };

  // 데이터가 유효하지 않은 경우 (null, 빈 객체, 필수 필드 누락)
  if (!isValidStatsData(statsData)) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="내 기록"
      >
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-gray-300 text-6xl mb-6">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              아직 기록이 없어요
            </h3>
            <p className="text-gray-500 mb-6">
              첫 번째 퀴즈를 풀어보시면<br />
              여기에 통계가 표시됩니다
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                💡 <strong>팁:</strong> 퀴즈를 풀수록 더 정확한 통계를 확인할 수 있어요!
              </p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // 데이터가 있는 경우 (기존 코드)
  return (
    console.log("StatsModal - statsData:", statsData),
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="내 기록"
    >
      <div className="p-6">
        <div className="space-y-6">
          {/* 전체 통계 카드 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              📊 퀴즈 성과
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statsData.totalAttempts}</div>
                <div className="text-sm text-gray-600">총 시도 횟수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statsData.correctAttempts}</div>
                <div className="text-sm text-gray-600">정답 횟수</div>
              </div>
            </div>
          </div>

          {/* 정확도 카드 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              🎯 정확도
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{statsData.accuracyRate}%</div>
                <div className="text-sm text-gray-600">전체 정확도</div>
              </div>
              <div className="w-20 h-20">
                <div className="relative w-full h-full">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${statsData.accuracyRate}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 학습 현황 카드 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              📚 학습 현황
            </h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{statsData.studiedVideoCount}</div>
              <div className="text-sm text-gray-600">학습한 영상 수</div>
            </div>
          </div>

          {/* 순위 정보 카드 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              🏆 내 순위
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">정확도 순위</span>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-orange-600">
                    상위 {statsData.accuracyPercentileRank.toFixed(1)}%
                  </span>
                  {statsData.accuracyPercentileRank === 0 && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                      🥇 1등
                    </span>
                  )}
                  {statsData.accuracyPercentileRank <= 10 && statsData.accuracyPercentileRank > 0 && (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      우수
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">학습량 순위</span>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-orange-600">
                    상위 {statsData.videosPercentileRank.toFixed(1)}%
                  </span>
                  {statsData.videosPercentileRank === 0 && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                      🥇 1등
                    </span>
                  )}
                  {statsData.videosPercentileRank <= 10 && statsData.videosPercentileRank > 0 && (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      우수
                    </span>
                  )}
                  {statsData.videosPercentileRank === 50 && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      평균
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 격려 메시지 */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              {statsData.accuracyRate >= 80 
                ? "🎉 훌륭한 성과입니다! 계속 화이팅하세요!" 
                : statsData.accuracyRate >= 50 
                ? "👍 좋은 진전이에요! 조금 더 노력해보세요!" 
                : "💪 시작이 반입니다! 꾸준히 학습해보세요!"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
