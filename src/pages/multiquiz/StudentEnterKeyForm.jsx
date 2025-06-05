import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button";

export default function StudentEnterKeyForm({ onClose }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key.trim()) {
      setError("키를 입력하세요.");
      return;
    }
    onClose(); // 모달 닫기
    navigate(`/quiz/multi/${key}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">퀴즈 키 입력</h2>
      <input
        className="border p-2 w-full mb-2"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="키를 입력하세요 (여섯 자리 숫자)"
      />
      <Button classNameAdd="btn btn-primary w-full">퀴즈 풀기</Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}
