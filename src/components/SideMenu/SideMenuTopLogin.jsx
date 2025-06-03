import { useState, useEffect } from "react";
import { FcSettings } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import LoginForm from "../../Login/LoginForm";
export default function SideMenuTopLogin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
  }, []);

  return (
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
        <Button variant="SubjectDefault" onClick={() => navigate("/attempts")}>
          <span className="text-gray-800">퀴즈 기록</span>
        </Button>
        <Button variant="SubjectDefault" onClick={() => navigate("/admin")}>
          <span className="text-gray-800">관리자 페이지</span>
        </Button>
      </div>
    </div>
  );
}
