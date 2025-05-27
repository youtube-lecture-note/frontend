import { useLocation } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import SubjectNode from "../components/Subject/SubjectNode"; // 새로 만들 컴포넌트 임포트

// 주제 폴더 시각화 페이지
export default function SubjectTreePage() {
  const location = useLocation();
  // SideMenuBottom에서 state: { Subjects: subjects } 로 전달했으므로 Subjects로 받음
  const topLevelSubjects = location.state?.Subjects || [];

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="p-4 overflow-y-auto">
        {topLevelSubjects.length === 0 ? (
          <p className="text-gray-500">저장된 주제가 없습니다.</p>
        ) : (
          topLevelSubjects.map((subject) => (
            <SubjectNode key={subject.id} subject={subject} level={0} />
          ))
        )}
      </div>
    </div>
  );
}
