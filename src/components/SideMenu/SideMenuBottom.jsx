import { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCategory, addCategory } from "../../api/index.js";
import { FaFolderTree } from "react-icons/fa6";
import { RiFolderAddLine } from "react-icons/ri";
import { VscNewFolder } from "react-icons/vsc";

import Button from "../Button";
import Modal from "../Modal";
import Input from "../Input";

export default function SideMenuBottom() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 목록에서 현재 보여지는 주제
  // 주제를 선택하면, 주제명이 보이고, 그 아래 children 주제가 보이고, 클릭시 videos 목록이 보여짐
  // 현재 선택된 주제 목록
  const [SelectedSubject, setSelectedSubject] = useState({
    name: "default",
    id: 1,
    parentId: null,
    children: [],
    videos: [],
  });
  const inputRef = useRef(null);

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
      return {
        name: node.name || "default",
        id: node.id || 1,
        parentId: node.parentId || null,
        children: (node.children || []).map((subject) => ({
          id: subject.id,
          name: subject.name,
        })),
        videos: node.videos || [],
      };
    }
  };

  const traverseSubjectsById = (subjectId) => {
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

    // subjects가 배열인지 확인
    if (!Array.isArray(subjects) || subjects.length === 0) return null;

    for (const node of subjects) {
      const result = findSubject(node);
      if (result) {
        return result;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getCategory();
        if (data && data.length > 0) {
          setSubjects(data);
          console.log("data - fetchSubjects : ", data);

          const tmpSubject = NodeObjectParser(data);
          setSelectedSubject(tmpSubject);
        }
      } catch (error) {
        console.error("카테고리 데이터를 가져오는 중 오류 발생:", error);
      }
    };
    fetchSubjects();
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

  async function handleAddSubject(parentId, name) {
    if (!name || name.trim() === "") {
      console.log("주제명을 입력해주세요.");
      return;
    }

    try {
      const data = await addCategory({ name: name.trim(), parentId: parentId });
      console.log("새 주제 추가 결과:", data);

      // 주제 추가 후 카테고리 다시 불러오기
      const updatedData = await getCategory();
      setSubjects(updatedData);

      // 현재 선택된 주제 갱신
      const currentSubject = traverseSubjectsById(SelectedSubject.id);
      if (currentSubject) {
        setSelectedSubject(NodeObjectParser(currentSubject));
      }

      setIsOpen(false);
      // 입력 필드 초기화
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error("주제 추가 중 오류 발생:", error);
    }
  }

  const handleSubjectClick = (parentId) => {
    if (parentId === null || parentId === undefined) {
      handleChildSubjectClick(1); // 최상위 경우만 예외
      return;
    }
    // 선택한 주제에 해당하는 페이지로 이동
    const tmpSubjectData = traverseSubjectsById(parentId);
    if (tmpSubjectData) {
      const parsedSubject = NodeObjectParser(tmpSubjectData);
      console.log("선택된 주제 데이터:", parsedSubject);
      setSelectedSubject(parsedSubject);
      navigate(`/subject/${parentId}`, {
        state: { Subjectinfo: parsedSubject },
      });
    }
  };

  const handleChildSubjectClick = (subjectId) => {
    console.log("handleChildSubjectClick - 선택한 주제 ID:", subjectId);

    const tmpSubjectData = traverseSubjectsById(subjectId);
    if (tmpSubjectData) {
      const parsedSubject = NodeObjectParser(tmpSubjectData);
      console.log("선택된 주제 데이터:", parsedSubject);
      setSelectedSubject(parsedSubject);

      // 선택한 주제에 해당하는 페이지로 이동
      navigate(`/subject/${subjectId}`, {
        state: { Subjectinfo: parsedSubject },
      });
    } else {
      console.error("선택한 주제를 찾을 수 없습니다. ID:", subjectId);
    }
  };

  const handleFolderTreeClick = () => {
    // 폴더 트리 페이지로 이동
    navigate("/subjecttree", {
      state: { Subjects: subjects },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Subject</h2>
        <Button onClick={() => setIsOpen(true)} variant="SubjectOther">
          <VscNewFolder />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {/* 현재 선택된 주제  */}
        <div className="flex items-center gap-1">
          <div className="flex-grow">
            <Button
              variant="SubjectSelected"
              onClick={() => {
                handleSubjectClick(SelectedSubject.parentId);
              }}
            >
              {SelectedSubject.name}
            </Button>
          </div>
          {/* 폴더 아이콘 버튼 */}
          <Button
            variant="SubjectOther"
            onClick={handleFolderTreeClick}
            style={{ width: "auto", padding: "0.5rem" }}
          >
            <FaFolderTree />
          </Button>
        </div>
        {/*자식 버튼*/}
        {SelectedSubject.children &&
          SelectedSubject.children.map((childSubject, index) => (
            <Button
              key={childSubject.id}
              variant="SubjectDefault"
              onClick={() => handleChildSubjectClick(childSubject.id)}
            >
              {childSubject.name}
            </Button>
          ))}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="주제 추가"
        variant="AddSubject"
        inputRef={inputRef}
      >
        <div className="flex flex-row gap-2">
          <Input ref={inputRef} variant="AddSubject" />
          <Button
            onClick={() =>
              handleAddSubject(SelectedSubject.id, inputRef.current.value)
            }
          >
            <VscNewFolder />
          </Button>
        </div>
      </Modal>
    </div>
  );
}
