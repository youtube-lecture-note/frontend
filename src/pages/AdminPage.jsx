import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import TopBar from "../components/TopBar/TopBar";
import { extractVideoId } from "../components/func.js";
import { addCopyrightVideo, checkAdminStatus } from "../api/index";
//관리자 페이지
export default function AdminPage() {
  const videoUrlRef = useRef(null);
  const ownerRef = useRef(null);
  const [iscopyrighterror, setIscopyrighterror] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 관리자 상태 확인
    checkAdminStatus(setIsAdmin);
  }, []);
  // 저작권 차단 기능
  function handleAddCopyrightVideo() {
    if (!isAdmin) {
      setIscopyrighterror("이 기능은 관리자만 사용할 수 있습니다.");
      return;
    }
    const videoId = extractVideoId(videoUrlRef.current.value);
    const owner = ownerRef.current.value;
    // 요청 전에 이전 오류 메시지 초기화
    setIscopyrighterror(null);
    addCopyrightVideo(videoId, owner, (error) => {
      console.log("addCopyrightVideo callback error:", error);
      if (error) {
        // error가 객체이고 message 속성이 있다면 그것을 사용, 아니면 error 자체를 사용 (문자열일 경우)
        setIscopyrighterror(error.message || error);
      } else {
        // 성공 시 (error가 null 또는 undefined 등 falsy 값일 때)
        // 성공 메시지를 표시하거나, 오류 상태를 확실히 초기화
        setIscopyrighterror(null);
        // 여기에 성공 알림 로직을 추가할 수 있습니다. 예: videoUrlRef.current.value = ''; ownerRef.current.value = '';
        console.log("영상 차단 등록 성공");
      }
    });
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <h1 className="text-2xl font-bold mb-4 p-4 text-gray-800">
        관리자 페이지
      </h1>
      <div className="flex flex-col items-start gap-2 p-4 border-2 border-gray-400 rounded-lg mx-4">
        <Input ref={videoUrlRef} placeholder="영상 URL"></Input>
        <Input ref={ownerRef} placeholder="영상 소유자"></Input>
        <Button onClick={() => handleAddCopyrightVideo()}>
          영상 차단 등록하기
        </Button>
        {iscopyrighterror && (
          <p className="text-red-500 text-sm mt-2">{iscopyrighterror}</p>
        )}
      </div>
    </div>
  );
}
