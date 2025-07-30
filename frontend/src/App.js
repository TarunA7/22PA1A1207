import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShortenerForm from "./components/ShortenerForm";
import StatisticsPage from "./components/StatisticsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShortenerForm />} />
        <Route path="/stats" element={<StatisticsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
