import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import {
  MdPlaylistAdd,
  MdOutlineArrowForward,
  MdOutlineSync,
} from "react-icons/md";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import useCategoryStore from "../../store/categoryStore";
import { moveCategoryVideo, deleteCategoryVideo } from "../../api/category";
import { useParams } from "react-router-dom";

export default function SubjectVideoIcon({
  name,
  videoId,
  onClick,
  video,
  onVideoUpdate,
}) {
  // useParams를 올바르게 호출하여 URL 파라미터 가져오기
  const { subjectId } = useParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // 카테고리 스토어에서 필요한 함수와 상태 가져오기
  const { categories, fetchCategories, findCategoryByName } =
    useCategoryStore();

  // YouTube 썸네일 URL 생성
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;

  // 외부 클릭시 드롭다운이 닫힘
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 메뉴 버튼 클릭 핸들러
  const handleMenuClick = (e) => {
    e.stopPropagation(); // 비디오 클릭 이벤트 방지
    setMenuOpen(!menuOpen);
  };

  // 메뉴 아이템 클릭 핸들러
  const handleMenuItemClick = (action, e) => {
    e.stopPropagation();
    setMenuOpen(false);

    switch (action) {
      case "delete":
        handleDeleteVideo();
        break;
      case "playlist":
        setIsMoveModalOpen(true);
        setError("");
        break;
      default:
        break;
    }
  };

  // 삭제 처리 함수 - 아직 API 없음
  const handleDeleteVideo = () => {
    console.log("영상 삭제 요청:", videoId);
  };

  // 비디오 이동 처리 - URL에서 현재 카테고리 ID 직접 사용
  const handleMoveVideo = async () => {
    // 기본 검증
    if (!categoryName) {
      setError("이동할 주제 이름을 입력해주세요.");
      return;
    }

    if (!videoId) {
      setError("비디오 ID 정보가 없습니다.");
      return;
    }

    if (!subjectId) {
      setError("현재 주제 ID를 찾을 수 없습니다.");
      return;
    }

    // 이름으로 대상 카테고리 검색
    const targetCategory = findCategoryByName(categoryName);

    if (!targetCategory) {
      setError("입력한 이름의 주제를 찾을 수 없습니다.");
      return;
    }

    const targetCategoryId = targetCategory.id;
    const currentCategoryId = parseInt(subjectId);

    // 같은 카테고리로 이동하려는 경우 체크
    if (currentCategoryId === targetCategoryId) {
      setError("이미 해당 주제에 있는 영상입니다.");
      return;
    }

    // 디버깅 정보 출력
    console.log("=== 비디오 이동 디버깅 정보 ===");
    console.log("현재 카테고리 ID:", currentCategoryId);
    console.log("비디오 ID:", videoId);
    console.log("이동할 카테고리 ID:", targetCategoryId);
    console.log("이동할 카테고리명:", categoryName);

    setIsLoading(true);
    setError("");

    try {
      // API 호출 - 명확한 파라미터 이름으로 수정
      await moveCategoryVideo(currentCategoryId, videoId, targetCategoryId);

      // 성공 메시지와 상태 업데이트
      console.log(`영상이 "${targetCategory.name}" 주제로 성공적으로 이동됨`);

      // 카테고리 목록 새로고침
      await fetchCategories();

      // 모달 닫기
      setIsMoveModalOpen(false);
      setCategoryName("");

      // 부모에게 업데이트 알림
      if (onVideoUpdate) {
        onVideoUpdate();
      }
    } catch (error) {
      console.error("비디오 이동 중 오류 발생:", error);
      setError("비디오 이동에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer relative border border-gray-300">
      <div className="relative" onClick={onClick}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={name}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-red-500 flex items-center justify-center text-white">
            비디오 썸네일 없음
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          <button
            className="w-8 h-8 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
            onClick={handleMenuClick}
          >
            <BsThreeDotsVertical />
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-1 w-48 bg-white shadow-md rounded-md overflow-hidden z-20 border border-gray-200"
            >
              <ul className="py-1">
                <li className="hover:bg-gray-100">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 flex items-center gap-2"
                    onClick={(e) => handleMenuItemClick("playlist", e)}
                  >
                    <MdPlaylistAdd className="text-gray-600" />
                    <span>다른 주제로 이동</span>
                  </button>
                </li>
                <li className="hover:bg-gray-100">
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 flex items-center gap-2"
                    onClick={(e) => handleMenuItemClick("delete", e)}
                  >
                    <FaTrash className="text-red-600" />
                    <span>삭제</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4" onClick={onClick}>
        <h3 className="font-medium text-gray-800 line-clamp-2 h-12">{name}</h3>
      </div>

      {/* 비디오 이동 모달은 Modal 컴포넌트에서 이미 다크모드로 변경됨 */}
      <Modal
        isOpen={isMoveModalOpen}
        onClose={() => {
          setIsMoveModalOpen(false);
          setCategoryName("");
          setError("");
        }}
        title="다른 주제로 이동"
        variant="AddSubject"
        inputRef={inputRef}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Input
              ref={inputRef}
              variant="AddSubject"
              placeholder="이동할 주제 이름 입력"
              defaultValue={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <Button onClick={handleMoveVideo} disabled={isLoading}>
              {isLoading ? (
                <MdOutlineSync className="animate-spin text-lg" />
              ) : (
                <MdOutlineArrowForward className="text-lg" />
              )}
            </Button>
          </div>
          {/* 에러 메시지 표시 영역 */}
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
