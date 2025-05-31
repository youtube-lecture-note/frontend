import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainSearchPage from "./pages/MainSearchPage";
import GetVideoPage from "./pages/GetVideoPage";
import QuizPage from "./pages/QuizPage";
import SideMenu from "./components/SideMenu/SideMenu";
import SubjectPage from "./pages/SubjectPage";
import AttemptsPage from "./pages/AttemptsPage";
import QuizAttmptsByID from "./pages/QuizAttmptsByID";

function App() {
  return (
    <Router>
      <div className="flex h-screen p-2 bg-gray-50 overflow-hidden">
        <main className="flex-1 p-2 pr-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<MainSearchPage />} />
            <Route path="/video/:videoId" element={<GetVideoPage />} />
            <Route path="/video/:videoId/quiz" element={<QuizPage />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/attempts" element={<AttemptsPage />} />
            <Route path="/attempts/:quizSetId" element={<QuizAttmptsByID />} />
          </Routes>
        </main>

        <aside className="h-screen w-1/4 border-l border-gray-200 p-4 bg-white overflow-hidden flex-shrink-0">
          <SideMenu />
        </aside>
      </div>
    </Router>
  );
}

export default App;
