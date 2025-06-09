import Modal from "./Modal";

export default function StatsModal({ isOpen, onClose, statsData }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="내 기록"
    >
      <div className="p-6">
        {statsData ? (
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
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600">아직 통계 데이터가 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">퀴즈를 풀어보세요!</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
