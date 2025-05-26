import { useParams, useLocation } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import SubjectVideoIcon from "../components/Subject/SubjectVideoIcon";

// 주제별 분류 화면
export default function SubjectPage({ videos }) {
  const { subjectId } = useParams();
  // 유저 카테고리 조회의 videos 객체 받아오기
  const location = useLocation();
  const Subjectinfo = location.state?.Subjectinfo;
  const SubjectVideos = Subjectinfo.videos || [];

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <h1 className="text-2xl font-bold">{Subjectinfo.name}</h1>
      <div className="flex flex-wrap gap-1">
        {SubjectVideos.map((video) => (
          <SubjectVideoIcon key={video.videoId} name={video.userVideoName} />
        ))}
      </div>
    </div>
  );
}
