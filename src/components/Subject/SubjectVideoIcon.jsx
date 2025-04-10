export default function SubjectVideoIcon({ name }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* 여기를 유튜브 아이콘 모양 사각형으로? */}
      <div className="w-30 h-20 bg-red-600 rounded"></div>
      <p>{name}</p>
    </div>
  );
}
