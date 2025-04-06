// 영상 링크 입력시 가져오는 화면
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import Button from "../components/Button";
import TopBar from "../components/TopBar/TopBar";

export default function GetVideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleQuizClick = () => {
    navigate(`/video/${videoId}/quiz`);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/5 border-r border-gray-300 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="w-full">
            <YouTube videoId={videoId} opts={opts} className="w-full" />
          </div>
          <p className="text-center pt-4">Video ID: {videoId}</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button>노트</Button>
            <Button onClick={handleQuizClick}>문제풀기</Button>
          </div>
        </div>

        <div className="w-2/5 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">강의 노트</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <p className="mb-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi
                tenetur minima laborum nisi dignissimos sit incidunt numquam,
                voluptatum suscipit dolore pariatur eius! Labore cupiditate,
                quos unde tenetur accusantium error possimus. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Iste id veritatis vero
                atque suscipit ad eveniet molestias dolorum natus corrupti
                culpa, minima voluptatem iusto voluptatum. Error culpa placeat
                molestias dolor.
              </p>
            </div>
            <Button>저장하기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
