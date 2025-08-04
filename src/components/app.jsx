import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage";
import HistoryPage from "./historyPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}