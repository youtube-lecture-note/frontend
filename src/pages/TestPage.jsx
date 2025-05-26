import TopBar from "../components/TopBar/TopBar";
import {
  addCategory,
  getCategory,
  quizAttemptsApi,
  quizAttemptsByQuizSetIdApi,
  quizAttemptsByVideoIdApi,
} from "../api/index.js";
import Button from "../components/Button.jsx";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [quizAttempts, setQuizAttempts] = useState([]);

  return (
    <div>
      <TopBar />
      TestPage
      <Button></Button>
    </div>
  );
}
