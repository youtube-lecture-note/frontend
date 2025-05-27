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
    // 개별 주제
    className =
      "w-full p-2 text-left bg-[#7e6c3a] text-white hover:bg-[#75866b] rounded-md";
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
  } else if (variant === "Red") {
    // #C3375A 빨강
    className =
      "w-full p-2 text-left bg-[#C3375A] text-white hover:bg-[#de3410] rounded-md";
  } else if (variant === "Orange") {
    // #EB6548 주황
    className =
      "w-full p-2 text-left bg-[#EB6548] text-white hover:bg-[#fe8255] rounded-md";
  } else if (variant === "Pink") {
    // #FF9E7B 살색
    className =
      "w-full p-2 text-left bg-[#FF9E7B] text-white hover:bg-[#fed9b1] rounded-md";
  } else if (variant === "Yellow") {
    // #FECC6A 노랑
    className =
      "w-full p-2 text-left bg-[#FECC6A] text-white hover:bg-[#fcd158] rounded-md";
  } else if (variant === "Green") {
    // #6B9A6E 녹색
    className =
      "w-full p-2 text-left bg-[#6B9A6E] text-white hover:bg-[#676f28] rounded-md";
  }

  className += ` ${classNameAdd || ""}`;

  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}
