import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // AuthContext 추가
import Button from "../Button";
import LoginForm from "../../Login/LoginForm";
import Modal from "../Modal";
import StudentEnterKeyForm from "../../pages/multiquiz/StudentEnterKeyForm"
import { getMyStatistics } from "../../api/statistics"; // 통계 API 추가
import StatsModal from "../StatsModal";

export default function SideMenuTopLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isAdmin } = useAuth(); // AuthContext 사용
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    // 로딩이 완료되고 로그인되지 않은 상태라면 /login으로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // 통계 모달 상태
  const handleShowStats = async () => {
    setStatsLoading(true);
    try {
      const data = await getMyStatistics();
      setStatsData(data); // null일 수도 있음
      setOpenStatsModal(true);
    } catch (error) {
      console.error("통계 조회 실패:", error);
      // 에러 발생 시에도 모달을 열어서 사용자에게 피드백
      setStatsData(null);
      setOpenStatsModal(true);
    } finally {
      setStatsLoading(false);
    }
  };


  // 로딩 중이거나 인증되지 않은 경우 렌더링하지 않음
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        {/* 내 기록 버튼 - 글자 크기 증가 및 고정 테두리 추가 */}
        <div className="flex justify-start mt-2">
          <button
            onClick={handleShowStats}
            disabled={statsLoading}
            className="text-base px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded border border-gray-300 transition-colors disabled:opacity-50 w-24 h-10"
          >
            {statsLoading ? "로딩 중..." : "내 기록"}
          </button>
        </div>
        
        {/* 로그인 폼 컴포넌트 */}
        <div>
          <LoginForm />
        </div>

        {/* 메뉴 버튼들 */}
        <div className="flex flex-col gap-2 mt-4">
          <Button variant="SubjectDefault" onClick={() => navigate("/")}>
            <span className="text-gray-800">홈</span>
          </Button>
          <Button variant="SubjectDefault" onClick={() => navigate("/quizsets")}>
            <span className="text-gray-800">퀴즈셋 관리</span>
          </Button>
          <Button variant="SubjectDefault" onClick={() => navigate("/attempts")}>
            <span className="text-gray-800">퀴즈 기록</span>
          </Button>
          {isAdmin && (
            <Button
              variant="SubjectDefault"
              onClick={() => navigate("/admin", { state: { isAdmin: true } })}
            >
              <span className="text-gray-800">관리자 페이지</span>
            </Button>
          )}
          <Button 
            variant="SubjectDefault"
            onClick={() => setOpenQuizModal(true)}
          >
            <span className="text-gray-800">공동 퀴즈 풀기</span>
          </Button>
        </div>
        {/* 퀴즈 풀이 Modal */}
        <Modal 
          isOpen={openQuizModal} 
          onClose={() => setOpenQuizModal(false)}
          title="퀴즈 키 입력"
        >
          <StudentEnterKeyForm onClose={() => setOpenQuizModal(false)} />
        </Modal>
        {/* 통계 모달 - 간단해짐! */}
        <StatsModal 
          isOpen={openStatsModal}
          onClose={() => setOpenStatsModal(false)}
          statsData={statsData}
        />
      </div>
    </>
  );
}
