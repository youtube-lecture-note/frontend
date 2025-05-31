import { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolderTree } from "react-icons/fa6";
import { VscNewFolder } from "react-icons/vsc";
import { TiChevronRightOutline } from "react-icons/ti";
import { HiFolder } from "react-icons/hi";

import Button from "../Button";
import Modal from "../Modal";
import Input from "../Input";
import TreeModal from "../TreeModal";
import useCategoryStore from "../../store/categoryStore";

export default function SideMenuBottom() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Zustand 스토어에서 상태와 액션 가져오기 (lastUpdated 추가)
  const {
    categories,
    selectedCategory,
    fetchCategories,
    addCategory: addCategoryAction,
    selectCategory,
    findCategoryById,
    lastUpdated, // 타임스탬프 추가
  } = useCategoryStore();

  const inputRef = useRef(null);

  // 카테고리 데이터 로드 및 기본 카테고리 선택
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      if (!selectedCategory) {
        selectCategory(1);
      }
    };

    loadData();
  }, [fetchCategories, selectCategory, selectedCategory, lastUpdated]); // lastUpdated를 의존성에 추가

  // 선택된 카테고리 존재 여부 확인
  useEffect(() => {
    if (selectedCategory?.id) {
      const stillExists = findCategoryById(selectedCategory.id);
      if (!stillExists) {
        selectCategory(1);
      }
    }
  }, [categories, selectedCategory, findCategoryById, selectCategory]);

  // 주제 추가 핸들러
  async function handleAddSubject(parentId, name) {
    if (!name || name.trim() === "") {
      setErrorMessage("주제명을 입력해주세요.");
      return;
    }

    try {
      await addCategoryAction({
        name: name.trim(),
        parentId: parentId,
      });

      // 방금 추가한 주제의 부모 카테고리를 다시 선택하여 UI 업데이트
      selectCategory(parentId);

      setErrorMessage(""); // 성공 시 에러 메시지 초기화
      setIsAddModalOpen(false); // 이름 변경
      // 입력 필드 초기화
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      // alert 대신 상태에 에러 메시지 저장
      if (error.message.includes("이미 존재하는 주제 이름입니다")) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("주제 추가 중 오류가 발생했습니다.");
        console.error("주제 추가 중 오류 발생:", error);
      }
    }
  }

  // 주제 클릭 핸들러
  const handleSubjectClick = (categoryId) => {
    if (categoryId === null || categoryId === undefined) {
      handleChildSubjectClick(1); // 최상위 경우만 예외
      return;
    }
    handleChildSubjectClick(categoryId);
  };

  const handleChildSubjectClick = (categoryId) => {
    console.log("handleChildSubjectClick - 선택한 주제 ID:", categoryId);

    // 카테고리 선택하여 상태 업데이트
    selectCategory(categoryId);

    const selectedCat = findCategoryById(categoryId);
    if (selectedCat) {
      navigate(`/subject/${categoryId}`, {
        state: { Subjectinfo: selectedCat },
      });
    } else {
      console.error("선택한 주제를 찾을 수 없습니다. ID:", categoryId);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Subject</h2>
      </div>
      <div className="flex flex-col gap-1">
        {/* 현재 선택된 주제 */}
        <div className="flex items-center gap-1">
          <div className="flex-grow">
            <Button
              variant="SubjectDefault"
              onClick={() => {
                handleSubjectClick(selectedCategory?.parentId);
              }}
            >
              <div className="flex items-center">
                <HiFolder className="inline-block mr-1" />
                {selectedCategory?.name || "Default"}
                {selectedCategory?.videos &&
                  selectedCategory.videos.length > 0 && (
                    <span className="ml-1 text-blue-500 text-sm">
                      ({selectedCategory.videos.length})
                    </span>
                  )}
              </div>
            </Button>
          </div>
          {/* 폴더 아이콘 버튼 */}
          <Button
            variant="SubjectOther"
            onClick={() => setIsTreeModalOpen(true)} // 변경
            style={{ width: "auto", padding: "0.5rem" }}
          >
            <FaFolderTree />
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)} // 변경
            style={{ width: "auto", padding: "0.5rem" }}
            variant="SubjectOther"
          >
            <VscNewFolder />
          </Button>
        </div>
        {/* 자식 버튼 */}
        {selectedCategory?.children &&
          selectedCategory.children.map((childSubject) => (
            <div key={childSubject.id} className="flex items-center">
              <TiChevronRightOutline className="inline-block mr-1" />
              <Button
                variant="SubjectDefault"
                onClick={() => handleChildSubjectClick(childSubject.id)}
              >
                <div className="flex items-center">
                  <HiFolder className="inline-block mr-1" />
                  {childSubject.name}
                  {childSubject.videos && childSubject.videos.length > 0 && (
                    <span className="ml-1 text-blue-500 text-sm">
                      ({childSubject.videos.length})
                    </span>
                  )}
                </div>
              </Button>
            </div>
          ))}
      </div>
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setErrorMessage(""); // 모달 닫을 때 에러 메시지 초기화
        }}
        title="주제 추가"
        variant="AddSubject"
        inputRef={inputRef}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Input ref={inputRef} variant="AddSubject" />
            <Button
              onClick={() =>
                handleAddSubject(selectedCategory?.id, inputRef.current.value)
              }
            >
              <VscNewFolder />
            </Button>
          </div>
          {/* 에러 메시지 표시 영역 추가 */}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      </Modal>
      <TreeModal
        isOpen={isTreeModalOpen} // 변경
        onClose={() => setIsTreeModalOpen(false)} // 변경
        title="주제 폴더"
      ></TreeModal>
    </div>
  );
}
