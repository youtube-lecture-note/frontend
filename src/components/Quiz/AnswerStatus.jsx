import React from "react";
import Button from "../Button";
import AnswerStatusItem from "./AnswerStatusItem";
import Title from "../Title";

export default function AnswerStatus({ questions, answers, onSubmit }) {
  // 배열을 지정된 크기의 청크로 나누는 헬퍼 함수
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // 문제들을 5개씩 그룹화
  const chunkedQuestions = chunkArray(questions, 5);

  return (
    // 수정: 전체 컨테이너를 flex로 설정하고 방향 지정 (스크롤 없음)
    <div className="flex flex-col h-full">
      <Title size="small">답안 현황</Title>

      {/* 수정: 문제 번호 영역만 스크롤 가능하게 설정 */}
      <div className="flex-1 overflow-y-auto px-4 mb-2">
        <div className="mb-2">
          {chunkedQuestions.map((chunk, rowIndex) => (
            <div key={rowIndex} className="flex mb-2">
              {chunk.map((question, colIndex) => (
                <div key={question.quizId} className="flex-1">
                  <AnswerStatusItem
                    index={rowIndex * 5 + colIndex + 1}
                    answer={answers[question.quizId]?.userAnswer}
                  />
                </div>
              ))}
              {/* 한 줄에 5개 미만일 경우 빈 칸으로 채움 */}
              {chunk.length < 5 &&
                Array(5 - chunk.length)
                  .fill()
                  .map((_, i) => (
                    <div key={`empty-${i}`} className="flex-1"></div>
                  ))}
            </div>
          ))}
        </div>
      </div>

      {/* 수정: 제출 버튼 영역은 스크롤과 별개로 항상 보이도록 하단에 고정 */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
        <Button onClick={() => onSubmit(answers)} classNameAdd={"w-full"}>
          제출
        </Button>
      </div>
    </div>
  );
}
