export default function SubjectIcon({ name }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-30 h-20 bg-red-600 rounded"></div>
      <p>{name}</p>
    </div>
  );
}
