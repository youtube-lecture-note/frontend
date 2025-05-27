import Input from "../Input";
import Button from "../Button";
import Modal from "../Modal";

import { extractVideoId } from "../func.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PiPlayFill } from "react-icons/pi";

export default function SearchVideo({ inputURLRef, variant, onChange }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState("");

  const handleSubmit = () => {
    const vidID = extractVideoId(inputURLRef.current.value || "");

    if (vidID) {
      if (variant === "SearchVideo") {
        navigate(`/video/${vidID}`);
      } else if (variant === "SearchQuiz") {
        // AttemptsPage의 handleQuizIdInputChange(vidID)
        onChange(vidID);
      }
    } else {
      setIsError("올바른 유튜브 URL을 입력해주세요.");
      setIsOpen(true);
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
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isError}
        variant="NeedYoutubeURL"
      ></Modal>
    </div>
  );
}
