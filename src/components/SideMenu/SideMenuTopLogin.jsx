import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // AuthContext 추가
import Button from "../Button";
import LoginForm from "../../Login/LoginForm";
import Modal from "../Modal";
import StudentEnterKeyForm from "../../pages/multiquiz/StudentEnterKeyForm"

export default function SideMenuTopLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isAdmin } = useAuth(); // AuthContext 사용
  const [openQuizModal, setOpenQuizModal] = useState(false);

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    // 로딩이 완료되고 로그인되지 않은 상태라면 /login으로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 로딩 중이거나 인증되지 않은 경우 렌더링하지 않음
  if (isLoading || !isAuthenticated) {
    return null; // 또는 로딩 스피너
  }

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
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
            onClick={() => setOpenQuizModal(true)}>
            <span className="text-gray-800">공동 퀴즈 풀기</span>
          </Button>
        </div>
      </div>
      
      {/* 모달을 컴포넌트 최상위로 이동 */}
      <Modal 
        isOpen={openQuizModal} 
        onClose={() => setOpenQuizModal(false)}
        title="퀴즈 키 입력"
      >
        <StudentEnterKeyForm onClose={() => setOpenQuizModal(false)} />
      </Modal>
    </>
  );
}
