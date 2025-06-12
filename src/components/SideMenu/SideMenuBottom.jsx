// components/SideMenuBottom.js
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolderTree } from "react-icons/fa6";
import { VscNewFolder } from "react-icons/vsc";
import Button from "../Button";
import Modal from "../Modal";
import Input from "../Input";
import TreeModal from "../TreeModal";
import useCategoryStore from "../../store/categoryStore";
import CategoryTree from "../../components/CategoryTree"; // 새로 만든 재귀 트리 컴포넌트
import { HiFolder } from "react-icons/hi2";

export default function SideMenuBottom() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [isAddRootModalOpen, setIsAddRootModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openRootId, setOpenRootId] = useState(null);

  const {
    categories,
    addCategory,
    fetchCategories,
    selectedCategory,
    selectCategory,
    findCategoryByName,
  } = useCategoryStore();

  // 루트 카테고리만 추출
  const getRootCategories = () =>
    categories.filter((cat) => cat.parentId === null || cat.parentId === undefined);

  const handleCategoryClick = (category) => {
    selectCategory(category.id);
    navigate(`/subject/${category.id}`, {
      state: { Subjectinfo: category },
    });
    if (!category.parentId) {
      setOpenRootId(category.id);
    }
  };

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        const data = await fetchCategories();
        if (!data || data.length === 0) {
          return;
        }

        const defaultCategory =
          findCategoryByName("Default") ||
          data.find((cat) => cat.parentId === null) ||
          data[0];

        const isHomePage = window.location.pathname === "/";
        if (isHomePage) {
          selectCategory(defaultCategory.id);
        } else {
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

  const handleAddSubject = async (parentId, name) => {
    if (!name || name.trim() === "") {
      setErrorMessage("주제명을 입력해주세요.");
      return;
    }

    try {
      await addCategory({
        name: name.trim(),
        parentId: parentId || null,
      });
      inputRef.current.value = "";
      setIsAddModalOpen(false);
      setErrorMessage("");
      await fetchCategories();
      selectCategory(parentId);
    } catch (error) {
      setErrorMessage("주제 추가에 실패했습니다.");
    }
  };

  const handleAddRootCategory = async (name) => {
    if (!name || name.trim() === "") {
      setErrorMessage("메인 카테고리명을 입력해주세요.");
      return;
    }

    try {
      await addCategory({
        name: name.trim(),
        parentId: null,
      });
      inputRef.current.value = "";
      setIsAddRootModalOpen(false);
      setErrorMessage("");
      await fetchCategories();
    } catch (error) {
      setErrorMessage("메인 카테고리 추가에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 h-full text-gray-800 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-700">주제</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">메인 카테고리 추가</h3>
            <Button
              onClick={() => setIsAddRootModalOpen(true)}
              variant="SubjectOther"
              style={{ width: "auto", padding: "0.5rem" }}
            >
              <VscNewFolder />
            </Button>
          </div>

          {getRootCategories().map((rootCategory) => (
            <div key={rootCategory.id} className="mb-2">
              <div className="flex items-center gap-1">
                <div className="flex-grow">
                  <Button
                    variant={selectedCategory?.id === rootCategory.id ? "SubjectDefault" : "SubjectOther"}
                    onClick={() => handleCategoryClick(rootCategory)}
                    className={`w-full ${
                      selectedCategory?.id === rootCategory.id
                        ? "bg-blue-100 border-blue-300 text-blue-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <HiFolder
                        className={`inline-block mr-1 ${
                          selectedCategory?.id === rootCategory.id ? "text-blue-600" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`truncate ${
                          selectedCategory?.id === rootCategory.id
                            ? "text-blue-800 font-semibold"
                            : "text-gray-800"
                        }`}
                      >
                        {rootCategory.name}
                      </span>
                      {rootCategory.videos && rootCategory.videos.length > 0 && (
                        <span
                          className={`ml-1 text-sm ${
                            selectedCategory?.id === rootCategory.id ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          ({rootCategory.videos.length})
                        </span>
                      )}
                    </div>
                  </Button>
                </div>
                {selectedCategory?.id === rootCategory.id && (
                  <>
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
                  </>
                )}
              </div>

              {/* 선택된 루트만 트리 전체(무한 깊이)로 렌더링 */}
              {openRootId === rootCategory.id && (
                <div className="ml-4 space-y-1 mt-1">
                  {/* children만 넘겨줌 */}
                  {rootCategory.children && rootCategory.children.length > 0 &&
                    rootCategory.children.map((child) => (
                      <CategoryTree
                        key={child.id}
                        category={child}
                        selectedCategory={selectedCategory}
                        onCategoryClick={handleCategoryClick}
                        onTreeModalOpen={() => setIsTreeModalOpen(true)}
                        onAddModalOpen={() => setIsAddModalOpen(true)}
                        level={1}
                      />
                    ))}
                </div>
              )}
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
            <Input ref={inputRef} variant="AddSubject" placeholder="새 주제 이름" />
            <Button onClick={() => handleAddSubject(selectedCategory?.id, inputRef.current.value)}>
              <VscNewFolder />
            </Button>
          </div>
          {errorMessage && <p className="text-red-400 text-sm mt-1">{errorMessage}</p>}
        </div>
      </Modal>

      <Modal
        isOpen={isAddRootModalOpen}
        onClose={() => {
          setIsAddRootModalOpen(false);
          setErrorMessage("");
        }}
        title="메인 카테고리 추가"
        variant="AddSubject"
        inputRef={inputRef}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Input ref={inputRef} variant="AddSubject" placeholder="새 메인 카테고리 이름" />
            <Button onClick={() => handleAddRootCategory(inputRef.current.value)}>
              <VscNewFolder />
            </Button>
          </div>
          {errorMessage && <p className="text-red-400 text-sm mt-1">{errorMessage}</p>}
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
