import Input from "../Input";
import Button from "../Button";

import { useNavigate } from "react-router-dom";

export default function SearchVideo({ inputURLRef }) {
  const navigate = useNavigate();

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
      alert("올바른 유튜브 URL을 입력해주세요.");
    }
  };

  return (
    <div className="search-container w-full max-w-2xl mx-auto border-2 border-black rounded-lg p-1">
      <div className="input-group flex gap-2">
        <Input
          ref={inputURLRef}
          defaultValue=""
          placeholder="유튜브 영상 URL을 입력하세요"
        />
        <Button onClick={handleSubmit}>▶</Button>
      </div>
    </div>
  );
}
