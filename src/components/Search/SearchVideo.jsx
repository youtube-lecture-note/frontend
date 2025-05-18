import Input from "../Input";
import Button from "../Button";
import Modal from "../Modal";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchVideo({ inputURLRef }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState("");

  // 영상 입력시 ID부분만 추출하기
  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSubmit = () => {
    const vidID = extractVideoId(inputURLRef.current.value || "");

    if (vidID) {
      navigate(`/video/${vidID}`);
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
            ▶
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
