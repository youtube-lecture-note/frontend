import { forwardRef } from "react";

const Input = forwardRef(
  ({ value, onChange, placeholder, defaultValue, variant, ...props }, ref) => {
    // 기본 text input
    let className =
      "w-full px-4 py-2 bg-gray-200 rounded-sm border-1 border-gray-400 placeholder-gray-500";
    let type = "text";

    if (variant === "ShortAnswer") {
      // 단답형 퀴즈 입력
      className = "border-2 border-gray-300 rounded-md p-2";
      value = value || "";
    } else if (variant === "MultipleChoiceComponent") {
      // 객관식 퀴즈 입력 (라디오 버튼)
      className = "mr-3";
      type = "radio";
    } else if (variant === "AddSubject") {
      // 주제 추가
      className =
        "w-full px-4 py-2 bg-gray-200 rounded-sm border-1 border-gray-400 placeholder-gray-500";
    }

    return (
      <input
        ref={ref}
        className={className}
        value={value}
        type={type}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

export default Input;
