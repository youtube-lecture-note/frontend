export default function Subject({ children }) {
  return (
    <button className="w-full p-2 text-left bg-gray-200 hover:bg-gray-400 rounded-md">
      {children}
    </button>
  );
}
