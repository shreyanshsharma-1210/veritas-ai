import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './components/AppLayout';
import { WorkspacePage } from './pages/WorkspacePage';
import { DiagnosisWizardPage } from './pages/DiagnosisWizardPage';
import { LiveDebatePage } from './pages/LiveDebatePage';
import { RecommendationReportPage } from './pages/RecommendationReportPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Editorial Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Operational Workspace */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<WorkspacePage />} />
          <Route path="new" element={<DiagnosisWizardPage />} />
          <Route path="diagnosis/:id" element={<DiagnosisWizardPage />} />
          <Route path="session/:id" element={<LiveDebatePage />} />
          <Route path="reports/:id" element={<RecommendationReportPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
