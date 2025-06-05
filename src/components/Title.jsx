// 제목에 사용
export default function Title({ children, size, ...props }) {
  if (size === "small") {
    return (
      <div>
        <h3 className="text-lg font-bold text-gray-800">{children}</h3>
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-400 mt-1 mb-4 rounded-full"></div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">{children}</h1>
      <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-400 mt-1 mb-4 rounded-full"></div>
    </div>
  );
}
