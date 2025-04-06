import { useState } from "react";
import Subject from "./Subject";

export default function SideMenuBottom() {
  const [subjects, setSubjects] = useState(["미분류", "과학", "자격증"]); // 임시 데이터

  const handleAddSubject = () => {
    // TODO: 주제 추가 모달 또는 입력 폼 구현
    const newSubject = prompt("새로운 주제를 입력하세요:");
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Subject</h2>
        <button
          onClick={handleAddSubject}
          className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          +
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {subjects.map((subject, index) => (
          <Subject key={index}>{subject}</Subject>
        ))}
      </div>
    </div>
  );
}
