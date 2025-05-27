// 퀴즈 기록 페이지
import { useEffect, useState, useRef } from "react";

import QuizAttemptHistory from "../components/Quiz/QuizAttemptHistory.jsx";

import {
  quizAttemptsApi,
  quizAttemptsByVideoIdApi,
  quizAttemptsByQuizSetIdApi,
} from "../api/index.js";
import SearchVideo from "../components/Search/SearchVideo.jsx";
import TopBar from "../components/TopBar/TopBar.jsx";

export default function AttemptsPage() {
  const inputURLRef = useRef(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  // 유튜브 url 입력여부에 따라서 전체를 보여주거나 해당 영상만 보여줌
  const [quizIdInput, setQuizIdInput] = useState(false);

  useEffect(() => {
    // 페이지가 로드될 때, 이전 퀴즈 기록을 불러오는 API 호출
    const fetchQuizAttempts = async () => {
      try {
        const response = await quizAttemptsApi();
        // response가 직접 배열인지 확인
        if (response && Array.isArray(response)) {
          setQuizAttempts(response); // response 자체를 상태로 설정
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

  console.log("퀴즈 기록:", quizAttempts);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <h1 className="text-2xl font-bold mb-4 p-4">이전 퀴즈 기록</h1>
      <div className="px-4">
        <SearchVideo inputURLRef={inputURLRef} variant={"SearchVideo"} />
      </div>
      <QuizAttemptHistory
        quizAttempts={quizAttempts}
        quizAttemptsByVideoIdApi={quizAttemptsByVideoIdApi}
        quizAttemptsByQuizSetIdApi={quizAttemptsByQuizSetIdApi}
        quizIdInput={quizIdInput}
      />
    </div>
  );
}
