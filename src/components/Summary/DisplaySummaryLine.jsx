import React, { useRef, useEffect, useState } from "react";

export default function DisplaySummaryLine({ time, text, onTimeClick }) {
  const [formattedText, setFormattedText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    console.log("DisplaySummaryLine props 변경:", { time, text });

    if (!text) {
      console.log("텍스트가 없습니다");
      setFormattedText("");
      return;
    }

    const lines = text.split("\n");
    let formatted = "";

    for (let i = 0; i < lines.length; i++) {
      if (i === 0) {
        formatted += "● " + lines[i];
      } else if (lines[i].trim().length > 0) {
        formatted += "\n  " + lines[i];
      }
    }

    console.log("포맷팅된 텍스트:", formatted);
    setFormattedText(formatted);
  }, [text]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [formattedText]);

  return (
    <div className="flex flex-col mb-4 p-2 bg-white rounded shadow-sm">
      <div className="timestamp-container mb-2">
        <span
          className="text-blue-600 cursor-pointer text-sm font-medium hover:text-blue-800 mr-2 whitespace-nowrap"
          onClick={() => onTimeClick(time)}
        >
          [{time}]
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={formattedText}
        className="w-full bg-transparent text-sm outline-none resize-none border-none overflow-hidden p-2"
        onClick={(e) => e.target.select()}
        rows="1"
        readOnly
      />
    </div>
  );
}
