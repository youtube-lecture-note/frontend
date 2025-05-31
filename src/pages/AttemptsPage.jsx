// 퀴즈 기록 페이지
import { useEffect, useState, useRef } from "react";

import YouTube from "react-youtube";
import QuizAttemptHistory from "../components/Attempt/QuizAttemptHistory.jsx";

import {
  quizAttemptsApi,
  quizAttemptsByVideoIdApi,
  quizAttemptsByQuizSetIdApi,
} from "../api/index.js";
import SearchVideo from "../components/Search/SearchVideo.jsx";
import TopBar from "../components/TopBar/TopBar.jsx";
import Button from "../components/Button.jsx";

export default function AttemptsPage() {
  const inputURLRef = useRef(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [quizIdInput, setQuizIdInput] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  // YouTube 플레이어 참조 추가
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        const response = await quizAttemptsApi();
        if (response && Array.isArray(response)) {
          setQuizAttempts(response);
        } else {
          console.error(
            "API 응답 형식이 올바르지 않거나 데이터가 없습니다.",
            response
          );
          setQuizAttempts([]);
        }
      } catch (error) {
        console.error("퀴즈 기록을 불러오는 데 실패했습니다:", error);
        setQuizAttempts([]);
      }
    };

    fetchQuizAttempts();
  }, []);

  // YouTube 플레이어 준비 완료 핸들러
  const onReady = (event) => {
    // 플레이어 참조 저장
    setPlayer(event.target);
  };

  const opts = {
    height: "200",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  // 이제 vidID를 직접 인자로 받습니다.
  const handleQuizIdInputChange = (vidID) => {
    if (vidID) {
      // vidID가 유효한 경우에만 API 호출
      setQuizIdInput(true);
      setCurrentVideoId(vidID); // 현재 비디오 ID 상태 업데이트
      quizAttemptsByVideoIdApi(vidID)
        .then((data) => {
          // API 응답이 배열인지 확인 후 상태 업데이트
          if (data && Array.isArray(data)) {
            setQuizAttempts(data);
          } else if (data && Array.isArray(data.data)) {
            // 혹시 data.data 형태로 올 경우 대비
            setQuizAttempts(data.data);
          } else {
            console.error("잘못된 형식의 퀴즈 기록 데이터:", data);
            setQuizAttempts([]);
          }
        })
        .catch((error) => {
          console.error(
            "해당 영상의 퀴즈 기록을 불러오는 데 실패했습니다:",
            error
          );
          setQuizAttempts([]);
        });
    } else {
      // vidID가 유효하지 않으면, 현재 비디오 ID도 초기화 할 수 있습니다.
      // setCurrentVideoId(null);
      // setQuizIdInput(false);
      // fetchQuizAttempts(); // 전체 목록 다시 로드
    }
  };

  console.log("퀴즈 기록:", quizAttempts);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <div className="flex justify-between items-center px-4 mb-4">
        <h1 className="text-2xl font-bold mb-4 p-4 text-gray-800">퀴즈 기록</h1>
        {quizIdInput && (
          <Button
            variant="link"
            onClick={() => {
              setQuizIdInput(false);
              setCurrentVideoId(null);
              // '전체 보기' 클릭 시 전체 목록 다시 불러오기
              const fetchAll = async () => {
                try {
                  const response = await quizAttemptsApi();
                  if (response && Array.isArray(response)) {
                    setQuizAttempts(response);
                  } else {
                    setQuizAttempts([]);
                  }
                } catch (error) {
                  setQuizAttempts([]);
                }
              };
              fetchAll();
            }}
          >
            전체 보기
          </Button>
        )}
      </div>
      <div className="px-4 mb-4">
        <SearchVideo
          inputURLRef={inputURLRef}
          variant="SearchQuiz"
          onChange={handleQuizIdInputChange}
        />
      </div>
      {quizIdInput && currentVideoId && (
        <div className="border-r border-gray-200 p-4 flex flex-col justify-between bg-white shadow-sm rounded-lg mb-4">
          <div className="w-full">
            <YouTube
              videoId={currentVideoId}
              opts={opts}
              className="w-full"
              onReady={onReady}
            />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <QuizAttemptHistory
          quizAttempts={quizAttempts}
          quizAttemptsByVideoIdApi={quizAttemptsByVideoIdApi}
          quizAttemptsByQuizSetIdApi={quizAttemptsByQuizSetIdApi}
          quizIdInput={quizIdInput}
        />
      </div>
    </div>
  );
}
