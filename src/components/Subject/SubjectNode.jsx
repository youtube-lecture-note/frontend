import { TiChevronRightOutline } from "react-icons/ti";
import { HiFolder } from "react-icons/hi";
import Button from "../Button";

// 주제 노드를 렌더링하는 재귀 컴포넌트
export default function SubjectNode({ subject, level, handleDeleteSubject }) {
  const hasChildren = subject.children && subject.children.length > 0;
  const videoCount = subject.videos ? subject.videos.length : 0;

  // level에 따라 아이콘을 반복하기 위한 배열 생성
  const indentIcons = Array.from({ length: level }, (_, i) => (
    <TiChevronRightOutline
      key={`indent-icon-${i}`}
      className="inline-block text-gray-400 mr-2"
    />
  ));

  return (
    <div className="mb-1">
      {/* 주제 이름과 비디오 개수 표시 */}
      <div className="flex items-center py-1">
        {/* 들여쓰기 아이콘 표시 */}
        {indentIcons}
        <HiFolder />
        <span className="font-medium text-gray-800 ml-1"> {subject.name} </span>
        {videoCount > 0 && (
          <span className="ml-2 text-sm text-gray-500">({videoCount})</span>
        )}
        <Button onClick={() => handleDeleteSubject(subject.id)}>삭제</Button>
      </div>

      {/* 자식 주제(폴더) 렌더링 */}
      {hasChildren && (
        <div className="mt-1">
          {subject.children.map((childSubject) => (
            <SubjectNode
              key={childSubject.id}
              subject={childSubject}
              level={level + 1} // 다음 레벨로 재귀 호출
              handleDeleteSubject={handleDeleteSubject} // handleDeleteSubject prop 전달
            />
          ))}
        </div>
      )}
    </div>
  );
}
