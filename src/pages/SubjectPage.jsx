import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar/TopBar";
import SubjectVideoIcon from "../components/Subject/SubjectVideoIcon";

// 주제별 분류 화면
export default function SubjectPage() {
  const { subjectName } = useParams();
  const tmpVideo = ["a", "과학1", "과학2"];

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <h1 className="text-2xl font-bold">
        {subjectName ? `주제 : ${subjectName}` : "주제별 분류"}
      </h1>
      <div className="flex flex-wrap gap-4">
        {tmpVideo.map((subject) => (
          <SubjectVideoIcon key={subject} name={subject} />
        ))}
      </div>
    </div>
  );
}
