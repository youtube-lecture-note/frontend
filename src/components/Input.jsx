import { forwardRef } from "react";

const Input = forwardRef(
  ({ value, onChange, placeholder, defaultValue, ...props }, ref) => {
    // value와 onChange가 있으면 제어 컴포넌트로 동작
    // defaultValue만 있으면 비제어 컴포넌트로 동작
    return (
      <input
        ref={ref}
        className="w-full px-4 py-2 bg-gray-100 rounded-sm border-2 border-gray-400 placeholder-gray-500"
        type="text"
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

export default Input;
