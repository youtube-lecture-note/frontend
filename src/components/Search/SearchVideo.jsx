import Input from "../Input";
import Button from "../Button";
import { extractVideoId } from "../func.js";
import { copyrightCheck } from "../../api/index.js";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PiPlayFill } from "react-icons/pi";

export default function SearchVideo({ inputURLRef, variant, onChange }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // 차단한 영상인지 확인히고, 그다음 검색한다.
  const handleSubmit = async () => {
    const urlValue = inputURLRef.current.value || "";
    const vidID = extractVideoId(urlValue);

    if (!vidID) {
      setErrorMessage("올바른 유튜브 URL을 입력해주세요.");
      return;
    }

    setErrorMessage(""); // 이전 메시지 초기화

    try {
      const copyrightResult = await copyrightCheck(vidID);

      // copyrightResult가 null (API 오류 또는 409 등 차단 응답) 이거나
      // copyrightResult.data가 true (API가 정상 응답했으나 차단된 영상으로 명시)인 경우
      if (
        copyrightResult === null ||
        (copyrightResult && copyrightResult.data === true)
      ) {
        setErrorMessage(
          "이 영상은 차단된 영상입니다.(API 오류 또는 차단 응답상태임 수정필요)"
        );
      } else {
        // 영상이 차단되지 않았고, 저작권 확인 성공
        setErrorMessage(""); // 에러 메시지 없음 확인
        if (variant === "SearchVideo") {
          navigate(`/video/${vidID}`);
        } else if (variant === "SearchQuiz") {
          onChange(vidID); // AttemptsPage 등에서 사용
        }
      }
    } catch (error) {
      console.error("handleSubmit 중 오류 발생:", error);
      setErrorMessage("검색 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto border-2 border-gray-400 rounded-lg p-1">
        <div className="flex gap-2">
          <Input
            ref={inputURLRef}
            defaultValue=""
            placeholder="유튜브 영상 URL을 입력하세요"
          />
          <Button onClick={handleSubmit} variant="SearchVideo">
            <PiPlayFill />
          </Button>
        </div>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1 ml-2">{errorMessage}</p>
      )}
    </div>
  );
}
