// 퀴즈 기록 페이지
import { useEffect, useState, useRef } from "react";

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

  useEffect(() => {
    // 페이지가 로드될 때, 이전 퀴즈 기록을 불러오는 API 호출
    const fetchQuizAttempts = async () => {
      try {
        const response = await quizAttemptsApi();
        if (response && Array.isArray(response.data)) {
          setQuizAttempts(response.data);
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
      <h1 className="text-2xl font-bold mb-4">이전 퀴즈 기록</h1>
      <SearchVideo inputURLRef={inputURLRef} variant={"SearchVideo"} />
      <div>
        {/* quizAttempts가 항상 배열임을 보장하므로 .length 접근이 안전해짐 */}
        {quizAttempts.length === 0
          ? "아직 퀴즈 기록이 없습니다."
          : quizAttempts.map((attempt) => (
              <div key={attempt.id}>{attempt.title}</div>
            ))}
      </div>
    </div>
  );
}
