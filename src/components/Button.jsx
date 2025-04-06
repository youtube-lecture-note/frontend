export default function Button({ children, onClick, ...props }) {
  return (
    <button
      className="px-4 py-2 text-xs md:text-base rounded-md bg-stone-600 text-stone-200 hover:bg-stone-400 hover:text-stone-100"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
