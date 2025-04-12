// 영상 링크 입력시 가져오는 화면
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import Button from "../components/Button";
import TopBar from "../components/TopBar/TopBar";
import DisplaySummaryLine from "../components/Summary/DisplaySummaryLine";

export default function GetVideoPage() {
  const [summary, setSummary] = useState("");
  // 로딩, 에러
  const [loading, setLoading] = useState(false);
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

  // 비디오 요약 가져오기
  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError("");

      try {
        console.log(`영상 ID로 요약 데이터 요청: ${videoId}`);
        const response = await fetch(`/api/summary?videoId=${videoId}`);

        if (!response.ok) {
          console.error(
            `API 응답 실패: ${response.status} ${response.statusText}`
          );
          setError("요약을 가져오는데 실패했습니다");
          setLoading(false);
          return;
        }
        /// zzㅋㅋ 다시하기
        const text = await response.text();
        console.log("API 응답 데이터:", text);

        // 응답이 JSON 형식인지 확인
        try {
          const jsonData = JSON.parse(text);
          console.log("파싱된 JSON:", jsonData);
          if (jsonData.data) {
            setSummary(jsonData.data);
          } else {
            setSummary(text);
          }
        } catch (e) {
          // JSON이 아니면 그냥 텍스트로 처리
          console.log("JSON 파싱 실패, 텍스트로 처리");
          setSummary(text);
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
        setError("요약 데이터를 가져오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [videoId]);

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
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

  const displaySummary =
    parse_summary.length === 0 ? parseSummary(noData) : parse_summary;

  // 문제풀이 버튼
  function handleQuizClick() {
    navigate(`/video/${videoId}/quiz`);
  }

  // 노트 저장 함수 - 아직 안됨
  function handleSaveNote() {
    console.log("노트 저장");
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 영역: 비디오 플레이어 */}
        <div className="w-3/5 border-r border-gray-300 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="w-full">
            <YouTube
              videoId={videoId}
              opts={opts}
              className="w-full"
              onReady={onReady}
            />
          </div>
          <p className="text-center pt-4">Video ID: {videoId}</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button>노트</Button>
            <Button onClick={handleQuizClick}>문제풀기</Button>
          </div>
        </div>

        {/* 오른쪽 영역: 강의 노트 */}
        <div className="w-2/5 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">강의 노트</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex flex-col gap-4 pb-4">
              {/* 로딩 중일 때 */}
              {loading ? (
                <p className="text-center">요약 데이터 로딩 중...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
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
            <Button>저장하기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
