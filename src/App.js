import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainSearchPage from "./pages/MainSearchPage";
import GetVideoPage from "./pages/GetVideoPage";
import QuizPage from "./pages/QuizPage";
import SideMenu from "./components/SideMenu/SideMenu";
import SubjectPage from "./pages/SubjectPage";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<MainSearchPage />} />
            <Route path="/video/:videoId" element={<GetVideoPage />} />
            <Route path="/video/:videoId/quiz" element={<QuizPage />} />
            <Route path="/subject" element={<SubjectPage />} />
            <Route path="/subject/:subjectName" element={<SubjectPage />} />
          </Routes>
        </main>

        <aside className="h-screen w-1/4 border-l border-gray-300">
          <SideMenu />
        </aside>
      </div>
    </Router>
  );
}

export default App;
