import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import NewReviewPage from "./pages/NewReviewPage";
import ReviewResultsPage from "./pages/ReviewResultsPage";
import CasesPage from "./pages/CasesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/review/new" element={<NewReviewPage />} />
      <Route path="/review/:id/results" element={<ReviewResultsPage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
