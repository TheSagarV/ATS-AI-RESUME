// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import ResumePage from "./pages/ResumePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TemplatesPage from "./pages/TemplatesPage.jsx";
import SavedResumesPage from "./pages/SavedResumesPage.jsx";
import TemplateFormPage from "./pages/TemplateFormPage.jsx"; // ✅ FIXED import
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // if already in project

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Protected Pages */}
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/:templateId"
        element={
          <ProtectedRoute>
            <TemplateFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <SavedResumesPage />
          </ProtectedRoute>
        }
      />

      {/* Public Pages */}
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};

export default App;
