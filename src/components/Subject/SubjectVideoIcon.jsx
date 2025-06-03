import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdPlaylistAdd, MdOutlineSync } from "react-icons/md";
import Modal from "../Modal";
import Button from "../Button";
import TreeModal from "../TreeModal"; // TreeModal 임포트
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
  const [error, setError] = useState("");
  const menuRef = useRef(null);

  // 카테고리 스토어에서 필요한 함수와 상태 가져오기
  const { categories, fetchCategories } = useCategoryStore();

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
        handleDeleteVideo(subjectId, videoId);
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
  const handleDeleteVideo = (subjectId, videoId) => {
    console.log("영상 삭제 요청:", subjectId, videoId);
    deleteCategoryVideo(subjectId, videoId);
    fetchCategories();

    if (onVideoUpdate) {
      onVideoUpdate(); // SubjectPage의 비디오 목록 등 업데이트
    }
  };

  // TreeModal에서 카테고리 선택 시 호출될 함수
  const handleSelectTargetCategoryAndMove = async (targetCategoryId) => {
    setIsMoveModalOpen(false); // TreeModal을 먼저 닫습니다.

    if (!videoId) {
      setError("비디오 ID 정보가 없습니다.");
      console.error("handleSelectTargetCategoryAndMove: videoId is missing");
      return;
    }

    if (!subjectId) {
      setError("현재 주제 ID를 찾을 수 없습니다.");
      console.error("handleSelectTargetCategoryAndMove: subjectId is missing");
      return;
    }

    const currentCategoryId = parseInt(subjectId);

    if (currentCategoryId === targetCategoryId) {
      setError("이미 해당 주제에 있는 영상입니다.");
      return;
    }

    console.log("=== 비디오 이동 (TreeModal) 디버깅 정보 ===");
    console.log("현재 카테고리 ID:", currentCategoryId);
    console.log("비디오 ID:", videoId);
    console.log("이동할 카테고리 ID:", targetCategoryId);

    setError("");

    try {
      await moveCategoryVideo(currentCategoryId, videoId, targetCategoryId);
      console.log(`영상이 성공적으로 이동됨 (대상 ID: ${targetCategoryId})`);

      // 카테고리 목록 새로고침 (SideMenu 등 관련 컴포넌트 업데이트 위해)
      await fetchCategories();

      if (onVideoUpdate) {
        onVideoUpdate(); // SubjectPage의 비디오 목록 등 업데이트
      }
    } catch (err) {
      console.error("비디오 이동 중 오류 발생:", err);
      setError(err.message || "비디오 이동에 실패했습니다. 다시 시도해주세요.");
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

      {/* 비디오 이동 모달 */}
      {isMoveModalOpen && (
        <TreeModal
          isOpen={isMoveModalOpen}
          onClose={() => {
            setIsMoveModalOpen(false);
            setError(""); // 모달 닫을 때 에러 메시지 초기화
          }}
          title="이동할 주제 선택"
          onCategorySelect={(targetCategoryId) =>
            handleSelectTargetCategoryAndMove(targetCategoryId)
          } // 주제 선택 시 호출될 콜백
        />
      )}
      {/* 비디오 이동 작업 관련 에러 메시지 표시 */}
      {error && !isMoveModalOpen && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
