// 영상 링크 입력시 가져오는 화면
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

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
  quizGetApi,
  addVideoToCategory,
  fetchYoutubeVideoTitle,
  checkVideoInCategories,
} from "../api/index.js";

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

  // 비디오 요약 가져오기
  useEffect(() => {
    async function fetchSummary() {
      if (!videoId) return;

      setLoading(true);
      setError("");

      try {
        const data = await videoSummaryApi(videoId);
        setSummary(data.data || data);

        // 영상 제목 가져오기
        const title = await fetchYoutubeVideoTitle(videoId);
        setVideoTitle(title);

        // 영상이 이미 저장되어 있는지 확인
        const videoStatus = await checkVideoInCategories(videoId);
        setVideoSaved(videoStatus.exists);

        // 저장된 주제 목록 저장
        if (videoStatus.exists && videoStatus.categories) {
          setSavedSubjects(videoStatus.categories);
          console.log("[DEBUG] 저장된 주제 목록:", videoStatus.categories);
        }

        // 저장되어 있지 않으면 저장 모달 표시
        if (!videoStatus.exists) {
          setShowSaveModal(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchYoutubeVideoTitle(videoId).then((title) => {
      setVideoTitle(title);
    });
    fetchSummary();
  }, [videoId]);

  // 주제 선택 후 영상 저장 핸들러
  const handleCategorySave = async (categoryId) => {
    // 디버깅: 카테고리 ID 포맷팅 확인
    const formattedCategoryId = Number(categoryId);
    if (isNaN(formattedCategoryId)) {
      console.error(
        `[DEBUG] 카테고리 ID가 숫자로 변환될 수 없습니다: ${categoryId}`
      );
      setSaveError("유효하지 않은 카테고리 ID입니다.");
      return;
    }

    // API 직접 호출 - videoTitle 매개변수 제거
    console.log(
      `[DEBUG] API 호출 직전... (${formattedCategoryId}, ${videoId}, ${videoTitle})`
    );
    const response = await addVideoToCategory(
      formattedCategoryId,
      videoId,
      videoTitle
    );
    console.log(`[DEBUG] API 호출 성공! 응답:`, response);

    // 성공 처리
    setVideoSaved(true);
    setShowSaveModal(false);
    setSaveError("");

    // 카테고리 데이터 업데이트
    try {
      // 성공 후 카테고리 업데이트 - 백업 방법 구현
      const updatedStatus = await checkVideoInCategories(videoId);
      if (updatedStatus.exists && updatedStatus.categories) {
        setSavedSubjects(updatedStatus.categories);
        console.log("[DEBUG] 업데이트된 주제 목록:", updatedStatus.categories);
      } else {
        // API에서 새 정보를 가져올 수 없는 경우 기본 정보 사용
        console.log(
          "[DEBUG] API에서 업데이트 정보를 가져올 수 없어 기본값 사용"
        );
        setSavedSubjects((prev) => [
          ...prev,
          {
            categoryId: formattedCategoryId,
            categoryName: "저장됨", // API로부터 받지 못했으므로 기본값 사용
          },
        ]);
      }
    } catch (updateErr) {
      console.error("[DEBUG] 카테고리 정보 업데이트 중 오류:", updateErr);
      // 업데이트 실패해도 저장은 성공했으므로 오류 표시하지 않음
    }
  };

  // 저장 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowSaveModal(false);
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
                <Title>{videoTitle}</Title>
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
