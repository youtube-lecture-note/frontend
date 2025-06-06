import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminStatus } from "../../api/login";
import Button from "../Button";
import LoginForm from "../../Login/LoginForm";
import Modal from "../Modal";
import StudentEnterKeyForm from "../../pages/multiquiz/StudentEnterKeyForm"

export default function SideMenuTopLogin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [openQuizModal, setOpenQuizModal] = useState(false);  //키 입력으로 퀴즈풀기

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || "사용자");
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }

    checkAdminStatus(setIsAdmin);
  }, []);

  console.log(isAdmin);

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
