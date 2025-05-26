import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar/TopBar";
import SubjectVideoIcon from "../components/Subject/SubjectVideoIcon";

// 주제별 분류 화면
export default function SubjectPage({ videos }) {
  const { subjectId } = useParams();
  // 유저 카테고리 조회의 videos 객체 받아오기

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <h1 className="text-2xl font-bold">{subjectId}</h1>
      <div className="flex flex-wrap gap-4">
        {/* {videos.map((subject) => (
          <SubjectVideoIcon key={subject} name={subject} />
        ))} */}
      </div>
    </div>
  );
}
