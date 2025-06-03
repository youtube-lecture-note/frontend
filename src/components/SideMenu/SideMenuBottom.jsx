import { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolderTree } from "react-icons/fa6";
import { VscNewFolder } from "react-icons/vsc";
import { FiCornerDownRight } from "react-icons/fi";
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
    findCategoryByName, // 이 함수 사용
  } = useCategoryStore();

  // 컴포넌트 마운트 시 카테고리 데이터 로드 및 적절한 카테고리 선택
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        // 카테고리 데이터 로드
        const data = await fetchCategories();
        console.log("카테고리 데이터 로드됨:", data);

        // 데이터가 있는지 확인
        if (!data || data.length === 0) {
          console.warn("로드된 카테고리 없음");
          return;
        }

        // "Default" 카테고리를 찾거나 첫 번째 루트 카테고리 사용
        const defaultCategory =
          findCategoryByName("Default") ||
          data.find((cat) => cat.parentId === null) ||
          data[0];

        console.log("Default 카테고리 선택:", defaultCategory);

        // 현재 경로에 따라 적절한 카테고리 선택
        const isHomePage = window.location.pathname === "/";
        if (isHomePage) {
          selectCategory(defaultCategory.id);
        } else {
          // URL에서 subject ID 추출 시도
          const match = window.location.pathname.match(/\/subject\/(\d+)/);
          if (match && match[1]) {
            selectCategory(parseInt(match[1]));
          } else {
            selectCategory(defaultCategory.id);
          }
        }
      } catch (error) {
        console.error("카테고리 초기화 실패:", error);
      }
    };

    initializeCategories();
  }, [fetchCategories, selectCategory, findCategoryByName]);

  // 선택된 카테고리 변경 감지 및 디버깅
  useEffect(() => {
    if (selectedCategory) {
      console.log(
        "현재 선택된 카테고리:",
        selectedCategory.id,
        selectedCategory.name
      );
    } else {
      console.log("선택된 카테고리 없음");
    }
  }, [selectedCategory]);

  // 주제 클릭 핸들러 - 상위 카테고리로 이동
  const handleSubjectClick = (categoryId) => {
    // 상위 카테고리 ID가 없거나 유효하지 않은 경우 루트로 이동
    if (!categoryId || categoryId < 1) {
      console.log("루트 카테고리로 이동");
      selectCategory(1); // 루트 카테고리 ID (보통 1)
      navigate(`/subject/1`);
      return;
    }

    // 카테고리 객체 찾기 (findCategoryById 사용)
    const findCategoryById = (
      id,
      categories = useCategoryStore.getState().categories
    ) => {
      // 재귀적으로 카테고리 찾기
      const findInCategories = (cats) => {
        for (const cat of cats) {
          if (cat.id === id) return cat;
          if (cat.children?.length > 0) {
            const found = findInCategories(cat.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findInCategories(categories);
    };

    const category = findCategoryById(categoryId);
    console.log("선택한 상위 카테고리:", category);

    if (category) {
      selectCategory(categoryId);
      navigate(`/subject/${categoryId}`, {
        state: { Subjectinfo: category },
      });
    } else {
      console.error("카테고리를 찾을 수 없음:", categoryId);
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
                <FiCornerDownRight className="inline-block mr-1 text-gray-500" />
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
