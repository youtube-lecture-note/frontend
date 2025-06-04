import Button from "./Button";
import SubjectNode from "./Subject/SubjectNode";
import useCategoryStore from "../store/categoryStore";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Modal from "./Modal";
import { VscNewFolder } from "react-icons/vsc";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function TreeModal({
  isOpen,
  onClose,
  title,
  variant,
  children,
  subjects,
  setSubjects,
  onCategorySelect, // 새로운 prop 추가
  ...props
}) {
  const {
    categories,
    fetchCategories,
    deleteCategory,
    findCategoryById,
    selectCategory,
    addCategory: addCategoryAction,
    isLoading,
    error,
  } = useCategoryStore();
  const navigate = useNavigate();

  // 하위 주제 추가를 위한 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(""); // 삭제 에러 메시지 추가
  const inputRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 카테고리 데이터 로드
    fetchCategories();
  }, [fetchCategories]);

  // 주제 삭제 핸들러
  const handleDeleteSubject = async (subjectId) => {
    try {
      console.log(`주제 ${subjectId} 삭제 요청`);

      // 삭제하기 전에 삭제될 주제의 부모 ID 찾기
      const categoryToDelete = findCategoryById(subjectId);

      // 하위 주제 확인
      if (categoryToDelete?.children && categoryToDelete.children.length > 0) {
        // 하위 주제가 있으면 에러 메시지 설정하고 삭제 중단
        setDeleteErrorMessage(
          "하위 주제가 있는 카테고리는 삭제할 수 없습니다. 먼저 하위 주제를 삭제해주세요."
        );

        // 3초 후에 에러 메시지 자동 제거
        setTimeout(() => {
          setDeleteErrorMessage("");
        }, 3000);

        return;
      }

      const parentId = categoryToDelete?.parentId || 1; // 부모가 없으면 루트(1)로 설정

      await deleteCategory(subjectId);
      console.log(`주제 ${subjectId} 삭제 성공`);

      // 에러 메시지 초기화
      setDeleteErrorMessage("");

      // 현재 선택된 카테고리가 삭제된 카테고리인지 확인
      const currentSelected = useCategoryStore.getState().selectedCategory;

      // 삭제한 주제가 현재 선택된 주제이거나 그 하위 주제인 경우
      if (
        currentSelected &&
        (currentSelected.id === subjectId ||
          isChildCategory(currentSelected.id, subjectId))
      ) {
        // 상위 카테고리로 선택 변경
        selectCategory(parentId);
      }
    } catch (error) {
      console.error(`주제 ${subjectId} 삭제 실패:`, error);
      setDeleteErrorMessage("주제 삭제에 실패했습니다: " + error.message);

      // 3초 후에 에러 메시지 자동 제거
      setTimeout(() => {
        setDeleteErrorMessage("");
      }, 3000);
    }
  };

  // 특정 카테고리가 다른 카테고리의 하위 카테고리인지 확인하는 유틸리티 함수
  const isChildCategory = (childId, parentId) => {
    const parent = findCategoryById(parentId);
    if (!parent || !parent.children) return false;

    // 직접적인 자식인지 확인
    if (parent.children.some((child) => child.id === childId)) return true;

    // 재귀적으로 모든 하위 자식들 확인
    for (const child of parent.children) {
      if (isChildCategory(childId, child.id)) return true;
    }

    return false;
  };

  // 주제 클릭 핸들러 추가
  const handleSubjectClick = (categoryId) => {
    console.log("TreeModal - 선택한 주제 ID:", categoryId);

    if (onCategorySelect) {
      // onCategorySelect prop이 제공되면 해당 콜백 실행
      onCategorySelect(categoryId);
      // onClose(); // SubjectVideoIcon에서 모달을 닫도록 변경 (선택 후 추가 작업이 있을 수 있으므로)
      // 다만, TreeModal을 닫는 책임은 onCategorySelect를 호출하는 쪽으로 넘기거나, 여기서 onClose를 호출할지 결정 필요.
      // 현재 SubjectVideoIcon에서 onCategorySelect 후 모달을 닫으므로 여기서는 중복 호출 방지.
    } else {
      // 기존 로직: 카테고리 선택 및 페이지 이동
      selectCategory(categoryId);
      onClose(); // 이 경우에는 TreeModal이 직접 닫도록 함

      const selectedCat = findCategoryById(categoryId);
      if (selectedCat) {
        navigate(`/subject/${categoryId}`, {
          state: { Subjectinfo: selectedCat },
        });
      } else {
        console.error("선택한 주제를 찾을 수 없습니다. ID:", categoryId);
      }
    }
  };

  // 주제 추가 모달을 띄우는 핸들러
  const handleAddButtonClick = (parentId) => {
    setParentCategoryId(parentId);
    setErrorMessage(""); // 에러 메시지 초기화
    setIsAddModalOpen(true);
  };

  // 새로운 하위 주제 추가 핸들러
  const handleAddSubject = async () => {
    if (!inputRef.current || !inputRef.current.value.trim()) {
      setErrorMessage("주제명을 입력해주세요.");
      return;
    }

    try {
      await addCategoryAction({
        name: inputRef.current.value.trim(),
        parentId: parentCategoryId,
      });

      setErrorMessage(""); // 성공 시 에러 메시지 초기화
      setIsAddModalOpen(false);
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
  };

  // 모달 닫기 시 루트 카테고리 선택 및 상태 업데이트
  const handleClose = () => {
    // 루트 카테고리 선택
    selectCategory(1);

    // 카테고리 데이터 새로고침 (사이드바 상태 업데이트)
    fetchCategories();

    // 원래의 onClose 호출
    onClose();
  };

  return (
    isOpen && (
      <>
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50 border-2 border-gray-200">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col w-11/12 max-w-2xl h-5/6 md:h-4/5 lg:h-3/4 text-gray-800">
            <div className="flex flex-row justify-between w-full pb-4 text-left">
              <h2 className="text-xl font-bold bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                {title}
              </h2>
              <Button onClick={handleClose} variant="Close">
                <AiOutlineCloseCircle className="text-gray-600 hover:text-gray-800" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-grow w-full border border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-800">
              {deleteErrorMessage && (
                <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
                  <p className="font-semibold">{deleteErrorMessage}</p>
                </div>
              )}

              {!isLoading && !error && categories.length === 0 ? (
                <p className="text-gray-500">저장된 주제가 없습니다.</p>
              ) : (
                <div className="space-y-1">
                  {categories.map((subject) => (
                    <SubjectNode
                      key={subject.id}
                      subject={subject}
                      level={0}
                      handleDeleteSubject={handleDeleteSubject}
                      handleSubjectClick={handleSubjectClick}
                      handleAddButtonClick={handleAddButtonClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하위 주제 추가를 위한 모달 */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setErrorMessage("");
          }}
          title="하위 주제 추가"
          variant="AddSubject"
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <Input
                ref={inputRef}
                variant="AddSubject"
                placeholder="새 하위 주제 이름"
              />
              <Button onClick={handleAddSubject}>
                <VscNewFolder />
              </Button>
            </div>
            {errorMessage && (
              <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        </Modal>
      </>
    )
  );
}
