export default function Button({
  children,
  onClick,
  variant,
  classNameAdd,
  ...props
}) {
  let className =
    "px-4 py-2 text-xs md:text-base rounded-md bg-gray-500 text-white hover:bg-gray-600 hover:text-gray-900";

  if (variant === "SearchVideo") {
    className =
      "px-4 py-2 text-xs md:text-base rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900";
  } else if (variant === "SubjectOther") {
    className =
      "px-4 py-2 text-xs md:text-base font-bold rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
  } else if (variant === "SubjectDefault") {
    className =
      "w-full p-2 text-left bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md border border-gray-300";
  } else if (variant === "SubjectSelected") {
    className =
      "w-full p-2 text-left bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md";
  } else if (variant === "Login") {
    className =
      "w-full py-1 px-1 bg-blue-500 text-white rounded hover:bg-blue-600";
  } else if (variant === "Logout") {
    className =
      "w-full py-1 px-1 bg-red-500 text-white rounded hover:bg-red-600";
  } else if (variant === "Close") {
    className =
      "text-bold text-2xl text-gray-600 hover:text-gray-800 mb-4 ml-6";
  } else if (variant === "DefaultBlack") {
    className =
      "w-full p-2 text-left bg-gray-800 text-white hover:bg-gray-700 rounded-md";
  } else if (variant === "SubjectSmall") {
    className =
      "px-2 py-1 text-xs md:text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
  } else if (variant === "SubjectNotUse") {
    className =
      "px-2 py-1 text-xs md:text-sm rounded-md bg-gray-200 text-gray-400 rounded-md";
  } else if (variant === "link") {
    className =
      "flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors";
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
