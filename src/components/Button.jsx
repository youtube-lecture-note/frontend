export default function Button({
  children,
  onClick,
  variant,
  classNameAdd,
  ...props
}) {
  // 기본 버튼 회색 계열
  let className =
    "px-4 py-2 text-xs md:text-base rounded-md bg-stone-600 text-stone-200 hover:bg-stone-400 hover:text-stone-100";

  if (variant === "SearchVideo") {
    // 동영상 검색 Input 버튼
    className =
      "px-4 py-2 text-xs md:text-base rounded-md bg-stone-600 text-stone-200 hover:bg-stone-400 hover:text-stone-100";
  } else if (variant === "SubjectOther") {
    // 주제 추가 + 버튼
    className =
      "px-4 py-2 text-xs md:text-base font-bold rounded-md bg-stone-600 text-stone-200 hover:bg-stone-400 hover:text-stone-100";
  } else if (variant === "SubjectDefault") {
    // 개별 주제 - 흰색 계통으로 변경
    className =
      "w-full p-2 text-left bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md border border-gray-300";
  } else if (variant === "SubjectSelected") {
    // 선택된 주제
    className =
      "w-full p-2 text-left bg-[#EB6548] text-white hover:bg-[#ff9152] rounded-md";
  } else if (variant === "Login") {
    // 로그인
    className =
      "w-full py-1 px-1 bg-blue-500 text-white rounded hover:bg-blue-600";
  } else if (variant === "Logout") {
    // 로그아웃
    className =
      "w-full py-1 px-1 bg-red-500 text-white rounded hover:bg-red-600";
  } else if (variant === "Close") {
    // 닫기
    className = "text-bold text-2xl text-black hover:text-gray-500 mb-4 ml-6";
  } else if (variant === "DefaultBlack") {
    // 기본 블랙
    className =
      "w-full p-2 text-left bg-gray-800 text-white hover:bg-gray-500 rounded-md";
  } else if (variant === "SubjectSmall") {
    // 주제 작은 버튼 - 색감 개선
    className =
      "px-2 py-1 text-xs md:text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 hover:text-white";
  } else if (variant === "SubjectNotUse") {
    // 사용하지 않는 버튼 - 색감 개선
    className =
      "px-2 py-1 text-xs md:text-sm rounded-md bg-gray-300 text-gray-600rounded-md";
  }

  className += ` ${classNameAdd || ""}`;

  return (
    <button
      onClick={onClick}
      className={className}
      disabled={variant === "SubjectNotUse"}
      {...props}
    >
      {children}
    </button>
  );
}
