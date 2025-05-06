import React, { useRef, useEffect } from "react";

export default function DisplaySummaryLine({ time, text, onTimeClick }) {
  let lines = text.split("\n");
  let text2 = "";
  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      lines[i] = "● " + lines[i];
    }
    if (lines[i].length === 0) {
      continue;
    }
    text2 += lines[i] + "\n";
  }

  // Textarea 높이 조절 함수
  const adjustTextareaHeight = (element) => {
    if (element) {
      element.style.height = "auto"; // 높이를 초기화하여 scrollHeight 재계산
      element.style.height = element.scrollHeight + "px"; // 실제 내용 높이로 설정
    }
  };

  // Textarea 참조 생성
  const textareaRef = useRef(null);

  // 컴포넌트 마운트 및 text 변경 시 높이 조절
  useEffect(() => {
    adjustTextareaHeight(textareaRef.current);
  }, [text2]); // text가 변경될 때마다 실행

  return (
    <div className="flex flex-col mb-1">
      {/* 타임스탬프 */}
      <div className="timestamp-container mb-1">
        <span
          className="text-blue-600 cursor-pointer text-sm hover:text-blue-300 mr-1 whitespace-nowrap"
          onClick={() => onTimeClick(time)}
        >
          [{time}]
        </span>
      </div>

      {/* 전체 텍스트를 표시하고 높이가 자동 조절되는 Textarea */}
      <textarea
        ref={textareaRef} // 참조 연결
        defaultValue={text2}
        className="w-full bg-transparent text-sm outline-none resize-none border-none overflow-hidden" // overflow-hidden으로 스크롤바 숨김
        onClick={(e) => e.target.select()}
        rows="1" // 초기 높이는 1줄로 설정
        onInput={(e) => adjustTextareaHeight(e.target)} // 사용자 입력 시 높이 조절
      />
    </div>
  );
}
