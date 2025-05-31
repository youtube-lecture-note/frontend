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
  const inputRef = useRef(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    categories,
    addCategory,
    fetchCategories,
    selectedCategory,
    selectCategory,
  } = useCategoryStore();

  // 컴포넌트 마운트 시 카테고리 데이터 로드
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 주제 클릭 핸들러
  const handleSubjectClick = (categoryId) => {
    if (!categoryId) {
      // 선택된 카테고리의 부모 ID가 없을 경우
      selectCategory(1); // 기본 홈으로 이동
      navigate("/");
      return;
    }

    const category = useCategoryStore
      .getState()
      .categories.find((cat) => cat.id === categoryId);

    if (category) {
      selectCategory(categoryId);
      navigate(`/subject/${categoryId}`, {
        state: { Subjectinfo: category },
      });
    }
  };

  // 하위 주제 클릭 핸들러
  const handleChildSubjectClick = (categoryId) => {
    const findCategoryById = (id) => {
      for (const cat of categories) {
        if (cat.id === id) return cat;
        if (cat.children) {
          for (const child of cat.children) {
            if (child.id === id) return child;
          }
        }
      }
      return null;
    };

    const category = findCategoryById(categoryId);

    if (category) {
      selectCategory(categoryId);
      navigate(`/subject/${categoryId}`, {
        state: { Subjectinfo: category },
      });
    }
  };

  // 주제 추가 핸들러
  const handleAddSubject = async (parentId, name) => {
    if (!name || name.trim() === "") {
      setErrorMessage("주제명을 입력해주세요.");
      return;
    }

    try {
      const newCategory = await addCategory({
        name: name.trim(),
        parentId: parentId || null,
      });
      inputRef.current.value = "";
      setIsAddModalOpen(false);
      setErrorMessage("");

      // 카테고리 목록 새로고침
      await fetchCategories();
      selectCategory(parentId);
    } catch (error) {
      setErrorMessage("주제 추가에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 h-full text-gray-800 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-700">주제</h2>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex-grow">
            <Button
              variant="SubjectDefault"
              onClick={() => {
                handleSubjectClick(selectedCategory?.parentId);
              }}
            >
              <div className="flex items-center">
                <HiFolder className="inline-block mr-1 text-blue-600" />
                <span className="text-gray-800 truncate">
                  {selectedCategory?.name || "Default"}
                </span>
                {selectedCategory?.videos &&
                  selectedCategory.videos.length > 0 && (
                    <span className="ml-1 text-blue-600 text-sm">
                      ({selectedCategory.videos.length})
                    </span>
                  )}
              </div>
            </Button>
          </div>
          <Button
            variant="SubjectOther"
            onClick={() => setIsTreeModalOpen(true)}
            style={{ width: "auto", padding: "0.5rem" }}
          >
            <FaFolderTree />
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            style={{ width: "auto", padding: "0.5rem" }}
            variant="SubjectOther"
          >
            <VscNewFolder />
          </Button>
        </div>

        <div className="space-y-1 overflow-y-auto">
          {selectedCategory?.children &&
            selectedCategory.children.map((childSubject) => (
              <div key={childSubject.id} className="flex items-center">
                <TiChevronRightOutline className="inline-block mr-1 text-gray-500" />
                <Button
                  variant="SubjectDefault"
                  onClick={() => handleChildSubjectClick(childSubject.id)}
                >
                  <div className="flex items-center">
                    <HiFolder className="inline-block mr-1 text-blue-600" />
                    <span className="text-gray-800 truncate">
                      {childSubject.name}
                    </span>
                    {childSubject.videos && childSubject.videos.length > 0 && (
                      <span className="ml-1 text-blue-600 text-sm">
                        ({childSubject.videos.length})
                      </span>
                    )}
                  </div>
                </Button>
              </div>
            ))}
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setErrorMessage("");
        }}
        title="주제 추가"
        variant="AddSubject"
        inputRef={inputRef}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Input
              ref={inputRef}
              variant="AddSubject"
              placeholder="새 주제 이름"
            />
            <Button
              onClick={() =>
                handleAddSubject(selectedCategory?.id, inputRef.current.value)
              }
            >
              <VscNewFolder />
            </Button>
          </div>
          {/* 에러 메시지 */}
          {errorMessage && (
            <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      </Modal>

      <TreeModal
        isOpen={isTreeModalOpen}
        onClose={() => setIsTreeModalOpen(false)}
        title="주제 폴더"
      />
    </div>
  );
}
