import TopBar from "../components/TopBar/TopBar";
import SubjectIcon from "../components/Subject/SubjectIcon";

// 주제별 분류 화면
export default function SubjectPage() {
  const tmpSubject = ["미분류", "과학", "자격증"];

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <h1 className="text-2xl font-bold">주제별 분류</h1>
      <div className="flex flex-wrap gap-4">
        {tmpSubject.map((subject) => (
          <SubjectIcon key={subject} name={subject} />
        ))}
      </div>
    </div>
  );
}
