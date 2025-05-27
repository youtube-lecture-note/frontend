import { useState, useEffect } from "react";
import { getCategory, deleteCategory } from "../api/index.js"; // 카테고리 API 호출 함수
import TopBar from "../components/TopBar/TopBar";
import SubjectNode from "../components/Subject/SubjectNode"; // 새로 만들 컴포넌트 임포트

// 주제 폴더 시각화 페이지
export default function SubjectTreePage() {
  const [subjects, setSubjects] = useState([]);
  // SideMenuBottom에서 state: { Subjects: subjects } 로 전달했으므로 Subjects로 받음

  // fetchSubjects 함수를 컴포넌트 스코프로 이동
  const fetchSubjects = async () => {
    try {
      const data = await getCategory();
      if (data && data.length > 0) {
        setSubjects(data);
        console.log("data - fetchSubjects : ", data);
        // NodeObjectParser 호출은 두 번째 useEffect에서 subjects가 변경될 때 처리됩니다.
        // 필요하다면 여기서도 호출할 수 있으나, 현재 구조에서는 두 번째 useEffect에 의해 처리됩니다.
      } else {
        setSubjects([]); // 데이터가 없거나 비어있을 경우 빈 배열로 설정
      }
    } catch (error) {
      console.error("카테고리 데이터를 가져오는 중 오류 발생:", error);
      setSubjects([]); // 오류 발생 시 빈 배열로 설정
    }
  };

  useEffect(() => {
    fetchSubjects();
    // NodeObjectParser 호출은 fetchSubjects가 완료되고 subjects 상태가 업데이트된 후,
    // 아래의 [subjects] 의존성을 가진 useEffect에서 처리됩니다.
    // 따라서 fetchSubjects 내의 NodeObjectParser 호출은 중복될 수 있으므로 주석 처리하거나 제거하는 것을 고려할 수 있습니다.
    // 현재 코드에서는 첫 번째 useEffect 내의 fetchSubjects 함수 정의 안에 있던 NodeObjectParser 호출을 제거했습니다.
  }, []);

  useEffect(() => {
    // subjects가 로드된 경우에만 실행
    if (subjects && subjects.length > 0) {
      const rootSubject = traverseSubjectsById(1);
      console.log("루트 주제 데이터:", rootSubject);
      if (rootSubject) {
        const parsedSubject = NodeObjectParser(rootSubject);
        console.log("파싱된 주제 데이터:", parsedSubject);
      }
    }
  }, [subjects]); // subjects가 변경될 때마다 실행
  // parent id는 단계를 말함

  // 노드 객체에서 필요부분만 상태로 저장하도록함
  const NodeObjectParser = (node) => {
    // 루트 노드인 경우
    if (Array.isArray(node) && node.length > 0 && node[0].id === 1) {
      return {
        name: node[0].name || "default",
        id: node[0].id,
        parentId: null,
        children: (node[0].children || []).map((subject) => ({
          id: subject.id,
          name: subject.name,
        })),
        videos: node[0].videos || [],
      };
    }
    // 일반 노드인 경우
    else {
      // node가 객체가 아니거나 id 속성이 없는 경우를 대비한 방어 코드 추가
      if (typeof node !== "object" || node === null || !("id" in node)) {
        // 기본값 또는 오류 처리 로직
        // console.warn("NodeObjectParser: 유효하지 않은 노드 객체입니다.", node);
        return {
          name: "invalid",
          id: -1,
          parentId: null,
          children: [],
          videos: [],
        };
      }
      return {
        name: node.name || "default",
        id: node.id || 1, // 이 부분은 node.id가 없을 경우를 대비한 것이지만, 위에서 이미 체크함
        parentId: node.parentId || null,
        children: (node.children || []).map((subject) => ({
          id: subject.id,
          name: subject.name,
        })),
        videos: node.videos || [],
      };
    }
  };

  // traverseSubjectsById 함수 수정: currentSubjects 매개변수 추가
  const traverseSubjectsById = (subjectId, currentSubjects = subjects) => {
    const findSubject = (node) => {
      if (!node) return null;
      if (node.id === subjectId) return node;
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const result = findSubject(child);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };

    // currentSubjects가 배열인지 확인
    if (!Array.isArray(currentSubjects) || currentSubjects.length === 0)
      return null;

    for (const node of currentSubjects) {
      const result = findSubject(node);
      if (result) {
        return result;
      }
    }
    return null;
  };

  // 주제 삭제
  const handleDeleteSubject = async (subjectId) => {
    try {
      console.log(`주제 ${subjectId} 삭제 요청`);
      await deleteCategory(subjectId);
      console.log(`주제 ${subjectId} 삭제 성공`);
      // 주제 목록을 다시 불러와서 화면을 갱신합니다.
      await fetchSubjects();
      // SideMenuBottom 등 다른 컴포넌트에도 변경사항을 알리기 위해 이벤트 발생
      //window.dispatchEvent(new Event("categoriesUpdated"));
    } catch (error) {
      console.error(`주제 ${subjectId} 삭제 실패:`, error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="p-4 overflow-y-auto">
        {subjects.length === 0 ? (
          <p className="text-gray-500">저장된 주제가 없습니다.</p>
        ) : (
          subjects.map((subject) => (
            <SubjectNode
              key={subject.id}
              subject={subject}
              level={0}
              handleDeleteSubject={handleDeleteSubject}
            />
          ))
        )}
      </div>
    </div>
  );
}
