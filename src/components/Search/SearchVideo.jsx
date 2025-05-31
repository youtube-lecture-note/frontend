import Input from "../Input";
import Button from "../Button";

import { extractVideoId } from "../func.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PiPlayFill } from "react-icons/pi";

export default function SearchVideo({ inputURLRef, variant, onChange }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    const vidID = extractVideoId(inputURLRef.current.value || "");

    if (vidID) {
      setErrorMessage(""); // 성공 시 에러 메시지 제거
      if (variant === "SearchVideo") {
        navigate(`/video/${vidID}`);
      } else if (variant === "SearchQuiz") {
        // AttemptsPage의 handleQuizIdInputChange(vidID)
        onChange(vidID);
      }
    } else {
      setErrorMessage("올바른 유튜브 URL을 입력해주세요.");
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
