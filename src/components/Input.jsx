export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      className="w-full px-4 py-2 bg-gray-100 rounded-sm border-2 border-gray-400 placeholder-gray-500"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
