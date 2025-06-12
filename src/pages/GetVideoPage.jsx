// 영상 링크 입력시 가져오는 화면
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaPencilAlt } from "react-icons/fa";

import Title from "../components/Title";
import YouTube from "react-youtube";
import Button from "../components/Button";
import TopBar from "../components/TopBar/TopBar";
import DisplaySummaryLine from "../components/Summary/DisplaySummaryLine";
import SearchVideo from "../components/Search/SearchVideo";
import Modal from "../components/Modal";
import TreeModal from "../components/TreeModal";
import PersonalQuizModal from "../components/Quiz/PersonalQuizModal.js";
import TeacherCreateQuizPage from "./multiquiz/TeacherCreateQuizPage";
import {
  videoSummaryApi,
  addVideoToCategory,
  fetchYoutubeVideoTitle,
  checkVideoInCategories,
  updateVideoTitleApi
} from "../api/index.js";
import useCategoryStore from "../store/categoryStore";

export default function GetVideoPage() {
  const inputURLRef = useRef(null);
  const [summary, setSummary] = useState("");
  // 로딩, 에러
  const [loading, setLoading] = useState(false);
  const [openQuizSetModal, setOpenQuizSetModal] = useState(false);

  const [error, setError] = useState("");
  const { videoId } = useParams();
  const navigate = useNavigate();

  // YouTube 플레이어 참조 추가
  const [player, setPlayer] = useState(null);

  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  // YouTube 플레이어 준비 완료 핸들러
  const onReady = (event) => {
    // 플레이어 참조 저장
    setPlayer(event.target);
  };

  // 특정 시간으로 이동하는 함수
  const seekToTime = (timeString) => {
    if (!player) return;

    // 분:초 형식의 시간 문자열을 초로 변환
    const [minutes, seconds] = timeString.split(":").map(Number);
    const timeInSeconds = minutes * 60 + seconds;

    // 플레이어를 해당 시간으로 이동
    player.seekTo(timeInSeconds);
  };

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const [videoTitle, setVideoTitle] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [videoSaved, setVideoSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedSubjects, setSavedSubjects] = useState([]);

  // 퀴즈 로딩 상태
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

  const [showPersonalQuizModal, setShowPersonalQuizModal] = useState(false);

  // 영상 제목 편집
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  // 개인 퀴즈 모달에서 퀴즈 생성 후 퀴즈 페이지로 이동하는 핸들러
  const handlePersonalQuizStart = (quizData) => {
    setShowPersonalQuizModal(false);
    navigate(`/video/${videoId}/quiz`, {
      state: {
        quizData: quizData,
        preloaded: true,
      },
    });
  };

  // 비디오 요약 및 제목 가져오기
  useEffect(() => {
    async function fetchVideoData() {
      if (!videoId) return;

      setLoading(true);
      setError("");

      try {
        // Promise.all을 사용하여 제목, 저장 상태, 요약 정보를 병렬로 가져옵니다.
        const [youtubeTitle, videoStatus, summaryData] = await Promise.all([
          fetchYoutubeVideoTitle(videoId),
          checkVideoInCategories(videoId),
          videoSummaryApi(videoId),
        ]);

        // 1. 요약 데이터 상태를 먼저 설정합니다.
        setSummary(summaryData.data || summaryData);

        // 2. 영상 저장 상태를 확인하고 처리합니다.
        if (videoStatus.exists) {
          setVideoTitle(videoStatus.categories[0].userVideoName);
          setSavedSubjects(videoStatus.categories);
          setVideoSaved(true);
        } else {
          // 3. 영상이 저장되지 않은 경우, 모든 데이터 로드가 완료된 후 저장 모달을 띄웁니다.
          setVideoTitle(youtubeTitle);
          setVideoSaved(false);
          setShowSaveModal(true); // 요약(summary) API가 완료된 후에 호출됩니다.
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setError(error.message || "데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideoData();
  }, [videoId]);

  // 주제 선택 후 영상 저장 핸들러
  const handleCategorySave = async ({ categoryId, title }) => {
    try {
      if(!loading){
        await useCategoryStore.getState().addVideoToCategory(categoryId, videoId, title);
        await fetchCategories(); // 상태 강제 갱신
        setVideoSaved(true);
        setVideoTitle(title);
        setShowSaveModal(false);
        setSaveError("");
      }
    } catch (error) {
      setSaveError(error.message || "저장 중 오류가 발생했습니다.");
    }
  };

  // 저장 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowSaveModal(false);
  };
  // 3. 제목 수정 완료 후 API 전송을 위한 핸들러
  const handleTitleUpdate = async () => {
    if (!editedTitle.trim()) {
      alert("제목은 비워둘 수 없습니다.");
      return;
    }

    try {
      // 서버에 제목 업데이트 요청
      await updateVideoTitleApi(videoId, editedTitle);

      // 성공 시 로컬 상태 업데이트
      setVideoTitle(editedTitle);
      setIsEditingTitle(false); // 편집 모드 종료
    } catch (error) {
      console.error("제목 업데이트 실패:", error);
      alert("제목을 업데이트하는 중 오류가 발생했습니다.");
    }
  };


  // 데이터 파싱 함수
  function parseSummary(data) {
    if (!data) return [];

    const result = [];
    const lines = data.split("\n");
    let currentTime = "";
    let currentText = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const timeMatch = line.trim().match(/^<(\d+);(.*)>$/);

      if (timeMatch) {
        if (currentTime && currentText.length > 0) {
          result.push({
            time:
              Math.floor(currentTime / 60) +
              ":" +
              String(currentTime % 60).padStart(2, "0"),
            text: currentText.join("\n"),
          });
        }
        currentTime = timeMatch[1];
        currentText = [timeMatch[2].trim()];
      } else {
        currentText.push(line);
      }
    }

    if (currentTime && currentText.length > 0) {
      result.push({
        time:
          Math.floor(currentTime / 60) +
          ":" +
          String(currentTime % 60).padStart(2, "0"),
        text: currentText.join("\n"),
      });
    }
    return result;
  }

  const parse_summary = parseSummary(summary);

  let noData = `<0; 데이터가 없습니다.>
- 데이터가 없습니다.
- 데이터가 없습니다.
- 데이터가 없습니다.`;

  // 시간 형식(분:초)을 초로 변환하는 함수
  const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  // 정렬된 요약 데이터 생성
  const displaySummary = (
    parse_summary.length === 0 ? parseSummary(noData) : parse_summary
  ).sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));

  // 노트 저장 함수
  function handleSaveNote() {
    // 페이지에서 모든 timestamp-container 클래스, textarea 요소 찾기
    const timestampContainers = document.querySelectorAll(
      ".timestamp-container"
    );
    const textareas = document.querySelectorAll("textarea");

    // 모든 텍스트 수집
    let noteContent = "";

    for (let i = 0; i < timestampContainers.length; i++) {
      noteContent += timestampContainers[i].innerText + "\n";
      noteContent += textareas[i].value + "\n\n";
    }

    // 텍스트 파일 생성 및 다운로드
    const blob = new Blob([noteContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // 파일명 생성 로직 개선
    let fileName = "";

    if (videoTitle === "제목을 가져올 수 없음") {
      fileName = `${videoId}_note.txt`;
    } else {
      // 파일명에 사용할 수 없는 특수문자 제거
      let safeTitle = videoTitle.replace(/[\\/:*?"<>|]/g, "_");

      // 파일명 길이 제한 (50자)
      if (safeTitle.length > 50) {
        safeTitle = safeTitle.substring(0, 47) + "...";
      }

      fileName = `${safeTitle}_note.txt`;
    }

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 영역: 비디오 플레이어 */}
        <div className="w-3/5 border-r border-gray-200 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="w-full">
            <YouTube
              videoId={videoId}
              opts={opts}
              className="w-full"
              onReady={onReady}
            />
          </div>
          {videoTitle && (
            <div className="flex items-center justify-between mb-4">
              <div>
                {isEditingTitle ? (
                  // 편집 모드일 때
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-2xl font-bold p-1 border rounded-md"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()} // Enter 키로 저장
                    />
                    <Button onClick={handleTitleUpdate}>저장</Button>
                    <Button onClick={() => setIsEditingTitle(false)} variant="secondary">취소</Button>
                  </div>
                ) : (
                  // 일반 모드일 때
                  <div className="flex items-center gap-2">
                    <Title>{videoTitle}</Title>
                    {videoSaved && ( // 영상이 저장된 경우에만 연필 아이콘 표시
                      <FaPencilAlt
                        className="cursor-pointer text-gray-500 hover:text-gray-800 ml-2"
                        onClick={() => {
                          setEditedTitle(videoTitle); // 현재 제목으로 편집 시작
                          setIsEditingTitle(true);
                        }}
                      />
                    )}
                  </div>
                )}
                {savedSubjects.length > 0 && (
                  <div className="text-sm text-gray-600">
                    주제:
                    {savedSubjects.map((subject, index) => (
                      <span key={subject.categoryId} className="ml-1">
                        {index > 0 && ", "}
                        <span
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() =>
                            navigate(`/subject/${subject.categoryId}`)
                          }
                        >
                          {videoSaved
                            ? subject.categoryName
                            : "저장된 주제가 없습니다."}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 퀴즈 에러 메시지 - 여기로 이동 */}
          {quizError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{quizError}</span>
                <button
                  onClick={() => setQuizError("")}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <SearchVideo inputURLRef={inputURLRef} variant={"SearchVideo"} />
          <div className="flex justify-center gap-4 mt-4 mb-4">
            <Button
              onClick={() => setOpenQuizSetModal(true)}
              disabled={quizLoading}
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
            >
              공동 퀴즈 생성
            </Button>
            <Button
              onClick={() => setShowPersonalQuizModal(true)}
              disabled={quizLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {quizLoading ? "로딩중..." : "문제 풀기"}
            </Button>
            <Button
              onClick={() => navigate(`/attempts/youtube/${videoId}`)}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              풀이 기록
            </Button>
          </div>
        </div>

        {/* 오른쪽 영역: 강의 노트 */}
        <div className={`w-2/5 p-4 overflow-y-auto`}>
          <Title size="small">강의 노트</Title>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <span>강의 노트 제작중</span>
            </div>
          ) : (
            <div className="rounded-lg p-4">
              <div className="flex flex-col gap-4 pb-4">
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : displaySummary.length === 0 ? (
                  <p className="text-gray-500">데이터가 없습니다</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {displaySummary.map((item) => (
                      <DisplaySummaryLine
                        key={item.time}
                        time={item.time}
                        text={item.text}
                        onTimeClick={seekToTime}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveNote}>저장</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 개인 퀴즈 생성 모달 */}
      <Modal
        isOpen={showPersonalQuizModal}
        onClose={() => setShowPersonalQuizModal(false)}
        title="개인 퀴즈 생성"
      >
        <PersonalQuizModal
          videoId={videoId}
          onQuizStart={handlePersonalQuizStart}
          onClose={() => setShowPersonalQuizModal(false)}
        />
      </Modal>
      {/* 공동 퀴즈 생성 모달 */}
      <Modal
        isOpen={openQuizSetModal}
        onClose={() => setOpenQuizSetModal(false)}
        title="퀴즈 세트 생성"
      >
        <TeacherCreateQuizPage videoId={videoId} />
      </Modal>

      {/* 주제 선택 모달 */}
      <TreeModal
        isOpen={showSaveModal}
        onClose={handleCloseModal}
        title="영상을 저장할 주제 선택"
        onCategorySelect={handleCategorySave}
        initialTitle={videoTitle}
        showVideoTitleInput={true}
      />

      {/* 저장 오류 메시지 */}
      {saveError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-red-400 border px-4 py-2 rounded text-red-700">
          {saveError}
        </div>
      )}
    </div>
  );
}
