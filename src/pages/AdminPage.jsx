import Button from "../components/Button";
import Input from "../components/Input";
import TopBar from "../components/TopBar/TopBar";

import { useRef } from "react";
import { extractVideoId } from "../components/func.js";
import { addCopyrightVideo } from "../api/index";
//관리자 페이지
export default function AdminPage() {
  const videoUrlRef = useRef(null);
  const ownerRef = useRef(null);
  // 저작권 차단 기능
  function handleAddCopyrightVideo() {
    const videoId = extractVideoId(videoUrlRef.current.value);
    const owner = ownerRef.current.value;
    addCopyrightVideo(videoId, owner);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <h1 className="text-2xl font-bold mb-4 p-4 text-gray-800">
        관리자 페이지
      </h1>
      <div className="flex flex-col gap-2 p-4">
        <Input ref={videoUrlRef} placeholder="영상 URL"></Input>
        <Input ref={ownerRef} placeholder="영상 소유자"></Input>
        <Button onClick={() => handleAddCopyrightVideo()}>
          영상 차단 등록하기
        </Button>
      </div>
    </div>
  );
}
