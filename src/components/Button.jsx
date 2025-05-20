export default function Button({ children, onClick, variant, ...props }) {
  // 기본 버튼 회색 계열
  let className =
    "px-4 py-2 text-xs md:text-base rounded-md bg-stone-600 text-stone-200 hover:bg-stone-400 hover:text-stone-100";

  if (variant === "SearchVideo") {
    // 동영상 검색 Input 버튼
    className =
      "px-4 py-2 text-xs md:text-base rounded-md bg-stone-600 text-stone-200 hover:bg-stone-400 hover:text-stone-100";
  } else if (variant === "AddSubject") {
    // 주제 추가 + 버튼
    className = "p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full";
  } else if (variant === "Subject") {
    // 개별 주제에 사용되는 버튼
    className = "w-full p-2 text-left bg-gray-200 hover:bg-gray-400 rounded-md";
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
    className = "text-bold text-xl text-black hover:text-gray-500 mb-4 ml-6";
  } else if (variant === "DefaultBlack") {
    // 기본 블랙
    className =
      "w-full p-2 text-left bg-gray-800 text-white hover:bg-gray-900 rounded-md";
  }

  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}
