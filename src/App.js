import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { useLocation } from 'react-router-dom';

import MainSearchPage from "./pages/MainSearchPage";
import GetVideoPage from "./pages/GetVideoPage";
import QuizPage from "./pages/QuizPage";
import SideMenu from "./components/SideMenu/SideMenu";
import SubjectPage from "./pages/SubjectPage";
import AttemptsPage from "./pages/AttemptsPage";
import QuizAttmptsByID from "./pages/QuizAttmptsByID";
import AdminPage from "./pages/AdminPage";
import QuizMultiPage from "./pages/multiquiz/QuizMultiPage";
import QuizSetListPage from "./pages/QuizSetListPage";
import QuizSetDetailPage from "./pages/QuizSetDetailPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute"; // ProtectedRoute import 추가

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex h-screen p-2 bg-gray-50 overflow-hidden">
      <main className="flex-1 p-2 pr-4 overflow-y-auto">
        <Routes>
          {/* 로그인 페이지는 보호하지 않음 */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 보호된 라우트들 */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainSearchPage />
            </ProtectedRoute>
          } />
          <Route path="/video/:videoId" element={
            <ProtectedRoute>
              <GetVideoPage />
            </ProtectedRoute>
          } />
          <Route path="/video/:videoId/quiz" element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } />
          <Route path="/subject/:subjectId" element={
            <ProtectedRoute>
              <SubjectPage />
            </ProtectedRoute>
          } />
          <Route path="/attempts" element={
            <ProtectedRoute>
              <AttemptsPage />
            </ProtectedRoute>
          } />
          <Route path="/attempts/:quizSetId" element={
            <ProtectedRoute>
              <QuizAttmptsByID />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/quiz/multi/:redisKey" element={
            <ProtectedRoute>
              <QuizMultiPage />
            </ProtectedRoute>
          } />
          <Route path="/quizsets" element={
            <ProtectedRoute>
              <QuizSetListPage />
            </ProtectedRoute>
          } />
          <Route path="/quizsets/:id" element={
            <ProtectedRoute>
              <QuizSetDetailPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* 로그인 페이지가 아니고 인증된 상태일 때만 사이드메뉴 표시 */}
      {!isLoginPage && isAuthenticated && (
        <aside className="h-screen w-1/4 border-l border-gray-200 p-4 bg-white overflow-hidden flex-shrink-0">
          <SideMenu />
        </aside>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
