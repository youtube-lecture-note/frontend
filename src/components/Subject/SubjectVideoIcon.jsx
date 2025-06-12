import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaEdit } from "react-icons/fa";
import { MdPlaylistAdd, MdOutlineSync } from "react-icons/md";
import Modal from "../Modal";
import Button from "../Button";
import TreeModal from "../TreeModal";
import useCategoryStore from "../../store/categoryStore";
import { moveCategoryVideo, deleteCategoryVideo } from "../../api/category";
import { updateVideoTitleApi } from "../../api/videoSummary";
import { useParams, useNavigate } from "react-router-dom";

export default function SubjectVideoIcon({ onClick, video, onVideoUpdate, onOpenMoveModal }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(video.userVideoName || "");
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef(null);

  const { categories, fetchCategories, selectCategory } = useCategoryStore();

  // YouTube 썸네일 URL 생성
  const thumbnailUrl = video.videoId
    ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
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

  // 제목 수정 처리 함수
  const handleTitleUpdate = async () => {
    if (!editTitle.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    setIsUpdatingTitle(true);
    setError("");

    try {
      await updateVideoTitleApi(video.videoId, editTitle.trim());
      setIsEditingTitle(false);
      setMenuOpen(false);

      // 부모 컴포넌트의 새로고침 함수 호출
      if (onVideoUpdate) {
        console.log("제목 수정 후 비디오 목록 새로고침 호출");
        await onVideoUpdate();
      }
    } catch (error) {
      console.error("제목 수정 실패:", error);
      setError("제목 수정에 실패했습니다.");
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  // 제목 수정 취소
  const handleCancelTitleEdit = () => {
    setEditTitle(video.userVideoName || "");
    setIsEditingTitle(false);
    setError("");
  };

  // 메뉴 버튼 클릭 핸들러
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  // 메뉴 아이템 클릭 핸들러
  const handleMenuItemClick = (action, e) => {
    e.stopPropagation();
    setMenuOpen(false);

    switch (action) {
      case "delete":
        handleDeleteVideo(subjectId, video.videoId);
        break;
      case "playlist":
        // 부모 컴포넌트로부터 받은 함수를 호출하여 모달을 엽니다.
        onOpenMoveModal();
        break;
      case "edit":
        setIsEditingTitle(true);
        setEditTitle(video.userVideoName || "");
        setError("");
        break;
      default:
        break;
    }
  };

  // 삭제 처리 함수
  const handleDeleteVideo = async (subjectId, videoId) => {
    console.log("영상 삭제 요청:", subjectId, videoId);
    try {
      await deleteCategoryVideo(subjectId, videoId);

      if (onVideoUpdate) {
        console.log("비디오 삭제 후 목록 새로고침 호출");
        await onVideoUpdate();
      }
    } catch (error) {
      console.error("비디오 삭제 중 오류 발생:", error);
      setError(error.message || "비디오 삭제에 실패했습니다.");
    }
  };


  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer relative border border-gray-300">
      <div className="relative" onClick={!isEditingTitle ? onClick : undefined}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={video.userVideoName}
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
                    onClick={(e) => handleMenuItemClick("edit", e)}
                  >
                    <FaEdit className="text-blue-600" />
                    <span>제목 수정</span>
                  </button>
                </li>
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

      <div className="p-4" onClick={!isEditingTitle ? onClick : undefined}>
        {isEditingTitle ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="비디오 제목을 입력하세요"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTitleUpdate();
                }}
                disabled={isUpdatingTitle}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                {isUpdatingTitle ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelTitleEdit();
                }}
                disabled={isUpdatingTitle}
                className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 text-sm"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <h3 className="font-medium text-gray-800 line-clamp-2 h-12">
            {video.userVideoName || "제목 없음"}
          </h3>
        )}
      </div>
    </div>
  );
}
