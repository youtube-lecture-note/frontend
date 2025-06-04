import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import TopBar from "../components/TopBar/TopBar";
import { extractVideoId } from "../components/func.js";
import { addCopyrightVideo, checkAdminStatus, fetchBanList } from "../api/index";

export default function AdminPage() {
  const videoUrlRef = useRef(null);
  const ownerRef = useRef(null);
  const [iscopyrighterror, setIscopyrighterror] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [banList, setBanList] = useState([]);
  const [banListError, setBanListError] = useState(null);

  // 관리자 상태 확인
  useEffect(() => {
    checkAdminStatus(setIsAdmin);
  }, []);

  // 밴 리스트 불러오기
  const loadBanList = async () => {
    try {
      setBanListError(null);
      const bans = await fetchBanList();
      setBanList(bans);
    } catch (e) {
      setBanListError(e.message);
      setBanList([]);
    }
  };

  useEffect(() => {
    loadBanList();
  }, []);

  // 저작권 차단 등록
  function handleAddCopyrightVideo() {
    if (!isAdmin) {
      setIscopyrighterror("이 기능은 관리자만 사용할 수 있습니다.");
      return;
    }
    const videoId = extractVideoId(videoUrlRef.current.value);
    const owner = ownerRef.current.value;
    setIscopyrighterror(null);
    addCopyrightVideo(videoId, owner, (error) => {
      if (error) {
        setIscopyrighterror(error.message || error);
      } else {
        setIscopyrighterror(null);
        videoUrlRef.current.value = "";
        ownerRef.current.value = "";
        loadBanList(); // 등록 후 리스트 새로고침
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
        <Input ref={videoUrlRef} placeholder="영상 URL" />
        <Input ref={ownerRef} placeholder="영상 소유자" />
        <Button onClick={handleAddCopyrightVideo}>
          영상 차단 등록하기
        </Button>
        {iscopyrighterror && (
          <p className="text-red-500 text-sm mt-2">{iscopyrighterror}</p>
        )}
      </div>

      {/* 밴 리스트 영역 */}
      <div className="p-4 mx-4 mt-4 border-2 border-gray-300 rounded-lg bg-white">
        <h2 className="text-lg font-semibold mb-2">현재 밴 리스트</h2>
        {banListError && (
          <p className="text-red-500 text-sm">{banListError}</p>
        )}
        {banList.length === 0 && !banListError ? (
          <p className="text-gray-500">등록된 차단 영상이 없습니다.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Youtube Link</th>
                <th className="px-2 py-1 border">소유자</th>
                <th className="px-2 py-1 border">등록일</th>
              </tr>
            </thead>
            <tbody>
              {banList.map((ban) => (
                <tr key={ban.youtubeId}>
                  <td className="px-2 py-1 border">
                    <a
                      href={`https://www.youtube.com/watch?v=${ban.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {`https://www.youtube.com/watch?v=${ban.youtubeId}`}
                    </a>
                  </td>
                  <td className="px-2 py-1 border">{ban.owner}</td>
                  <td className="px-2 py-1 border">
                    {ban.processedDate
                      ? new Date(ban.processedDate).toLocaleString("ko-KR")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
