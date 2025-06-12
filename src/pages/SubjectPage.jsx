import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react"; // useState 추가

import TopBar from "../components/TopBar/TopBar";
import SubjectVideoIcon from "../components/Subject/SubjectVideoIcon";
import Button from "../components/Button";
import useCategoryStore from "../store/categoryStore";
import TreeModal from "../components/TreeModal"; // TreeModal import 추가
import { moveCategoryVideo } from "../api/category"; // 비디오 이동 API import 추가

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const findCategoryById = useCategoryStore((state) => state.findCategoryById);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const isLoading = useCategoryStore((state) => state.isLoading);
  const categories = useCategoryStore((state) => state.categories);
  const selectCategory = useCategoryStore((state) => state.selectCategory); // selectCategory 추가

  // TreeModal 상태 관리
  const [moveModal, setMoveModal] = useState({
    isOpen: false,
    videoToMove: null,
  });

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const subjectInfo = findCategoryById(parseInt(subjectId));
  const subjectVideos = subjectInfo?.videos || [];

  const handleVideoUpdate = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleBackToParent = () => {
    if (subjectInfo?.parentId) {
      const parentCategory = findCategoryById(subjectInfo.parentId);
      if (parentCategory) {
        navigate(`/subject/${subjectInfo.parentId}`);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  // 비디오 이동 모달을 여는 함수
  const handleOpenMoveModal = (video) => {
    setMoveModal({ isOpen: true, videoToMove: video });
  };

  // 비디오를 다른 주제로 이동시키는 함수
  const handleMoveVideo = async (targetCategoryId) => {
    console.log("target category id: ",targetCategoryId);
    if (!moveModal.videoToMove || !subjectId) return;

    const currentCategoryId = parseInt(subjectId, 10);
    const videoId = moveModal.videoToMove.videoId;
    const targetId = parseInt(targetCategoryId, 10);

    if (currentCategoryId === targetId) {
      setMoveModal({ isOpen: false, videoToMove: null });
      return;
    }

    try {
      await moveCategoryVideo(currentCategoryId, videoId, targetId);
      await fetchCategories();
      selectCategory(targetId);
      navigate(`/subject/${targetId}`);
    } catch (error) {
      console.error("비디오 이동 실패:", error);
    } finally {
      setMoveModal({ isOpen: false, videoToMove: null });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex items-center mb-8 gap-4">
          <Button
            onClick={handleBackToParent}
            variant="icon"
            className="hover:bg-gray-200 p-2 rounded-full"
          >
            <FaArrowLeft className="text-gray-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {subjectInfo?.name || "주제 없음"}
            </h1>
            <p className="text-gray-500 mt-1">
              {subjectVideos.length > 0
                ? `${subjectVideos.length}개의 동영상`
                : "저장된 동영상이 없습니다"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : subjectVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectVideos.map((video) => (
              <SubjectVideoIcon
                key={video.videoId}
                video={video}
                onClick={() => handleVideoClick(video.videoId)}
                onVideoUpdate={handleVideoUpdate}
                onOpenMoveModal={() => handleOpenMoveModal(video)} // 모달 열기 함수 전달
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              저장된 동영상이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">이 주제에 동영상을 추가해보세요.</p>
            <Button onClick={() => navigate("/")}>동영상 검색하기</Button>
          </div>
        )}
      </div>

      {/* TreeModal을 SubjectPage에서 직접 렌더링 */}
      {moveModal.isOpen && (
        <TreeModal
          isOpen={moveModal.isOpen}
          onClose={() => setMoveModal({ isOpen: false, videoToMove: null })}
          title="이동할 주제 선택"
          onCategorySelect={({ categoryId }) => handleMoveVideo(categoryId)}
        />
      )}
    </div>
  );
}
