import { TiChevronRightOutline } from "react-icons/ti";
import { HiFolder } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import { VscNewFolder } from "react-icons/vsc";

import Button from "../Button";

// 주제 노드를 렌더링하는 재귀 컴포넌트
export default function SubjectNode({
  subject,
  level,
  handleDeleteSubject,
  handleSubjectClick,
  handleAddButtonClick,
}) {
  const hasChildren = subject.children && subject.children.length > 0;
  const videoCount = subject.videos ? subject.videos.length : 0;

  // level에 따라 아이콘을 반복하기 위한 배열 생성
  const indent = Array.from({ length: level }, (_, i) => (
    <div
      key={`indent-${i}`}
      className="inline-block w-4 h-4 mr-1"
      style={{
        marginLeft: "0.5rem", // 각 레벨마다 들여쓰기
      }}
    ></div>
  ));

  if (level > 0) {
    indent.push(
      <TiChevronRightOutline
        key={`indent-icon-${level}`}
        className="inline-block text-gray-400 mr-2"
      />
    );
  }

  return (
    <div className="mb-1">
      {/* 주제 이름과 비디오 개수 표시 */}
      <div className="flex items-center py-1">
        {/* 단계마다 탭 들여쓰기 */}
        {indent}
        {/* flex-grow 제거하고 버튼과 삭제 버튼 사이 여백 추가 */}
        <div className="flex items-center">
          <Button
            variant="SubjectDefault"
            onClick={
              handleSubjectClick
                ? () => handleSubjectClick(subject.id)
                : undefined
            }
          >
            <div className="flex items-center">
              <HiFolder />
              <span className="font-medium text-gray-800 ml-1">
                {subject.name}
              </span>
              {videoCount > 0 && (
                <span className="ml-1 text-blue-500 text-sm">({videoCount})</span>
              )}
            </div>
          </Button>
        </div>
        {/* 여백 추가 */}
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-2">
          {/* 주제 추가 버튼 */}
          {handleAddButtonClick && (
            <Button
              onClick={() => handleAddButtonClick(subject.id)}
              variant="SubjectSmall"
              title="하위 주제 추가"
            >
              <VscNewFolder />
            </Button>
          )}

          <Button
            onClick={() => handleDeleteSubject(subject.id)}
            variant={level === 0 ? "SubjectNotUse" : "SubjectSmall"}
            title="주제 삭제"
          >
            <FaTrash />
          </Button>
        </div>
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
              handleSubjectClick={handleSubjectClick} // handleSubjectClick prop 전달
              handleAddButtonClick={handleAddButtonClick} // handleAddButtonClick prop 전달
            />
          ))}
        </div>
      )}
    </div>
  );
}
