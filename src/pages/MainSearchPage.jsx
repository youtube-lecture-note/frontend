// 메인 검색화면
import Logo from "../assets/Logo/Logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function MainSearchPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const navigate = useNavigate();

  // 영상 입력시 ID부분만 추출하기
  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSubmit = () => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      navigate(`/video/${videoId}`);
    } else {
      alert("올바른 유튜브 URL을 입력해주세요.");
    }
  };

  return (
    <div className="main-container flex flex-col justify-center items-center h-full bg-gray-300">
      <img src={Logo} alt="logo" className="main-logo w-40 h-40 mb-40" />
      <div className="search-container w-3/4 border-2 border-black rounded-lg p-1">
        <div className="input-group flex gap-2">
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="유튜브 영상 URL을 입력하세요"
          />
          <Button onClick={handleSubmit}>▶</Button>
        </div>
      </div>
    </div>
  );
}
