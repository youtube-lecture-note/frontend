// 메인 검색화면
import React, { useRef, useState } from 'react';

import Logo from "../assets/Logo/Logo.png";
import SearchVideo from "../components/Search/SearchVideo";

// 저작권 팝업 컴포넌트
const CopyrightModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          저작권 및 사용 권한 안내
        </h3>
        <div className="text-gray-600 space-y-3">
          <p>
            저작권 및 사용 권한은 원본 컨텐츠 제작자에게 귀속됩니다.
          </p>
          <p>
            해당 웹사이트를 통해 요약한 결과를 사용하여 발생하는 문제의 책임 또한 사용자에게 있습니다.
          </p>
          <p className="pt-2 border-t border-gray-200">
            <span className="font-medium">유튜브 저작권자 본인 영상 차단 문의:</span>
            <br />
            <a 
              href="mailto:contact@example.com" 
              className="text-blue-600 hover:text-blue-800"
            >
              smu08054@cau.ac.kr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function MainSearchPage() {
  const inputURLRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="main-container flex flex-col justify-center items-center h-full max-w-5xl w-full mx-auto relative">
      <img src={Logo} alt="logo" className="main-logo w-40 h-40 mb-40" />
      <SearchVideo inputURLRef={inputURLRef} variant={"SearchVideo"} />
      
      {/* 저작권 안내 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-4 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        저작권 및 사용 권한 안내
      </button>

      {/* 저작권 팝업 모달 */}
      <CopyrightModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
